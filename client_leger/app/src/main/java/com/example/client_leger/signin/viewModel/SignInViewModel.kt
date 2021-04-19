package com.example.client_leger.signin.viewModel

import android.util.Log
import androidx.lifecycle.*
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.signin.model.SignInRepository
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import com.google.gson.JsonObject
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import javax.inject.Inject


@HiltViewModel
class SignInViewModel @Inject constructor(
        private val signInRepository: SignInRepository,
        private val userInfos: UserInfos,
        private val channelMessages: ChannelMessages,
        private val socketConnectionService: SocketConnectionService
) : ViewModel() {

    val successfulLogin: MutableLiveData<Boolean> = MutableLiveData()
    val showSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val errorMessage = MutableLiveData<String?>(null)
    val userName = MutableLiveData<String>("failix")
    val password = MutableLiveData<String>("123")
    fun onClickSignUp(){
        showSignUp.value = true
    }

    fun onClickLogIn() {
        val username = userName.value ?: return
        val password = password.value ?: return
        if(username.isNotEmpty() and password.isNotEmpty()) {
            viewModelScope.launch {
                when (val response = signInRepository.makeLoginRequest(username, password)) {
                    is Result.Success<SignInResponseModel> -> {
                        userInfos.idplayer.value = response.data.playerid
                        userInfos.username.value = username
                        userInfos.avatar.value = response.data.avatar
                        userInfos.userChannels.value = response.data.userChannels
                        addChannels(response.data.userChannels)
                        userInfos.appChannels.value = response.data.appChannels
                        userInfos.notificationChannel.value = ArrayList<String>()
                        successfulLogin.value = true
                        errorMessage.value = null
                        connectToSocket()
                    } is Result.Error -> {
                        errorMessage.value = response.exception.message
                    }
                }
            }
        } else {
            errorMessage.value = "Aucun champ ne doit être vide."
        }
    }

    fun connectToSocket() {
        socketConnectionService.mSocket.connect()
        socketConnectionService.mSocket.emit("connectSocketid", userInfos.idplayer.value)
        // val jsonChannels = JSONObject("{channels: " + userInfos.userChannels.value?.joinToString(prefix = "[", postfix = "]"){ it -> "\'${it}\'" } + "}")
        userInfos.userChannels.value?.forEach {
            val bodyChannel: JSONObject = JSONObject()
            bodyChannel.put("channel", it)
            socketConnectionService.mSocket.emit("joinChannelRoom", bodyChannel)
        }
    }

    fun addChannels(channels: ArrayList<String>){
        channelMessages.messages.value = mutableMapOf<String, ArrayList<MessageModel>>()
        channels.forEach {
            channelMessages.messages.value?.put(it, ArrayList<MessageModel>())
        }
    }
}
