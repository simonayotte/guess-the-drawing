package com.example.client_leger.lobby.model

import androidx.lifecycle.MutableLiveData
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.lobby.api.LogOutApi
import com.example.client_leger.utils.MessageResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import com.example.client_leger.utils.UserInfos
import com.google.gson.Gson
import org.json.JSONObject
import java.lang.Exception
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LobbyRepository @Inject constructor(
        private val retrofitApiProvider: RetrofitApiProvider,
        private val socketConnectionService: SocketConnectionService,
        private val userInfos: UserInfos
) {
    private var api: LogOutApi = retrofitApiProvider.getApi(LogOutApi::class.java)

    suspend fun logOut() {
        val userId = userInfos.idplayer.value
        if(userId != null) {
            activeLobbyId.postValue(null)
            lobbies.postValue(listOf())
            loadGame.postValue(false)
            val logOutRequestModel = LogOutRequestModel(userId)
            when (retrofitApiProvider.getResponse(api::logOut, logOutRequestModel)) {
                is Result.Success<MessageResponseModel> -> {
                    socketConnectionService.mSocket.disconnect()
                }
                else -> {
                    println("Logout not successful")
                }
            }
            userInfos.idplayer.postValue(null)
        }
    }

    private val gson = Gson()

    val activeLobbyId = MutableLiveData<Int?>(null)
    val lobbies = MutableLiveData<List<LobbyModel>>(listOf())
    val loadGame = MutableLiveData(false)

    init {
        socketConnectionService.mSocket.on("lobbyListRequested") {
            val newLobbies = gson.fromJson(it[0].toString(), Array<LobbyModel>::class.java)
            lobbies.postValue(newLobbies.toList())
        }
        socketConnectionService.mSocket.on("loadGame") {
            loadGame.postValue(true)
        }
    }

    fun requestLobbyList() {
        socketConnectionService.mSocket.emit("lobbyListRequested")
    }

    fun joinLobby(lobbyId: Int) {
        val lobby = lobbies.value?.find{ lobby -> lobby.id == lobbyId }
        if(lobby != null && lobby.players.size < 4) {
            val json = JSONObject()
                .put("lobbyId", lobbyId)
                .put("userId", userInfos.idplayer.value)
                .put("username", userInfos.username.value)
                .put("avatar", userInfos.avatar.value)
            socketConnectionService.mSocket.emit("lobbyPlayerJoined", json)
            activeLobbyId.value = lobbyId
        }
    }

    fun leaveLobby() {
        val lobbyId = activeLobbyId.value
        val username = userInfos.username.value
        if(lobbyId != null && username != null) {
            val json = JSONObject()
                .put("id", lobbyId)
                .put("username", username)
            socketConnectionService.mSocket.emit("lobbyPlayerLeft", json)
            activeLobbyId.value = null
        }
    }

    fun createLobby(gameMode: LobbyModel.GameMode, difficulty: LobbyModel.Difficulty) {
        val json = JSONObject()
            .put("gamemode", gameMode.value)
            .put("difficulty", difficulty.value)
        socketConnectionService.mSocket.emit("lobbyCreated", json)
    }
}