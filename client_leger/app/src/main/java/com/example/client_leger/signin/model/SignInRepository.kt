package com.example.client_leger.signin.model

import com.example.client_leger.utils.Result
import com.example.client_leger.signin.api.SignInApi
import dagger.hilt.android.scopes.ViewModelScoped
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.Exception
import javax.inject.Inject


@ViewModelScoped
class SignInRepository @Inject constructor() {
    private val loginUrlw = "https://9921eac1-255e-452c-85a4-f989e66e505e.mock.pstmn.io"
    private val api = Retrofit
            .Builder()
            .baseUrl(loginUrlw)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(SignInApi::class.java)

    suspend fun makeLoginRequest(userName: String, password: String) : Result<SignInResponseModel> {
        return try {
            val body = SignInRequestModel(userName, password)
            val response = api.signIn(body)
            Result.Success(response)
        } catch (e:Exception) {
            Result.Error(Exception("There was an error with the server"))
        }
    }
}