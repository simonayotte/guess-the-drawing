package com.example.client_leger.lobby.viewModel

import android.annotation.SuppressLint
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.lobby.model.LobbyData
import com.example.client_leger.lobby.model.LobbyModel
import com.example.client_leger.lobby.model.LobbyRepository
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.utils.MessageResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject

@HiltViewModel
class LobbyViewModel @Inject constructor(
        private val userInfos: UserInfos,
        private val socketConnectionService: SocketConnectionService,
        private val lobbyRepository: LobbyRepository
) : ViewModel() {

    val successfulSignOut: MutableLiveData<Boolean> = MutableLiveData()
    val chatName = MutableLiveData<String>("Salon 1")
    val message = MutableLiveData<String>("")
    val chatMessage = MutableLiveData<MessageModel>()
    val lobby = MutableLiveData<LobbyModel>()


    init {
        socketConnectionService.mSocket.on("chatMessage") { msg ->
            val data: String = msg[0].toString()
            val json = JSONObject(data)
            var messageModel: MessageModel = MessageModel(
                    json.getString("username"),
                    json.getString("avatar"),
                    json.getString("time"),
                    json.getString("message"));
            chatMessage.postValue(MessageModel(messageModel.messageWriter, messageModel.writerIcon, messageModel.messageTime, messageModel.messageContent))
        }
    }

    fun onClickAddLobby() {
        lobby.value = LobbyModel("Salon Custom", "0/4 joueurs", "Custom")
    }

    fun onClickSendMessage(){
        if (!message.value.isNullOrEmpty() && !message.value.isNullOrBlank()) {
            val sdf = SimpleDateFormat("hh:mm:ss")
            val currentTime = sdf.format(Date())
            chatMessage.value = MessageModel(userInfos.username.value!!, userInfos.avatar.value.toString(), currentTime, message.value!!)
            val jsonMsg = JSONObject() // avant: "{message: '" + message.value.toString() + "', username: '" + userInfos.username.value!! +"', avatar: '" + userInfos.avatar.value.toString() + "', time: '" + currentTime + "'}")
            jsonMsg.put("message",message.value.toString())
            jsonMsg.put("username",userInfos.username.value!!)
            jsonMsg.put("avatar",userInfos.avatar.value.toString())
            jsonMsg.put("time",currentTime)
            socketConnectionService.mSocket.emit("chatMessage", jsonMsg);
            message.value = ""
        }
    }

    fun onClickSignOut(){
        viewModelScope.launch {
            when (lobbyRepository.logOut(userInfos.idplayer.value!!)) {
                is Result.Success<MessageResponseModel> -> {
                    socketConnectionService.mSocket.disconnect()
                    successfulSignOut.value = true
                }
                else -> {
                    println("Logout not successful")
                }
            }
        }
    }
}