package com.example.client_leger

import android.util.Log
import androidx.databinding.BaseObservable
import androidx.databinding.adapters.ListenerUtil
import androidx.lifecycle.MutableLiveData
import io.reactivex.Flowable.just
import io.reactivex.Observable
import io.reactivex.ObservableOnSubscribe
import io.reactivex.Observer
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import java.net.URISyntaxException
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SocketConnectionService @Inject constructor() {
    val url = "http://log3900-server.herokuapp.com/" //"http://log3900-server.herokuapp.com/" // adresse ip locale: ipconfig dans votre terminal -> ip.v4
    lateinit var mSocket: Socket

    init {
        try {
            mSocket = IO.socket(url)
        } catch (e: URISyntaxException) {
            println("Exception" + e)
        }
    }
}
