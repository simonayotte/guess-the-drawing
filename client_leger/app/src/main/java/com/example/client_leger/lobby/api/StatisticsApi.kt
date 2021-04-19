package com.example.client_leger.lobby.api
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST
import com.example.client_leger.profile.model.ProfileRequestModel
import com.example.client_leger.profile.model.StatisticsModel

interface StatisticsApi {
    @Headers("Content-Type: application/json")
    @POST("profile/statistics")
    suspend fun getStatistics(@Body profileRequestModel : ProfileRequestModel) : Response<StatisticsModel>
}