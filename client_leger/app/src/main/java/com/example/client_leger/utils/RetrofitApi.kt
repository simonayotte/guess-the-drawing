package com.example.client_leger.utils

import com.example.client_leger.signin.api.SignInApi
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RetrofitApiProvider @Inject constructor() {
    private val loginUrlw = "http://log3900-server.herokuapp.com/"
    val api = Retrofit
        .Builder()
        .baseUrl(loginUrlw)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(SignInApi::class.java)
}