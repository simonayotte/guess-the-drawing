package com.example.client_leger.signin.viewModel

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.utils.Result
import com.example.client_leger.signin.model.SignInRepository
import com.example.client_leger.signin.model.SignInResponseModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val signInRepository: SignInRepository,
    private val socketConnectionService: SocketConnectionService
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
        socketConnectionService.mSocket.emit("chatMessage", "bonjour jerome kotlin a l'appareil")
        if(!userName.value.isNullOrEmpty() and !password.value.isNullOrEmpty()) {
            viewModelScope.launch {
                when (val response = signInRepository.makeLoginRequest(userName.value!!, password.value!!)) {
                    is Result.Success<SignInResponseModel> -> {
                        successfulLogin.value = response.data.loginIsSuccessFull
                        textErrorIsVisible.value = !response.data.loginIsSuccessFull
                        //TODO: setter les credentials de la session ici. Par exemple loader l'avatar, save le id, etc
                    } else -> {
                        textErrorIsVisible.value = true
                    }
                }
            }
        } else {
            textErrorIsVisible.value = true
        }


    }
}