package com.example.client_leger

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.loginModel.SignInResponseModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val signInRepository: SignInRepository
) : ViewModel() {

    val successfulLogin: MutableLiveData<Boolean> = MutableLiveData()
    val showSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val userName = MutableLiveData<String>("Julien")
    val password = MutableLiveData<String>("456")
    val textErrorIsVisible = MutableLiveData<Boolean>(false)

    fun onClickSignUp(){
        showSignUp.value = true
    }

    fun onClickLogIn() {
        viewModelScope.launch {
            val result = signInRepository.makeLoginRequest(userName.value!!, password.value!!)
            when (result) {
                is Result.Success<SignInResponseModel> -> {
                    successfulLogin.value = true
                }
                else -> {
                    successfulLogin.value = false
                    textErrorIsVisible.value = true
                }
            }
        }
    }
}