package com.example.client_leger.leaderboard.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class LeaderboardViewModel @Inject constructor(
) : ViewModel() {
    val goBack: MutableLiveData<Boolean> = MutableLiveData()

    fun onClickBack(){
        goBack.value = true
    }
}