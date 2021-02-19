package com.example.client_leger.signup.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.signup.model.SignUpRepository
import com.example.client_leger.signup.model.SignUpResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(
        private val signUpRepository: SignUpRepository,
        private val userInfos: UserInfos,
        private val socketConnectionService: SocketConnectionService
): ViewModel() {
    val successfulSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val showSignIn: MutableLiveData<Boolean> = MutableLiveData()
    val userNameToValidate = MutableLiveData<String>()
    val passwordToValidate = MutableLiveData<String>()
    val emailToValidate = MutableLiveData<String>()
    val textErrorIsVisible = MutableLiveData<Boolean>(false)
    fun onClickLogIn() {
        showSignIn.value = true
    }

    fun onClickSignUp() {
        //TODO: send request to create an account

        if(!userNameToValidate.value.isNullOrEmpty() && !passwordToValidate.value.isNullOrEmpty()
                && !emailToValidate.value.isNullOrEmpty()
        ) {
            viewModelScope.launch {

                when (val response = signUpRepository.makeSignUpRequest(
                    userNameToValidate.value!!,
                    emailToValidate.value!!,
                    passwordToValidate.value!!)
                ) {
                    is Result.Success<SignUpResponseModel> -> {
                        userInfos.idplayer.value = response.data.idplayer
                        userInfos.username.value = userNameToValidate.value!!
                        successfulSignUp.value = true
                        textErrorIsVisible.value = false
                        connectToSocket()
                    }
                    else -> {
                        textErrorIsVisible.value = true
                    }
                }
            }
        } else {
            textErrorIsVisible.value = true
        }
    }

    fun connectToSocket() {
        socketConnectionService.mSocket.connect()
        socketConnectionService.mSocket.emit("connectSocketid", userInfos.idplayer.value);
    }


}