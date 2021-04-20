package com.example.client_leger.game.model

import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.example.client_leger.MediaPlayerService
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.ChatRepository
import com.example.client_leger.lobby.model.LobbyRepository
import com.example.client_leger.lobby.model.RoundModel
import com.example.client_leger.utils.UserInfos
import com.google.gson.Gson
import org.json.JSONObject
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.concurrent.schedule

@Singleton
class GameRepository @Inject constructor(
    private val socketConnectionService: SocketConnectionService,
    private val userInfos: UserInfos,
    private val mediaPlayerService: MediaPlayerService,
    private val lobbyRepository: LobbyRepository,
    private val chatRepository: ChatRepository
) {
    private val gson = Gson()
    val currentRound = MutableLiveData<RoundModel?>(null)
    val timeRemaining = MutableLiveData<String>("00:00")
    // if teammate(s) of the artist are guessing the word
    val endGameMessage = MutableLiveData<String>("")
    val players = MutableLiveData<List<PlayerInfo>>(emptyList())

    val MAX_GUESSES = 5 //todo: update with new game modes
    val MAX_HINTS = 3
    val NB_ROUNDS = 4
    val guessesLeft = MutableLiveData<Int>(MAX_GUESSES)
    val hintsLeft = MutableLiveData<Int>(MAX_HINTS)
    val livesLeftDisplay = MutableLiveData<String>("")
    val guessesLeftDisplay = MutableLiveData<String>("")
    val roundLeftDisplay = MutableLiveData<String>("")
    val clearDrawing = MutableLiveData<Boolean>(false)
    var guessWord = "";

    val artistLikedId = MutableLiveData<Int>(-1)
    val artistDislikedId = MutableLiveData<Int>(-1)

    init {
        socketConnectionService.mSocket.on("guessResponse") {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val isGuessCorrect: Boolean = dataJson.getBoolean("isGuessCorrect")
            if(isGuessCorrect){
                mediaPlayerService.goodGuessSound.start();
            } else{
                mediaPlayerService.badGuessSound.start();
            }
        }

        socketConnectionService.mSocket.on("guessResponseIsClose") {
            val data: String = it[0].toString()
            val dataJson: JSONObject = JSONObject(data)
            val isGuessClose: Boolean = dataJson.getBoolean("isGuessClose")
            if(!isGuessClose){
                chatRepository.sendMessage(guessWord, userInfos.username.value.toString())
            }
        }

        socketConnectionService.mSocket.on("gameSetup") {
            val newPlayers = gson.fromJson(it[0].toString(), Array<PlayerInfo>::class.java)
            // to prevent null deserialization from gson
            newPlayers.forEach { player -> player.role = PlayerInfo.RoleType.WATCHING }
            players.postValue(newPlayers.toList())
        }

        socketConnectionService.mSocket.on("newRound") {
            val receivedRound = gson.fromJson(it[0].toString(), NewRoundModel::class.java)

            guessesLeft.postValue(MAX_GUESSES)
            hintsLeft.postValue(MAX_HINTS)
            var newPlayers = emptyList<PlayerInfo>()
            players.value?.let { currentPlayers ->
                newPlayers = setRoles(currentPlayers, false, receivedRound.artistId)
                players.postValue(newPlayers)
            }

            val roundNb = (currentRound.value?.roundNb?: 0) + 1
            val currentPlayerRole = newPlayers.firstOrNull{
                    player -> player.id == userInfos.idplayer.value
            }?.role ?: PlayerInfo.RoleType.GUESSING
            val newRound = RoundModel(roundNb, receivedRound.word, receivedRound.artistId, false, currentPlayerRole)
            currentRound.postValue(newRound)

        }
        socketConnectionService.mSocket.on("rightOfReply") {
            currentRound.value?.let { round ->
                var newPlayers = emptyList<PlayerInfo>()
                players.value?.let { currentPlayers ->
                    newPlayers = setRoles(currentPlayers, true, round.artistId)
                    players.postValue(newPlayers)
                }
                val currentPlayerRole = newPlayers.firstOrNull{
                        player -> player.id == userInfos.idplayer.value
                }?.role ?: PlayerInfo.RoleType.GUESSING
                round.currentRole = currentPlayerRole
                round.rightOfReply = true
                currentRound.postValue(round)
            }
        }

        socketConnectionService.mSocket.on("updateTime") {
            val newTime = gson.fromJson<TimeRemainingModel>(it[0].toString(), TimeRemainingModel::class.java).time
            timeRemaining.postValue(newTime)
        }

        socketConnectionService.mSocket.on("thumbsUp") {
            var newArtistLikedId = gson.fromJson<ThumbsSocketModel>(it[0].toString(), ThumbsSocketModel::class.java)
            artistLikedId.postValue(newArtistLikedId.idplayer)
            Timer().schedule(3000) {
                artistLikedId.postValue(-1)
            }
        }

        socketConnectionService.mSocket.on("thumbsDown") {
            var newartistDisLikedId = gson.fromJson<ThumbsSocketModel>(it[0].toString(), ThumbsSocketModel::class.java)
            artistDislikedId.postValue(newartistDisLikedId.idplayer)
            Timer().schedule(3000) {
                artistDislikedId.postValue(-1)
            }
        }

        socketConnectionService.mSocket.on("endGame") {
            val endGame = gson.fromJson<EndGameModel>(it[0].toString(), EndGameModel::class.java)
            endGameMessage.postValue(endGame.message)
        }

        socketConnectionService.mSocket.on("givePoints") {
            val givePoints = gson.fromJson<GivePointsModel>(it[0].toString(), GivePointsModel::class.java)
            players.value?.forEach { player ->
                for (i in givePoints.players.indices) {
                    if (player.id == givePoints.players[i]) {
                        player.score = givePoints.scores[i]
                    }
                }
            }
            players.postValue(players.value)
        }
        socketConnectionService.mSocket.on("roundInfo") {
            val model = gson.fromJson<RoundInfo>(it[0].toString(), RoundInfo::class.java)
            val livesModel = model.lifeRemaining
            var livesDisplayVal = ""
            if(livesModel != null) {
                val playerIndex = livesModel.players.indexOfFirst{player -> player == userInfos.idplayer.value}
                if(playerIndex != -1 && livesModel.lives.size > playerIndex) {
                    livesDisplayVal = "Vies : " + livesModel.lives[playerIndex]
                }
            }
            val guessesLeftVal = if(model.maxGuess != null && model.guessRemaining != null) "Guess :" + (model.maxGuess - model.guessRemaining) + " / " + model.maxGuess else ""
            val roundLeftVal = if(model.maxRound != null && model.roundRemaining != null) "Round : " + model.roundRemaining + " / " + model.maxRound else ""
            livesLeftDisplay.postValue(livesDisplayVal)
            guessesLeftDisplay.postValue(guessesLeftVal)
            roundLeftDisplay.postValue(roundLeftVal)
        }
    }

    fun sendThumbsUp() {
        val value = currentRound.value;
        if(value != null){
            val json = JSONObject()
                .put("lobbyId", lobbyRepository.activeLobbyId.value)
                .put("idplayer", value.artistId)
            socketConnectionService.mSocket.emit("thumbsUp", json.toString())
        }
    }

    fun sendThumbsDown() {
        val value = currentRound.value;
        if(value != null){
            val json = JSONObject()
                .put("lobbyId", lobbyRepository.activeLobbyId.value)
                .put("idplayer", value.artistId)
            socketConnectionService.mSocket.emit("thumbsDown", json.toString())

        }

    }

    fun startGame(lobbyId: Int) {
        val json = JSONObject().put("lobbyId", lobbyId)
        socketConnectionService.mSocket.emit("startGame", json.toString())
    }

    fun clientIsReady(userId: Int) {
        val json = JSONObject().put("userId", userId)
        socketConnectionService.mSocket.emit("clientReadyToStart", json.toString())
    }

    fun artistIsReady(userId: Int) {
        val json = JSONObject().put("userId", userId)
        socketConnectionService.mSocket.emit("artistIsReady", json.toString())
    }

    fun guess(userId: Int, word: String, room: Int) {
        this.guessWord = word;
        val json = JSONObject()
            .put("userId", userId)
            .put("guess", word)
            .put("room", room)
        socketConnectionService.mSocket.emit("guess", json.toString())
        guessesLeft.value?.let {
            guessesLeft.postValue(it - 1)
        }
    }

    fun hint(room: Int) {
        val json = JSONObject().put("room", room)
        socketConnectionService.mSocket.emit("hint", json)
        hintsLeft.value?.let {
            hintsLeft.postValue(it - 1)
        }
    }

    fun resetGame() {
        currentRound.postValue(null)
        timeRemaining.postValue("00:00")
        endGameMessage.postValue("")
        players.postValue(emptyList())
        guessesLeft.postValue(MAX_GUESSES)
        hintsLeft.postValue(MAX_HINTS)
        livesLeftDisplay.postValue("")
        guessesLeftDisplay.postValue("")
        roundLeftDisplay.postValue("")
        clearDrawing.postValue(false)
        guessWord = "";
        artistLikedId.postValue(-1)
        artistDislikedId.postValue(-1)
    }

    private fun setRoles(players: List<PlayerInfo>, rightOfReply: Boolean, artistId: Int): List<PlayerInfo> {
        val playingTeam = players.firstOrNull { player -> player.id == artistId }?.team
        players.forEach { player ->
            if(player.team == playingTeam){ // artist team
                player.role = when {
                    player.id == artistId -> PlayerInfo.RoleType.DRAWING
                    !rightOfReply -> PlayerInfo.RoleType.GUESSING
                    else -> PlayerInfo.RoleType.WATCHING
                }
            } else {
                    player.role = if(rightOfReply)
                        PlayerInfo.RoleType.GUESSING
                    else
                        PlayerInfo.RoleType.WATCHING
            }
        }
        return players
    }
}