package com.example.client_leger.lobby.model

import com.example.client_leger.lobby.api.GameHistoryApi
import com.example.client_leger.profile.model.GameHistoryModel
import com.example.client_leger.profile.model.ProfileRequestModel
import javax.inject.Singleton
import javax.inject.Inject
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider

@Singleton
class GameHistoryRepository @Inject constructor (
        private val retrofitApiProvider: RetrofitApiProvider
) {
    private var api: GameHistoryApi = retrofitApiProvider.getApi(GameHistoryApi::class.java)

    suspend fun makeGetGameHistoryRequest(idplayer : Int) : Result<ArrayList<GameHistoryModel>> {
        val body = ProfileRequestModel(idplayer)
        return retrofitApiProvider.getResponse(api::getGameHistory, body)
    }
}
