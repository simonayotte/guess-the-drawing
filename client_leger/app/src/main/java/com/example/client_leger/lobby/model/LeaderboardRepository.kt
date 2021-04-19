package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.LeaderboardApi
import com.example.client_leger.lobby.api.LogOutApi
import com.example.client_leger.utils.MessageResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import dagger.hilt.android.scopes.ViewModelScoped
import java.lang.Exception
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class LeaderboardRepository @Inject constructor(
        private val retrofitApiProvider: RetrofitApiProvider
) {

    private var api: LeaderboardApi = retrofitApiProvider.getApi(LeaderboardApi::class.java)

    suspend fun makeGetStatsRequest() : Result<LeaderboardStatsResponse> {
        return retrofitApiProvider.getResponse(api::getStatsLeaderboard)
    }
}