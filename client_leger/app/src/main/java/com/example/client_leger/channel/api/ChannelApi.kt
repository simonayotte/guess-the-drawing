package com.example.client_leger.channel.api

import com.example.client_leger.channel.model.ChannelLeaveResponseModel
import com.example.client_leger.channel.model.ChannelResponseModel
import com.example.client_leger.channel_join.model.GetAllChannelResponseModel
import com.example.client_leger.chat.model.HistoryResponseModel
import com.google.gson.JsonObject
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface ChannelApi {
    @Headers("Content-Type: application/json")
    @POST("channel/create") //TODO: Mettre le bon endpoint ici
    suspend fun create(@Body data: JsonObject): Response<ChannelResponseModel>

    @Headers("Content-Type: application/json")
    @POST("channel/leave") //TODO: Mettre le bon endpoint ici
    suspend fun leave(@Body data: JsonObject): Response<ChannelLeaveResponseModel>

    @Headers("Content-Type: application/json")
    @POST("channel/join") //TODO: Mettre le bon endpoint ici
    suspend fun join(@Body data: JsonObject): Response<ChannelResponseModel>

    @Headers("Content-Type: application/json")
    @POST("channel/getAllChannels") //TODO: Mettre le bon endpoint ici
    suspend fun getAllChannels(): Response<GetAllChannelResponseModel>
}