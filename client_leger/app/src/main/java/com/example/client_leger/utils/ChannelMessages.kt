package com.example.client_leger.utils

import androidx.lifecycle.MutableLiveData
import com.example.client_leger.chat.model.MessageModel
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ChannelMessages @Inject constructor() {
    val messages = MutableLiveData<MutableMap<String, ArrayList<MessageModel>>>()

}