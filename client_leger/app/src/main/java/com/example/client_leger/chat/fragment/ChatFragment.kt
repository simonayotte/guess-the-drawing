package com.example.client_leger.chat.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.chat.model.ChatData
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.chat.model.MessageRecyclerAdapter
import com.example.client_leger.chat.viewModel.ChatViewModel
import com.example.client_leger.databinding.FragmentChatBinding
import com.example.client_leger.lobby.model.LobbyData
import com.example.client_leger.lobby.model.LobbyModel
import com.example.client_leger.lobby.model.LobbyRecyclerAdapter
import com.example.client_leger.lobby.model.TopSpacingItemDecoration
import kotlinx.android.synthetic.main.fragment_chat.*

class Chat : Fragment() {

    private val messageList = getMessages()
    private val messageAdapter = MessageRecyclerAdapter(messageList)


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val binding: FragmentChatBinding = FragmentChatBinding.inflate(inflater, container, false)
        val viewModel = ViewModelProvider(this).get(ChatViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this

//        chat_recycler_view.adapter = messageAdapter
//        chat_recycler_view.layoutManager = LinearLayoutManager(activity)
//        chat_recycler_view.setHasFixedSize(true)
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_chat, container, false)
    }

    private fun getMessages(): ArrayList<MessageModel> {
        return ChatData.createDataSet()
    }
}