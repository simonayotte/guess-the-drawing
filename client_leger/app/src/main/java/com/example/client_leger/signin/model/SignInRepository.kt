package com.example.client_leger.signin.model

import com.example.client_leger.lobby.api.LeaderboardApi
import com.example.client_leger.signin.api.SignInApi
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import dagger.hilt.android.scopes.ViewModelScoped
import java.lang.Exception
import javax.inject.Inject
import javax.inject.Singleton


@Singleton
class SignInRepository @Inject constructor(
    private val retrofitApiProvider:RetrofitApiProvider
) {

    private var api: SignInApi = retrofitApiProvider.getApi(SignInApi::class.java)

    suspend fun makeLoginRequest(userName: String, password: String) : Result<SignInResponseModel> {
        val body = SignInRequestModel(userName, password)
        return retrofitApiProvider.getResponse(api::signIn, body)
    }
}