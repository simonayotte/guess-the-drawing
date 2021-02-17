package com.example.client_leger.chat.viewModel

import android.os.Message
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import dagger.hilt.android.lifecycle.HiltViewModel
import org.json.JSONObject
import javax.inject.Inject

@HiltViewModel
class ChatViewModel @Inject constructor(
        private val socketConnectionService: SocketConnectionService
) : ViewModel() {


    val ChatName = MutableLiveData<String>("Salon 1")
    val message = MutableLiveData<String>("")
    // Deux variables sont necessaires pour une liste de MutableLiveData
    private val messages = ArrayList<MessageModel>()
    private val messagesLiveData = MutableLiveData<List<MessageModel>>()

    init {

        socketConnectionService.mSocket.on("chatMessage") { msg ->
            Log.d("NOUVEAU_MESSAGE", msg[0].toString())
            val data: String = msg[0].toString()
            val json = JSONObject(data)
            var messageModel: MessageModel = MessageModel(
                    json.getString("username").toString(),
                    json.getString("avatar").toString(),
                    json.getString("time").toString(),
                    json.getString("message").toString());
            messages.add(messageModel)
            messagesLiveData.value = messages
        }
    }

    fun getLobbyName():String {
        return ChatName.value.toString()
    }

    fun onClickSendMessage(){
        // Ne pas oublier d'update le MutableLiveData apres un add
        if (!message.value.isNullOrBlank()) {
            messages.add(MessageModel("Me","1","15:32:32", message.value.toString() ))
            val jsonMsg = JSONObject("{message:" + message.value.toString() + ", username: 'me', avatar: '1', time: '15:32:32'}")
            socketConnectionService.mSocket.emit("chatMessage", jsonMsg);
            println(message.value.toString())
        }
        messagesLiveData.value = messages
        message.value = ""

    }

    fun onClickShowHistory(){
        println("Historique")
    }

}
