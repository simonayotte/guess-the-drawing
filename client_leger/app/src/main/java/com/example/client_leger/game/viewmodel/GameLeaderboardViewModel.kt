package com.example.client_leger.game.viewmodel

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.game.model.PlayerInfo
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class GameLeaderboardViewModel @Inject constructor(
    private val gameRepository: GameRepository
) : ViewModel() {
    val adapter = GameLeaderboardAdapter(listOf(), gameRepository.artistLikedId , gameRepository.artistDislikedId)
    val thumbsDisableOverlay = MutableLiveData<Boolean>(false)

    init {
        gameRepository.players.observeForever {
            updateLeaderboardData()
        }

    }

    private fun updateLeaderboardData() {
        gameRepository.players.value?.let {
            adapter.players = it
            adapter.notifyDataSetChanged()
            thumbsDisableOverlay.value = false
        }
    }

    fun thumbsUp() {
        gameRepository.sendThumbsUp();
        thumbsDisableOverlay.value = true
    }

    fun thumbsDown() {
        gameRepository.sendThumbsDown();
        thumbsDisableOverlay.value = true
    }
}