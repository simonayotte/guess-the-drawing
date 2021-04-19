package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.StatisticsApi
import com.example.client_leger.profile.model.ProfileRequestModel
import com.example.client_leger.profile.model.StatisticsModel
import javax.inject.Singleton
import javax.inject.Inject
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider

@Singleton
class StatisticsRepository @Inject constructor (
        private val retrofitApiProvider: RetrofitApiProvider
) {
    private var api: StatisticsApi = retrofitApiProvider.getApi(StatisticsApi::class.java)

    suspend fun makeGetStatisticsRequest(idplayer : Int) : Result<StatisticsModel> {
        val body = ProfileRequestModel(idplayer)
        return retrofitApiProvider.getResponse(api::getStatistics, body)
    }
}

