package com.example.client_leger

import com.example.client_leger.loginModel.SignInRequestModel
import com.example.client_leger.loginModel.SignInResponseModel
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
            .create(ConnectionApi::class.java)

    suspend fun makeLoginRequest(userName: String, password: String) : Result<SignInResponseModel>? {
        return try {
            val body = SignInRequestModel(userName, password)
            val reponse = api.signIn(body)
            Result.Success(reponse)
        } catch (e:Exception) {
            Result.Error(Exception("There was an error with the server"))
        }
    }
}