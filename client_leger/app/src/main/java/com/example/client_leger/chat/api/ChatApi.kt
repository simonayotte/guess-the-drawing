package com.example.client_leger.chat.api

import com.example.client_leger.chat.model.HistoryResponseModel
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.signin.model.SignInRequestModel
import com.example.client_leger.signin.model.SignInResponseModel
import com.google.gson.JsonObject
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface ChatApi {
    @Headers("Content-Type: application/json")
    @POST("messages/history") //TODO: Mettre le bon endpoint ici
    suspend fun history(@Body activeChannel: JsonObject): Response<HistoryResponseModel>
}