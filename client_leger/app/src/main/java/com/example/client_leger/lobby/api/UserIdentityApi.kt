package com.example.client_leger.lobby.api
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST
import com.example.client_leger.profile.model.ProfileRequestModel
import com.example.client_leger.profile.model.UserIdentityModel

interface UserIdentityApi {
    @Headers("Content-Type: application/json")
    @POST("profile/identity")
    suspend fun getUserIdentity(@Body profileRequestModel : ProfileRequestModel): Response<UserIdentityModel>
}