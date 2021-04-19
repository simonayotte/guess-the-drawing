package com.example.client_leger.lobby.api

import com.example.client_leger.profile.model.GameHistoryModel
import com.example.client_leger.profile.model.ProfileRequestModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface GameHistoryApi {
    @Headers("Content-Type: application/json")
    @POST("profile/gamehistory")
    suspend fun getGameHistory(@Body profileRequestModel : ProfileRequestModel): Response<ArrayList<GameHistoryModel>>
}