package com.example.client_leger.channel.viewModel

import android.util.Log
import android.view.View
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.findNavController
import com.example.client_leger.R
import com.example.client_leger.channel.model.ChannelRepository
import com.example.client_leger.channel.model.ChannelResponseModel
import com.example.client_leger.channel_join.model.GetAllChannelResponseModel
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject


@HiltViewModel
class ChannelViewModel  @Inject constructor(
    private val channelRepository: ChannelRepository,
    private val userInfos: UserInfos,
    private val channelMessages: ChannelMessages,
) : ViewModel() {

    val channelName = MutableLiveData<String>("")
    val channelWithNewMessage = MutableLiveData<ArrayList<String>>(ArrayList<String>())

    init {

    }

    fun onClickCreateChannel() {
        val newChannelName = channelName.value ?: return
        val idPlayer = userInfos.idplayer.value ?: return
        if(userInfos.appChannels.value?.contains(newChannelName) == false &&
            newChannelName.isNotBlank() && !newChannelName.startsWith("Lobby")
        ){
            viewModelScope.launch {
                when (val response = channelRepository.makeChannelCreationRequest(
                    newChannelName, idPlayer
                )) {
                    is Result.Success<ChannelResponseModel> -> {
                        channelMessages.messages.value?.put(
                            newChannelName,
                            ArrayList<MessageModel>()
                        )
                        userInfos.userChannels.value?.add(newChannelName)
                        userInfos.userChannels.value = userInfos.userChannels.value

                        channelRepository.newChannelCreation(newChannelName)
                        Log.d("createChannel", "succes")
                        channelName.value = ""
                    } else -> {
                        Log.d("createChannel", "bad")
                    }
                }
            }
        } else {
            Log.d("createChannel", "already exists or blank")
        }
    }

    fun onClickGetChannels(view: View) {
        val getChannels = viewModelScope.launch {
            when (val response = channelRepository.makeGetAppChannelsRequest()) {
                is Result.Success<GetAllChannelResponseModel> -> {
                    userInfos.appChannels.value?.clear()
                    val diffChannels = response.data.appChannels.filterNot {
                        userInfos.userChannels.value?.contains(it) == true
                    }
                    userInfos.appChannels.value?.addAll(diffChannels)
                    userInfos.appChannels.postValue(userInfos.appChannels.value)

                    Log.d("getChannels", "success")
                    view.findNavController()
                        .navigate(R.id.action_channelFragment_to_channelJoinFragment)
                } else -> {
                Log.d("getChannels", "bad")
            }
            }
        }
    }
}