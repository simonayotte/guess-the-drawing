package com.example.client_leger.lobby.viewModel

import android.annotation.SuppressLint
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.lobby.model.LobbyData
import com.example.client_leger.lobby.model.LobbyModel
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.*
import javax.inject.Inject

@HiltViewModel
class LobbyViewModel @Inject constructor(
        private val userInfos: UserInfos,
        private val socketConnectionService: SocketConnectionService
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
        if (!message.value.isNullOrEmpty()) {
            val sdf = SimpleDateFormat("hh:mm:ss")
            val currentTime = sdf.format(Date())
            chatMessage.value = MessageModel(userInfos.username.value!!, userInfos.avatar.value.toString(), currentTime, message.value!!)
            val jsonMsg = JSONObject("{message: " + message.value!! + ", username: " + userInfos.username.value!! +", avatar: " + userInfos.avatar.value.toString() + ", time: '" + currentTime + "'}")
            socketConnectionService.mSocket.emit("chatMessage", jsonMsg);
            message.value = ""
        }
    }

    fun onClickSignOut(){
        successfulSignOut.value = true
    }
}