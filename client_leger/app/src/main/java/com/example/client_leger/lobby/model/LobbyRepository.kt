package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.LogOutApi
import com.example.client_leger.utils.MessageResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import dagger.hilt.android.scopes.ViewModelScoped
import java.lang.Exception
import javax.inject.Inject

@ViewModelScoped
class LobbyRepository @Inject constructor(
        private val retrofitApiProvider: RetrofitApiProvider
) {
    private var api: LogOutApi = retrofitApiProvider.getApi(LogOutApi::class.java)

    suspend fun logOut(userId: Int): Result<MessageResponseModel> {
        return try {
            val logOutRequestModel = LogOutRequestModel(userId)
            val response = api.logOut(logOutRequestModel)
            Result.Success(response.body()!!)
        } catch (e: Exception) {
            Result.Error(Exception("LogOut not successful"))
        }
    }
}