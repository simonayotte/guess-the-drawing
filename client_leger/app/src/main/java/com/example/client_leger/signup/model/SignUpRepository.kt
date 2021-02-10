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
    private val loginUrlw = "https://9921eac1-255e-452c-85a4-f989e66e505e.mock.pstmn.io"
    private val api = Retrofit
            .Builder()
            .baseUrl(loginUrlw)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SignUpApi::class.java)

    suspend fun makeSignUpRequest(userName: String, email: String, password: String) : Result<SignUpResponseModel>? {
        return try {
            val body = SignUpRequestModel(userName, email, password)
            val reponse = api.signUp(body)
            println(reponse.signInIsSuccessFull)
            Result.Success(reponse)
        } catch (e: Exception) {
            Result.Error(Exception("There was an error with the server"))
        }
    }
}