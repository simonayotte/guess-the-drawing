package com.example.client_leger.chat.viewModel

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.chat.model.ChatRepository
import com.example.client_leger.chat.model.HistoryResponseModel
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.game.model.PlayerInfo
import com.example.client_leger.lobby.model.LobbyRepository
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChatViewModel @Inject constructor(
        private val chatRepository: ChatRepository,
        private val userInfos: UserInfos,
        private val channelMessages: ChannelMessages,
        private val gameRepository: GameRepository,
        private val lobbyRepository: LobbyRepository) : ViewModel() {

    val chatName = MutableLiveData<String>(userInfos.activeChannel.value)
    val message = MutableLiveData<String>("")

    val guessing = MutableLiveData<Boolean>(false)
    val canGuess = MutableLiveData<Boolean>(false)
    val canHint = MutableLiveData<Boolean>(false)
    val guessMessage = MutableLiveData<String>("")

    init {
        onClickShowHistory()

        gameRepository.currentRound.observeForever { updateGuessHintAvailability() }
        gameRepository.guessesLeft.observeForever { updateGuessHintAvailability() }
        gameRepository.hintsLeft.observeForever { updateGuessHintAvailability() }
        guessMessage.observeForever { updateCanGuess() }
        guessing.observeForever { updateCanGuess() }
    }

    private fun updateGuessHintAvailability() {
        val currentRound = gameRepository.currentRound.value
        if(currentRound != null && currentRound.currentRole == PlayerInfo.RoleType.GUESSING){
            guessing.value = true
            canHint.value = !currentRound.rightOfReply && (gameRepository.hintsLeft.value?: 0) > 0
        } else {
            guessing.value = false
            canHint.value = false
        }
    }

    private fun updateCanGuess() {
        canGuess.value = guessing.value == true && !guessMessage.value.isNullOrBlank() && (gameRepository.guessesLeft.value?: 0) > 0
    }

    fun getChannelName():String {
        return chatName.value.toString()
    }

    fun onClickSendMessage(){
        val username = userInfos.username.value
        val messageText = message.value
        if (!messageText.isNullOrBlank() && username != null) {
            chatRepository.sendMessage(messageText, username)
            message.value = ""
        }
    }

    fun onClickShowHistory(){
        viewModelScope.launch {
            val activeChannel = userInfos.activeChannel.value
            if(!userInfos.activeChannel.value.isNullOrEmpty() && activeChannel != null) {
                when (val response = chatRepository.makeHistoryRequest(activeChannel)) {
                    is Result.Success<HistoryResponseModel> -> {
                        channelMessages.messages.value?.get(activeChannel)?.clear()
                        val history: ArrayList<MessageModel> = response.data.history
                        channelMessages.messages.value?.get(activeChannel)?.addAll(history)
                        channelMessages.messages.postValue(channelMessages.messages.value)
                    }
                    else -> {
                        Log.d("history", "bad")
                    }
                }
            }
        }
    }

    fun onClickGuess() {
        val idPlayer = userInfos.idplayer.value
        val activeLobbyId = lobbyRepository.activeLobbyId.value
        if(canGuess.value == true && idPlayer != null && activeLobbyId != null) {
            gameRepository.guess(idPlayer, guessMessage.value.toString(), activeLobbyId)
            guessMessage.value = ""
        }
    }

    fun onClickHint() {
        val activeLobbyId = lobbyRepository.activeLobbyId.value
        if(canHint.value == true && activeLobbyId != null) {
            gameRepository.hint(activeLobbyId)
        }
    }
}
