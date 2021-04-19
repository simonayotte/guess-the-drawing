package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.LoginHistoryApi
import com.example.client_leger.profile.model.LoginHistoryModel
import com.example.client_leger.profile.model.ProfileRequestModel
import javax.inject.Singleton
import javax.inject.Inject
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider

@Singleton
class LoginHistoryRepository @Inject constructor (
    private val retrofitApiProvider: RetrofitApiProvider
) {
    private var api: LoginHistoryApi = retrofitApiProvider.getApi(LoginHistoryApi::class.java)

    suspend fun makeGetLoginHistoryRequest(idplayer : Int) : Result<ArrayList<LoginHistoryModel>> {
        val body = ProfileRequestModel(idplayer)
        return retrofitApiProvider.getResponse(api::getLoginHistory, body)
    }
}