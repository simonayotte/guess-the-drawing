package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.UserIdentityApi
import com.example.client_leger.profile.model.LoginHistoryModel
import com.example.client_leger.profile.model.ProfileRequestModel
import com.example.client_leger.profile.model.UserIdentityModel
import javax.inject.Singleton
import javax.inject.Inject
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider

@Singleton
class UserIdentityRepository @Inject constructor (
        private val retrofitApiProvider: RetrofitApiProvider
) {
    private var api: UserIdentityApi = retrofitApiProvider.getApi(UserIdentityApi::class.java)

    suspend fun makeGetLoginHistoryRequest(idplayer : Int) : Result<UserIdentityModel> {
        val body = ProfileRequestModel(idplayer)
        return retrofitApiProvider.getResponse(api::getUserIdentity, body)
    }
}