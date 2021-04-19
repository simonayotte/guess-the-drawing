package com.example.client_leger.channel_join.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.navigation.findNavController
import androidx.recyclerview.widget.DividerItemDecoration
import com.example.client_leger.R
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.channel_join.viewModel.ChannelJoinViewModel
import com.example.client_leger.channel.model.ChannelRepository
import com.example.client_leger.channel.model.ChannelResponseModel
import com.example.client_leger.channel_join.model.ChannelJoinRecyclerAdapter
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.databinding.FragmentChannelJoinBinding
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import org.json.JSONObject
import javax.inject.Inject

@AndroidEntryPoint
class ChannelJoinFragment : Fragment() {
    @Inject lateinit var socketConnectionService: SocketConnectionService
    @Inject lateinit var channelMessages: ChannelMessages
    @Inject lateinit var userInfos: UserInfos
    @Inject lateinit var channelRepository: ChannelRepository
    private lateinit var channelJoinAdapter : ChannelJoinRecyclerAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {

        // Get a reference to the binding object and inflate the fragment views.
        val binding: FragmentChannelJoinBinding = DataBindingUtil.inflate(
                inflater, R.layout.fragment_channel_join, container, false)

        // Get a reference to the ViewModel associated with this fragment.
        val channelViewModel = ViewModelProvider(this).get(ChannelJoinViewModel::class.java)

        // To use the View Model with data binding, you have to explicitly
        // give the binding object a reference to it.
        binding.viewmodel = channelViewModel
        channelJoinAdapter = ChannelJoinRecyclerAdapter(userInfos.appChannels.value ?: emptyList(), userInfos)
        binding.channelList.adapter = channelJoinAdapter
        binding.channelList.addItemDecoration(DividerItemDecoration(this.context, DividerItemDecoration.VERTICAL))

        userInfos.appChannels.observe(viewLifecycleOwner, {
            channelJoinAdapter.notifyDataSetChanged()
        })

        channelJoinAdapter.channelToJoin.observe(viewLifecycleOwner, Observer {
            val idplayer = userInfos.idplayer.value
            if(idplayer != null && it != null) {
                channelViewModel.viewModelScope.launch {
                    when (val response = channelRepository.makeChannelJoinRequest(it, idplayer)) {
                        is Result.Success<ChannelResponseModel> -> {
                            userInfos.userChannels.value?.add(it)
                            userInfos.userChannels.value = userInfos.userChannels.value
                            channelMessages.messages.value?.set(it, ArrayList<MessageModel>())
                            userInfos.appChannels.value?.remove(it)
                            userInfos.appChannels.postValue(userInfos.appChannels.value)

                            val bodyChannel: JSONObject = JSONObject()
                            bodyChannel.put("channel", it)
                            socketConnectionService.mSocket.emit("joinChannelRoom", bodyChannel )
                            Log.d("joinChannel", "success")
                        } else -> {
                            Log.d("joinChannel", "bad")
                        }
                    }
                }
            }
        })

        binding.backButton.setOnClickListener{ view : View ->
            view.findNavController().navigateUp()
        }
        // Specify the current activity as the lifecycle owner of the binding.
        // This is necessary so that the binding can observe LiveData updates.
        binding.setLifecycleOwner(this)

        return binding.root
    }
}