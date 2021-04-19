package com.example.client_leger.lobby.api

import com.example.client_leger.profile.model.LoginHistoryModel
import com.example.client_leger.profile.model.ProfileRequestModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface LoginHistoryApi {
    @Headers("Content-Type: application/json")
    @POST("profile/loginhistory")
    suspend fun getLoginHistory(@Body profileRequestModel : ProfileRequestModel): Response<ArrayList<LoginHistoryModel>>
}