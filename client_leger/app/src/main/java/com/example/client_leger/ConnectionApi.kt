package com.example.client_leger

import com.example.client_leger.loginModel.SignInRequestModel
import com.example.client_leger.loginModel.SignInResponseModel
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface ConnectionApi {

    @Headers("Content-Type: application/json")
    @POST("signin") //TODO: Mettre le bon endpoint ici
    suspend fun signIn(@Body signInRequestModel: SignInRequestModel): SignInResponseModel
}