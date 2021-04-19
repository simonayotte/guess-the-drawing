package com.example.client_leger.chat.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.EditorInfo
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.MediaPlayerService
import com.example.client_leger.R
import com.example.client_leger.channel.model.ChannelRepository
import com.example.client_leger.chat.model.ChatRepository
import com.example.client_leger.chat.model.MessageRecyclerAdapter
import com.example.client_leger.chat.viewModel.ChatViewModel
import com.example.client_leger.databinding.FragmentChatBinding
import com.example.client_leger.game.view.GameActivity
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.AndroidEntryPoint
import java.lang.Integer.max
import javax.inject.Inject

@AndroidEntryPoint
class Chat : Fragment() {
    @Inject lateinit var mediaPlayerService: MediaPlayerService
    @Inject lateinit var chatRepository: ChatRepository
    @Inject lateinit var channelRepository: ChannelRepository
    @Inject lateinit var userInfos: UserInfos
    @Inject lateinit var channelMessages: ChannelMessages
    private lateinit var messageAdapter : MessageRecyclerAdapter
    private lateinit var binding: FragmentChatBinding
    private var chatViewModel: ChatViewModel? = null
    private var shownChannel: String? = null

    override fun onDestroyView() {
        binding.viewmodel = null
        binding.chatRecyclerView.adapter = null
        chatViewModel = null
        super.onDestroyView()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        if(view == null) {
            // Get a reference to the binding object and inflate the fragment views.
            binding = DataBindingUtil.inflate(
                    inflater, R.layout.fragment_chat, container, false)

            chatViewModel = ViewModelProvider(this).get(ChatViewModel::class.java)
            binding.viewmodel = chatViewModel

            // Specify the current activity as the lifecycle owner of the binding.
            // This is necessary so that the binding can observe LiveData updates.
            binding.lifecycleOwner = this

            shownChannel = userInfos.activeChannel.value
            messageAdapter = MessageRecyclerAdapter(userInfos.username.value ?: "Default")

            // To use the View Model with data binding, you have to explicitly
            // give the binding object a reference to it.
            binding.chatRecyclerView.adapter = messageAdapter
            binding.chatRecyclerView.layoutManager = LinearLayoutManager(context)
            binding.chatRecyclerView.setHasFixedSize(false)

            // Update messages in messageAdapter
            channelMessages.messages.observe(viewLifecycleOwner, {
                val channel = shownChannel
                if(channel !== null) {
                    val messages = it.getOrDefault(channel, ArrayList())
                    messageAdapter.setData(messages)
                    binding.chatRecyclerView.scrollToPosition(max(messages.size - 1, 0))
                }
            })

            channelRepository.notificationSound.observe(viewLifecycleOwner, {
                if(it) {
                    try {
                        mediaPlayerService.notificationChat.start()
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                    channelRepository.notificationSound.value = false
                }
            })

            binding.sendMessage.setOnEditorActionListener { v, actionId, event ->
                when(actionId){
                    EditorInfo.IME_ACTION_SEND -> {
                        chatViewModel?.onClickSendMessage(); true
                    }
                    else -> false
                }
            }
//        chatViewModel.showChannels.observe(viewLifecycleOwner, Observer {
//            this.findNavController().navigate(
//                    SleepTrackerFragmentDirections
//                            .actionSleepTrackerFragmentToSleepQualityFragment(night.nightId))
//            // Reset state to make sure we only navigate once, even if the device
//            // has a configuration change.
//            sleepTrackerViewModel.doneNavigating()
//        })
            binding.backButton.setOnClickListener{
                userInfos.activeChannel.value = ""
//                chatRepository.chatMessage.value = null
//                findNavController().navigateUp()
            }

            userInfos.activeChannel.observe(viewLifecycleOwner, {
                if (it !== shownChannel) {
                    findNavController().navigateUp()
                }
            })

            // Add Guess and Hint buttons if in a game
            if(activity is GameActivity){
                binding.gameButtonsContainer.visibility = View.VISIBLE
            } else {
                binding.gameButtonsContainer.visibility = View.GONE
            }

            return binding.root
        }


        return view
    }
}