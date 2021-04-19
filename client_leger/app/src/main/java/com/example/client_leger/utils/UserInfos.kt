package com.example.client_leger.utils

import androidx.lifecycle.MutableLiveData
import dagger.hilt.android.scopes.ServiceScoped
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserInfos @Inject constructor() {
    //TODO: ajouter l'avatar id ici
    val idplayer = MutableLiveData<Int>()
    val username = MutableLiveData<String>()
    val avatar = MutableLiveData<String>()
    val userChannels = MutableLiveData<ArrayList<String>>()
    val appChannels = MutableLiveData<ArrayList<String>>()
    val activeChannel = MutableLiveData<String>()
    val notificationChannel = MutableLiveData<ArrayList<String>>()

    init {
        userChannels.observeForever{
            if(!it.contains(activeChannel.value) && appChannels.value?.contains(activeChannel.value) == false) {
                activeChannel.value = ""
            }
        }
    }
}