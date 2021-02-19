package com.example.client_leger.lobby.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.EditText
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.chat.model.ChatData
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.chat.model.MessageRecyclerAdapter
import com.example.client_leger.databinding.ActivityLobbyBinding
import com.example.client_leger.lobby.model.LobbyData
import com.example.client_leger.lobby.model.LobbyModel
import com.example.client_leger.lobby.model.LobbyRecyclerAdapter
import com.example.client_leger.lobby.model.TopSpacingItemDecoration
import com.example.client_leger.lobby.viewModel.LobbyViewModel
import com.example.client_leger.signin.activity.SiginInActivity
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.activity_lobby.*
import javax.inject.Inject

@AndroidEntryPoint
class LobbyActivity : AppCompatActivity() {
    @Inject lateinit var userInfos: UserInfos
    private val lobbyList = getLobbies()
    private val lobbyAdapter = LobbyRecyclerAdapter(lobbyList)

    private val messageList = ArrayList<MessageModel>()
    private lateinit var messageAdapter : MessageRecyclerAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityLobbyBinding = DataBindingUtil.setContentView(this, R.layout.activity_lobby)
        val viewModel = ViewModelProvider(this).get(LobbyViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this
//        setContentView(R.layout.activity_lobby)

        messageAdapter = MessageRecyclerAdapter(messageList, userInfos.username.value!!)
        initLobbyRecyclerView()
        initChatRecyclerView()

        send_message.setOnEditorActionListener { v, actionId, event ->
            when(actionId){
            EditorInfo.IME_ACTION_SEND -> { viewModel.onClickSendMessage(); true }
            else -> false
            }
        }

        viewModel.successfulSignOut.observe(this, Observer {
            if(it) {
                val intent = Intent(this, SiginInActivity::class.java)
                startActivity(intent)
            }
        })
        viewModel.lobby.observe(this, Observer {
            val index = lobbyList.size
            lobbyList.add(index, it)
            lobbyAdapter.notifyItemInserted(index)
            lobby_recycler_view.scrollToPosition(index);
        })
        viewModel.chatMessage.observe(this, Observer {
            val index = messageList.size
            messageList.add(index, it)
            messageAdapter.notifyItemInserted(index)
            chat_recycler_view.scrollToPosition(index);
        })
    }

    private fun initLobbyRecyclerView() {
        lobby_recycler_view.adapter = lobbyAdapter
        val topSpacingDecorator = TopSpacingItemDecoration(30)
        lobby_recycler_view.addItemDecoration(topSpacingDecorator)
        lobby_recycler_view.layoutManager = LinearLayoutManager(this)
        lobby_recycler_view.setHasFixedSize(false)
    }

    private fun initChatRecyclerView() {
        chat_recycler_view.adapter = messageAdapter
        chat_recycler_view.layoutManager = LinearLayoutManager(this)
        chat_recycler_view.setHasFixedSize(false)
        chat_recycler_view.scrollToPosition(messageList.size);
    }


    private fun getLobbies(): ArrayList<LobbyModel> {
        return LobbyData.createDataSet()
    }

    private fun getMessages(): ArrayList<MessageModel> {
        return ChatData.createDataSet()
    }
}

