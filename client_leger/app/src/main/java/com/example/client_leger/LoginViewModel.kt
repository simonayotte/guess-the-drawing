package com.example.client_leger

import androidx.hilt.lifecycle.R
import androidx.hilt.lifecycle.ViewModelInject
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.model.LoginRepository
import com.example.client_leger.model.LoginResponse
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val loginRepository: LoginRepository
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
            val result = loginRepository.makeLoginRequest(userName.value!!, password.value!!)
            when (result) {
                is Result.Success<LoginResponse> -> {
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