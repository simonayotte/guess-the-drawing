package com.example.client_leger.chat.model

import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.channel.api.ChannelApi
import com.example.client_leger.chat.api.ChatApi
import com.example.client_leger.signin.model.SignInRequestModel
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import com.example.client_leger.utils.UserInfos
import com.google.gson.JsonObject
import org.json.JSONObject
import java.lang.Exception
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ChatRepository @Inject constructor(
    private val retrofitApiProvider: RetrofitApiProvider,
    private val userInfos: UserInfos,
    private val channelMessages: ChannelMessages,
    private val socketConnectionService: SocketConnectionService
){
    private var api: ChatApi = retrofitApiProvider.getApi(ChatApi::class.java)

    suspend fun makeHistoryRequest(activeChannel: String) : Result<HistoryResponseModel> {
        val body: JsonObject = JsonObject()
        body.addProperty("channel", activeChannel)
        return retrofitApiProvider.getResponse(api::history, body)
    }

    init {
        socketConnectionService.mSocket.on("chatMessage") { msg ->
            val data: String = msg[0].toString()
            val json = JSONObject(data)
            val room = json.getString("room")
            val messageModel: MessageModel = MessageModel(
                json.getString("username"),
                json.getString("avatar"),
                json.getString("time"),
                json.getString("message"))
            channelMessages.messages.value?.get(room)?.add(messageModel)
            if (room == userInfos.activeChannel.value) {
                // only notify new message (and scroll to bottom) if in room
                channelMessages.messages.postValue(channelMessages.messages.value)
            }
        }
    }

    fun sendMessage(message: String, username: String) {
        val jsonMsg = JSONObject() // avant: "{message: '" + message.value.toString() + "', username: '" + userInfos.username.value +"', avatar: '" + userInfos.avatar.value.toString() + "', time: '" + currentTime + "'}")
        jsonMsg.put("message",message)
        jsonMsg.put("username", username)
        jsonMsg.put("avatar",userInfos.avatar.value.toString())
        jsonMsg.put("time","")
        jsonMsg.put("room",userInfos.activeChannel.value.toString())
        jsonMsg.put("idPlayer",userInfos.idplayer.value.toString())
        socketConnectionService.mSocket.emit("chatMessage", jsonMsg);
    }

}