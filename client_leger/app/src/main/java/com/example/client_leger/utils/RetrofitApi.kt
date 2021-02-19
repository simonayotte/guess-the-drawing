package com.example.client_leger.utils

import com.example.client_leger.signin.api.SignInApi
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.reflect.KClass

@Singleton
class RetrofitApiProvider @Inject constructor() {
    private val url = "http://log3900-server.herokuapp.com/"
    fun <T> getApi(klass: Class<T>): T {
        return Retrofit
                .Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(klass)
    }
    //TODO: remove this and use getApi in loginviewmodel et signupviewmodel
    val api = Retrofit
        .Builder()
        .baseUrl(url)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(SignInApi::class.java)
}