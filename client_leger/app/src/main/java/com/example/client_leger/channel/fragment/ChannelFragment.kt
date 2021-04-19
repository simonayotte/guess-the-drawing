package com.example.client_leger.channel.fragment

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import com.example.client_leger.MediaPlayerService
import com.example.client_leger.R
import com.example.client_leger.channel.model.*
import com.example.client_leger.channel.viewModel.ChannelViewModel
import com.example.client_leger.databinding.FragmentChannelBinding
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import java.lang.Exception
import javax.inject.Inject


@AndroidEntryPoint
class ChannelFragment : Fragment() {
    @Inject lateinit var mediaPlayerService: MediaPlayerService
    @Inject lateinit var channelRepository: ChannelRepository
    @Inject lateinit var channelMessages: ChannelMessages
    @Inject lateinit var userInfos: UserInfos
    private lateinit var channelAdapter : ChannelRecyclerAdapter
    private lateinit var binding: FragmentChannelBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Get a reference to the binding object and inflate the fragment views.
        binding = DataBindingUtil.inflate(
            inflater, R.layout.fragment_channel, container, false
        )
        mediaPlayerService.createNotification(requireContext())

        val channelViewModel = ViewModelProvider(this).get(ChannelViewModel::class.java)

        // To use the View Model with data binding, you have to explicitly
        // give the binding object a reference to it.
        binding.viewModel = channelViewModel
        channelAdapter = ChannelRecyclerAdapter(arrayListOf(), userInfos)
        binding.channelList.adapter = channelAdapter
        binding.channelList.addItemDecoration(
            DividerItemDecoration(
                this.context,
                DividerItemDecoration.VERTICAL
            )
        )

        userInfos.userChannels.observe(viewLifecycleOwner, {
            channelAdapter.channels = it
            channelAdapter.notifyDataSetChanged()
        })

        userInfos.notificationChannel.observe(viewLifecycleOwner, {
            channelAdapter.notifyDataSetChanged()
        })

        channelAdapter.channelToDelete.observe(viewLifecycleOwner, Observer {
            val idPlayer = userInfos.idplayer.value
            if(idPlayer != null && it != null) {
                channelViewModel.viewModelScope.launch {
                    when (val response = channelRepository.makeChannelLeaveRequest(it, idPlayer)) {
                        is Result.Success<ChannelLeaveResponseModel> -> {
                            userInfos.userChannels.value?.remove(it)
                            userInfos.userChannels.value = userInfos.userChannels.value
                            channelMessages.messages.value?.remove(it)

                            channelRepository.leaveChannelRoom(it, response.data.isChannelDeleted)
                        }
                        else -> {
                            Log.d("deleteChannel", "bad")
                        }
                    }
                }
            }
        })

        userInfos.activeChannel.observe(viewLifecycleOwner, {
            if (!it.isNullOrEmpty() && findNavController().currentDestination?.id == R.id.channelFragment) {
                findNavController().navigate(R.id.action_channelFragment_to_chat)
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

        binding.findChannel.setOnClickListener{ view: View ->
            channelViewModel.onClickGetChannels(view)
        }
        // Specify the current activity as the lifecycle owner of the binding.
        // This is necessary so that the binding can observe LiveData updates.
        binding.lifecycleOwner = this

        return binding.root
    }
}