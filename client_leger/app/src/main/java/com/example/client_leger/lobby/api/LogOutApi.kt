package com.example.client_leger.lobby.api

import com.example.client_leger.lobby.model.LogOutRequestModel
import com.example.client_leger.utils.MessageResponseModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface LogOutApi {
    @Headers("Content-Type: application/json")
    @POST("logout")
    suspend fun logOut(@Body logOutRequestModel: LogOutRequestModel): Response<MessageResponseModel>
}