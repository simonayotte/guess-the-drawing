package com.example.client_leger

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket
import java.net.URISyntaxException
import javax.inject.Inject

class SocketConnectionService @Inject constructor() {
    val url = "http://192.168.1.106:4000" // adresse ip locale: ipconfig dans votre terminal -> ip.v4
    lateinit var mSocket: Socket
    init {
        try {
            mSocket = IO.socket(url)
            mSocket.connect()
                .on("chatMessage") { args ->
                    onNewMessage(args[0].toString())
                }
        } catch (e: URISyntaxException) {
            println("Exception" + e)
        }
    }

    fun onNewMessage(message: String) {
        Log.d("NEW_MESSAGE", message);
    }
}