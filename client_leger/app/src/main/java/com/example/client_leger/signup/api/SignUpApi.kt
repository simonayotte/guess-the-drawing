package com.example.client_leger.signup.api

import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.signup.model.SignUpRequestModel
import com.example.client_leger.signup.model.SignUpResponseModel
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

interface SignUpApi {

    @Headers("Content-Type: application/json")
    @POST("signup")
    suspend fun signUp(@Body signUpRequestModel: SignUpRequestModel): Response<SignInResponseModel>
}