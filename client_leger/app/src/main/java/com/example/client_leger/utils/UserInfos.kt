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
    val avatar = MutableLiveData<Int>()
}