package com.example.client_leger.signin.viewModel

import android.util.Log
import androidx.lifecycle.*
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.signin.model.SignInRepository
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject
import javax.inject.Inject


@HiltViewModel
class SignInViewModel @Inject constructor(
        private val signInRepository: SignInRepository,
        private val userInfos: UserInfos,
        private val socketConnectionService: SocketConnectionService
) : ViewModel() {

    val successfulLogin: MutableLiveData<Boolean> = MutableLiveData()
    val showSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val userName = MutableLiveData<String>("jaykot")
    val password = MutableLiveData<String>("123")
    val textErrorIsVisible = MutableLiveData<Boolean>(false)

    init {
        socketConnectionService.mSocket.on("playerInfo") { infos ->
            val data: String = infos[0].toString()
            val json = JSONObject(data)
            userInfos.avatar.postValue(json.getString("avatar").toInt())
        }
    }

    fun onClickSignUp(){
        showSignUp.value = true
    }

    fun onClickLogIn() {
        if(!userName.value.isNullOrEmpty() and !password.value.isNullOrEmpty()) {
            viewModelScope.launch {
                when (val response = signInRepository.makeLoginRequest(userName.value!!, password.value!!)) {
                    is Result.Success<SignInResponseModel> -> {
                        userInfos.idplayer.value = response.data.playerid
                        userInfos.username.value = userName.value!!
                        successfulLogin.value = true
                        textErrorIsVisible.value = false
                        connectToSocket()
                    } else -> {
                        textErrorIsVisible.value = true
                    }
                }
            }
        } else {
            textErrorIsVisible.value = true
        }
    }

    fun connectToSocket() {
        socketConnectionService.mSocket.emit("connectSocketid", userInfos.idplayer.value);
    }
}
