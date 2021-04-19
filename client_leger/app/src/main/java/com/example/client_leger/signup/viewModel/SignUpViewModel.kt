package com.example.client_leger.signup.viewModel

import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.signup.model.SignUpRepository
import com.example.client_leger.utils.ChannelMessages
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import org.json.JSONObject
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(
        private val signUpRepository: SignUpRepository,
        private val userInfos: UserInfos,
        private val channelMessages: ChannelMessages,
        private val socketConnectionService: SocketConnectionService
): ViewModel() {
    val successfulSignUp: MutableLiveData<Boolean> = MutableLiveData()
    val showSignIn: MutableLiveData<Boolean> = MutableLiveData()
    val errorMessage = MutableLiveData<String?>(null)
    val userNameToValidate = MutableLiveData<String>()
    val passwordToValidate = MutableLiveData<String>()
    val emailToValidate = MutableLiveData<String>()
    val firstNameToValidate = MutableLiveData<String>()
    val lastNameToValidate = MutableLiveData<String>()
    fun onClickLogIn() {
        showSignIn.value = true
    }

    fun onClickSignUp() {
        val username = userNameToValidate.value
        val password = passwordToValidate.value
        val email = emailToValidate.value
        val firstName = firstNameToValidate.value
        val lastName = lastNameToValidate.value
        if(!username.isNullOrEmpty() && !password.isNullOrEmpty()
                && !email.isNullOrEmpty() && !firstName.isNullOrEmpty()
            && !lastName.isNullOrEmpty()
        ) {
            if(username.length > 30 || password.length >  30 || email.length > 30 || firstName.length > 30 || lastName.length > 30) {
                errorMessage.value = "Aucun champ ne doit dépasser 30 caractères."
            } else {
                viewModelScope.launch {

                    when (val response = signUpRepository.makeSignUpRequest(
                        username,
                        email,
                        password,
                        firstName,
                        lastName)
                    ) {
                        is Result.Success<SignInResponseModel> -> {
                            userInfos.idplayer.value = response.data.playerid
                            userInfos.username.value = username
                            userInfos.avatar.value = response.data.avatar
                            userInfos.userChannels.value = response.data.userChannels
                            addChannels(response.data.userChannels)
                            userInfos.appChannels.value = response.data.appChannels
                            userInfos.notificationChannel.value = ArrayList<String>()
                            successfulSignUp.value = true
                            errorMessage.value = null
                            connectToSocket()
                        } is Result.Error -> {
                            errorMessage.value = response.exception.message
                            }
                        }
                }
            }

        } else {
            errorMessage.value = "Aucun champ ne doit être vide."
        }
    }

    fun connectToSocket() {
        socketConnectionService.mSocket.connect()
        socketConnectionService.mSocket.emit("connectSocketid", userInfos.idplayer.value);
        userInfos.userChannels.value?.forEach {
            val bodyChannel: JSONObject = JSONObject()
            bodyChannel.put("channel", it)
            socketConnectionService.mSocket.emit("joinChannelRoom", bodyChannel)
        }
    }

    fun addChannels(channels: ArrayList<String>){
        channelMessages.messages.value = mutableMapOf<String, ArrayList<MessageModel>>()
        channels.forEach {
            channelMessages.messages.value?.put(it, ArrayList<MessageModel>())
        }
    }


}