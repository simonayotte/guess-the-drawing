package com.example.client_leger.signup.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.signup.model.SignUpRepository
import com.example.client_leger.signup.model.SignUpResponseModel
import com.example.client_leger.utils.Result
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(
        private val signUpRepository: SignUpRepository
): ViewModel() {
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
        viewModelScope.launch {
            when (signUpRepository.makeSignUpRequest(
                    userNameToValidate.value!!,
                    emailToValidate.value!!,
                    passwordToValidate.value!!
            )) {
                is Result<SignUpResponseModel> -> successfulSignUp.value = true
                else -> successfulSignUp.value = false
            }
        }
    }


}