package com.example.client_leger.signup.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class SignUpViewModel: ViewModel() {
    val successfulSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val showSignIn: MutableLiveData<Boolean> = MutableLiveData()
    val userNameToValidate = MutableLiveData<String>()
    val passwordToValidate = MutableLiveData<String>()
    val emailToValidate = MutableLiveData<String>()

    fun onClickLogIn() {
        showSignIn.value = true
    }

    fun onClickSignUp() {
        //TODO: send request to create an account
        //username, email and pw are already bind
        successfulSignUp.value = true
    }


}