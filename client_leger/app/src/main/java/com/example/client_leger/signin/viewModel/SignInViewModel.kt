package com.example.client_leger.signin.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.utils.Result
import com.example.client_leger.signin.model.SignInRepository
import com.example.client_leger.signin.model.SignInResponseModel
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
            when (signInRepository.makeLoginRequest(userName.value!!, password.value!!)) {
                is Result.Success<SignInResponseModel> -> {
                    successfulLogin.value = true
                    //TODO: setter les credentials de la session ici. Par exemple loader l'avatar, save le id, etc
                }
                else -> {
                    successfulLogin.value = false
                    textErrorIsVisible.value = true
                }
            }
        }
    }
}