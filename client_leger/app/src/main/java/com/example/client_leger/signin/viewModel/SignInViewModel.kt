package com.example.client_leger.signin.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.utils.Result
import com.example.client_leger.signin.model.SignInRepository
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val signInRepository: SignInRepository,
    private val userInfos: UserInfos
) : ViewModel() {

    val successfulLogin: MutableLiveData<Boolean> = MutableLiveData()
    val showSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val userName = MutableLiveData<String>("jaykot")
    val password = MutableLiveData<String>("123")
    val textErrorIsVisible = MutableLiveData<Boolean>(false)

    fun onClickSignUp(){
        showSignUp.value = true
    }

    fun onClickLogIn() {
        if(!userName.value.isNullOrEmpty() and !password.value.isNullOrEmpty()) {
            viewModelScope.launch {
                when (val response = signInRepository.makeLoginRequest(userName.value!!, password.value!!)) {
                    is Result.Success<SignInResponseModel> -> {
                        userInfos.idplayer.value = response.data.playerid
                        successfulLogin.value = true
                        textErrorIsVisible.value = false
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