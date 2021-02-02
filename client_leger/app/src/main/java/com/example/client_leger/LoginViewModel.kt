package com.example.client_leger

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class LoginViewModel : ViewModel() {
    val successfulLogin: MutableLiveData<Boolean> = MutableLiveData()
    val showSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val userName = MutableLiveData<String>()
    val password = MutableLiveData<String>()
    fun onClickSignUp(){
        showSignUp.value = true
    }
    fun onClickLogIn() {
        //TODO: verify the credentials with the database here
        // username and password are already bind to the view
        successfulLogin.value = true
    }
}