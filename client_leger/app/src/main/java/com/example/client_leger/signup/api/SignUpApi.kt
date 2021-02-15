package com.example.client_leger.signup.api

import com.example.client_leger.signup.model.SignUpRequestModel
import com.example.client_leger.signup.model.SignUpResponseModel
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface SignUpApi {

    @Headers("Content-Type: application/json")
    @POST("signup") //TODO: Mettre le bon endpoint ici
    suspend fun signUp(@Body signUpRequestModel: SignUpRequestModel): SignUpResponseModel
}