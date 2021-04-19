package com.example.client_leger.channel.model

import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.channel.api.ChannelApi
import com.example.client_leger.channel_join.model.GetAllChannelResponseModel
import com.example.client_leger.chat.model.HistoryResponseModel
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.lobby.api.LeaderboardApi
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
class ChannelRepository @Inject constructor(
    private val retrofitApiProvider: RetrofitApiProvider,
    private val socketConnectionService: SocketConnectionService,
    private val userInfos: UserInfos,
    private val channelMessages: ChannelMessages,
){

    private var api: ChannelApi = retrofitApiProvider.getApi(ChannelApi::class.java)

    val notificationSound = MutableLiveData(false)

    suspend fun makeChannelCreationRequest(newChannel: String, idPlayer: Int) : Result<ChannelResponseModel> {
        val body: JsonObject = JsonObject()
        body.addProperty("channel", newChannel)
        body.addProperty("idplayer", idPlayer.toString())
        return retrofitApiProvider.getResponse(api::create, body)
    }

    suspend fun makeChannelLeaveRequest(channel: String, idPlayer: Int) : Result<ChannelLeaveResponseModel> {
        val body: JsonObject = JsonObject()
        body.addProperty("channel", channel)
        body.addProperty("idplayer", idPlayer.toString())
        return retrofitApiProvider.getResponse(api::leave, body)
    }

    suspend fun makeChannelJoinRequest(channel: String, idPlayer: Int) : Result<ChannelResponseModel> {
        val body: JsonObject = JsonObject()
        body.addProperty("channel", channel)
        body.addProperty("idplayer", idPlayer.toString())
        return retrofitApiProvider.getResponse(api::join, body)
    }

    suspend fun makeGetAppChannelsRequest() : Result<GetAllChannelResponseModel> {
        return retrofitApiProvider.getResponse(api::getAllChannels)
    }

    fun newChannelCreation(newChannelName: String) {
        val bodyChannel: JSONObject = JSONObject()
        bodyChannel.put("channel", newChannelName)
        socketConnectionService.mSocket.emit("newChannelCreation", bodyChannel);
    }

    fun leaveChannelRoom(channel: String, isChannelDeleted: Boolean) {
        val bodyChannel: JSONObject = JSONObject()
        bodyChannel.put("channel", channel)
        bodyChannel.put("isChannelDeleted", isChannelDeleted)
        socketConnectionService.mSocket.emit("leaveChannelRoom", bodyChannel)
    }

    init {
        val NEW_CHANNEL_CREATION: String = "newChannelCreation"
        socketConnectionService.mSocket.on(NEW_CHANNEL_CREATION) {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val channel: String = dataJson.getString("channel")
            userInfos.appChannels.value?.add(channel)
            userInfos.appChannels.postValue(userInfos.appChannels.value)
        }

        socketConnectionService.mSocket.on("chatNotification"){
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val channel: String = dataJson.getString("channelName")


            if(channel != userInfos.activeChannel.value.toString()) {
                notificationSound.postValue(true)
                if(userInfos.notificationChannel.value?.contains(channel) == false){
                    userInfos.notificationChannel.value?.let { channelTampon ->
                        channelTampon.add(channel)
                        userInfos.notificationChannel.postValue(channelTampon)
                    }
                }
            }

        }

        val CHANNEL_DELETED: String = "channelDeleted"
        if (socketConnectionService.mSocket.hasListeners(CHANNEL_DELETED)) {
            socketConnectionService.mSocket.off(CHANNEL_DELETED)
        }
        socketConnectionService.mSocket.on(CHANNEL_DELETED) {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val channel: String = dataJson.getString("channel")
            userInfos.appChannels.value?.remove(channel)
            userInfos.appChannels.postValue(userInfos.appChannels.value)
        }

        socketConnectionService.mSocket.on("joinChannelLobby") {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val channelName: String = dataJson.getString("channelName")
            if(userInfos.userChannels.value?.contains(channelName) != true){
                channelMessages.messages.value?.put(channelName, ArrayList<MessageModel>())
                userInfos.userChannels.value?.add(channelName)
                userInfos.userChannels.postValue(userInfos.userChannels.value)
            }
            val sentJson = JSONObject()
                .put("channel", channelName)
            socketConnectionService.mSocket.emit("joinChannelRoom", sentJson)
        }

        socketConnectionService.mSocket.on("leaveChannelLobby") {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val channelName: String = dataJson.getString("channelName")
            channelMessages.messages.value?.remove(channelName)
            userInfos.userChannels.value?.remove(channelName)
            userInfos.userChannels.postValue(userInfos.userChannels.value)
            val sentJson = JSONObject()
                    .put("channel", channelName)
                    .put("isChannelDeleted", false)
            socketConnectionService.mSocket.emit("leaveChannelRoom", sentJson)
        }

        socketConnectionService.mSocket.on("toggleChat") {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val lobbyId = dataJson.getInt("lobbyid")
            userInfos.activeChannel.postValue("Lobby $lobbyId")
        }
    }
}