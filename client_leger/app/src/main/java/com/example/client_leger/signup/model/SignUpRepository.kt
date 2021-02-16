package com.example.client_leger.signup.model

import com.example.client_leger.signup.api.SignUpApi
import com.example.client_leger.utils.Result
import dagger.hilt.android.scopes.ViewModelScoped
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.Exception
import javax.inject.Inject

@ViewModelScoped
class SignUpRepository @Inject constructor() {
    private val loginUrl = "http://log3900-server.herokuapp.com/"
    private val api = Retrofit
            .Builder()
            .baseUrl(loginUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SignUpApi::class.java)

    suspend fun makeSignUpRequest(username: String, email: String, password: String) : Result<SignUpResponseModel> {
        return try {
            val body = SignUpRequestModel(username, email, password)
            val response = api.signUp(body)
            Result.Success(response)
        } catch (e: Exception) {
            Result.Error(Exception("There was an error with the server"))
        }
    }
}