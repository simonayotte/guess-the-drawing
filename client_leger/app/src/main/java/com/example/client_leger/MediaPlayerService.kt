package com.example.client_leger

import android.content.Context
import android.media.MediaPlayer
import io.socket.client.IO
import io.socket.client.Socket
import java.net.URISyntaxException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class MediaPlayerService @Inject constructor() {
    lateinit var notificationChat: MediaPlayer;
    lateinit var goodGuessSound: MediaPlayer;
    lateinit var badGuessSound: MediaPlayer;

    fun createNotification(context: Context){
        notificationChat = MediaPlayer.create(context, R.raw.notif)
    }

    fun createGoodGuessSound(context: Context){
        goodGuessSound = MediaPlayer.create(context, R.raw.bonus)
    }
    fun createBadGuessSound(context: Context){
        badGuessSound = MediaPlayer.create(context, R.raw.piano)
    }
}