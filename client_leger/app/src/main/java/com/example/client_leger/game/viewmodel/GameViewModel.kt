package com.example.client_leger.game.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.UndoRedo.service.CommandInvoker
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.lobby.model.RoundModel
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class GameViewModel @Inject constructor(
    private val gameRepository: GameRepository,
    private val userInfos: UserInfos,
    private val commandInvoker: CommandInvoker
) : ViewModel() {
    // properties needed for UI
    val timer: LiveData<String>
        get() = gameRepository.timeRemaining
    val currentRound: LiveData<RoundModel?>
        get() = gameRepository.currentRound
    val guessesLeft: LiveData<Int>
        get() = gameRepository.guessesLeft
    val hintsLeft: LiveData<Int>
        get() = gameRepository.hintsLeft
    val endGameMessage: LiveData<String>
        get() = gameRepository.endGameMessage
    val MAX_GUESSES = gameRepository.MAX_GUESSES
    val NB_ROUNDS = gameRepository.NB_ROUNDS
    val MAX_HINTS = gameRepository.MAX_HINTS
    // visuals updated from data
    val secretWord = MutableLiveData("") //format _ _ _ _
    val guessesLeftDisplay: LiveData<String>
        get() = gameRepository.guessesLeftDisplay
    val livesLeftDisplay: LiveData<String>
        get() = gameRepository.livesLeftDisplay
    val roundLeftDisplay: LiveData<String>
        get() = gameRepository.roundLeftDisplay

    init {
        gameRepository.currentRound.observeForever{ if(it != null) setSecretWord(it.word, it.artistId) }
        gameRepository.clearDrawing.observeForever{ if(it) commandInvoker.newDrawing()}
    }

    override fun onCleared() {
        gameRepository.resetGame();
        super.onCleared()
    }

    private fun setSecretWord(word: String, artistId: Int) {
        if (userInfos.idplayer.value == artistId) {
            secretWord.value = word
        } else {
            var newWord = " "
            word.forEach { newWord += if (it == ' ') "   " else "_ " }
            secretWord.value = newWord
        }
    }

    fun clientIsReady() {
        userInfos.idplayer.value?.let {
            gameRepository.clientIsReady(it)
        }
    }

    fun artistIsReady() {
        userInfos.idplayer.value?.let {
            gameRepository.artistIsReady(it)
        }
    }
}