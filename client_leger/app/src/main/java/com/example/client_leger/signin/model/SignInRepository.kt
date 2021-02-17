package com.example.client_leger.signin.model

import android.util.Log
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import dagger.hilt.android.scopes.ViewModelScoped
import java.lang.Exception
import javax.inject.Inject


@ViewModelScoped
class SignInRepository @Inject constructor(
    private val retrofitApiProvider:RetrofitApiProvider
) {

    suspend fun makeLoginRequest(userName: String, password: String) : Result<SignInResponseModel> {
        return try {
            val body = SignInRequestModel(userName, password)
            val response = retrofitApiProvider.api.signIn(body)
            Result.Success(response.body()!!)
        } catch (e:Exception) {
            Result.Error(Exception("There was an error with the server"))
        }
    }
}