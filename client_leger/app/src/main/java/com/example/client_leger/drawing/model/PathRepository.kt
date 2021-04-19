package com.example.client_leger.drawing.model

import android.graphics.PointF
import androidx.lifecycle.MutableLiveData
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.lobby.model.LobbyRepository
import com.google.gson.Gson
import dagger.hilt.android.scopes.ViewModelScoped
import org.json.JSONObject
import javax.inject.Inject

@ViewModelScoped
class PathRepository @Inject constructor(
        private val socketConnectionService: SocketConnectionService,
        private val lobbyRepository: LobbyRepository
) {
    private var gson = Gson()
    var firstPoint = MutableLiveData<FirstPointModel>()
    var middlePoint = MutableLiveData<MiddlePointModel>()
    var lastPoint = MutableLiveData<LastPointModel>()
    var pathToErase = MutableLiveData<PathToEraseModel>()
    var commandToExecute = MutableLiveData<String>()
    init {
        val FIRST_POINT: String = "firstPoint"
        val MIDDLE_POINT: String = "middlePoint"
        val LAST_POINT: String = "lastPoint"
        val ERASE_PATH: String = "erasePath"

        socketConnectionService.mSocket.on(FIRST_POINT) {
            val json: String = it[0].toString()
            val newFirstPoint = gson.fromJson<FirstPointModel>(json, FirstPointModel::class.java)
            firstPoint.postValue(newFirstPoint)
        }
        socketConnectionService.mSocket.on(MIDDLE_POINT) {
            val json: String = it[0].toString()
            val newMiddlePoint = gson.fromJson<MiddlePointModel>(json, MiddlePointModel::class.java)
            middlePoint.postValue(newMiddlePoint)
        }
        socketConnectionService.mSocket.on(LAST_POINT) {
            val json: String = it[0].toString()
            val newLastPoint = gson.fromJson<LastPointModel>(json, LastPointModel::class.java)
            lastPoint.postValue(newLastPoint)
        }
        socketConnectionService.mSocket.on(ERASE_PATH) {
            val json = it[0].toString()
            val dataForEraser = gson.fromJson<PathToEraseModel>(json, PathToEraseModel::class.java)
            pathToErase.postValue(dataForEraser)
        }
        socketConnectionService.mSocket.on("undo") {
            commandToExecute.postValue("undo")
        }
        socketConnectionService.mSocket.on("redo"){
            commandToExecute.postValue("redo")
        }
    }

    fun sendFirstPoint(pos:PointF, strokeWidth: Int, color: String) {
        lobbyRepository.activeLobbyId.value?.let {
            val json =
                gson.toJson(FirstPointModel(floatArrayOf(pos.x, pos.y), it, color, strokeWidth))
            socketConnectionService.mSocket.emit("firstPoint", json)
        }
    }

    fun sendMiddlePoint(pos: PointF) {
        lobbyRepository.activeLobbyId.value?.let {
            val json = gson.toJson(MiddlePointModel(floatArrayOf(pos.x, pos.y), it))
            socketConnectionService.mSocket.emit("middlePoint", json)
        }
    }

    fun sendLastPoint(pathId:Int , pos: PointF) {
        lobbyRepository.activeLobbyId.value?.let {
            val json = gson.toJson(LastPointModel(pathId, floatArrayOf(pos.x, pos.y), it))
            socketConnectionService.mSocket.emit("lastPoint", json)
        }
    }

    fun sendPathToErase(pathId: IntArray) {
        lobbyRepository.activeLobbyId.value?.let {
            val json = gson.toJson(PathToEraseModel(pathId, it))
            socketConnectionService.mSocket.emit("erasePath", json)
        }
    }

    fun sendUndoCommand() {
        lobbyRepository.activeLobbyId.value?.let {
            val json = JSONObject().put("room", it)
            socketConnectionService.mSocket.emit("undo", json.toString())
        }
    }

    fun sendRedoCommand() {
        lobbyRepository.activeLobbyId.value?.let {
            val json = JSONObject().put("room", it)
            socketConnectionService.mSocket.emit("redo", json.toString())
        }
    }
}