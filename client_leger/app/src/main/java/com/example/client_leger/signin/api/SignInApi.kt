package com.example.client_leger.signin.api

import com.example.client_leger.signin.model.SignInRequestModel
import com.example.client_leger.signin.model.SignInResponseModel
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface SignInApi {

    @Headers("Content-Type: application/json")
    @POST("signin") //TODO: Mettre le bon endpoint ici
    suspend fun signIn(@Body signInRequestModel: SignInRequestModel): SignInResponseModel
}