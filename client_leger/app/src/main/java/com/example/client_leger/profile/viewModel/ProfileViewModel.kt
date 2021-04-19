package com.example.client_leger.profile.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
) : ViewModel() {
    val goBack: MutableLiveData<Boolean> = MutableLiveData()

    fun onClickBack(){
        goBack.value = true
    }
}