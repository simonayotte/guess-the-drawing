package com.example.client_leger.utils

import com.google.gson.Gson
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.lang.Exception
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RetrofitApiProvider @Inject constructor() {
    private val url = "http://log3900-server.herokuapp.com/"
    fun <T> getApi(klass: Class<T>): T {
        return Retrofit
                .Builder()
                .baseUrl(url)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(klass)
    }

    suspend fun <T, P> getResponse(function: suspend (P) -> Response<T>, param: P) : Result<T> {
        return try {
            val response = function(param)
            handleResponse(response)
        } catch(e:Exception) {
            Result.Error(Exception("Erreur de connexion au serveur."))
        }
    }

    suspend fun <T> getResponse(function: suspend () -> Response<T>) : Result<T> {
        return try {
            val response = function()
            handleResponse(response)
        } catch(e:Exception) {
            Result.Error(Exception("Erreur de connexion au serveur."))
        }
    }

    private var gson = Gson()

    // string() is expected to be called in the IO context
    @Suppress("BlockingMethodInNonBlockingContext")
    private suspend fun <T> handleResponse(response: Response<T>) : Result<T> {
        var errorMessage = "Erreur de connexion au serveur."
        return if(response.isSuccessful) {
            Result.Success(response.body()!!) // !! is allowed since only used in try catch
        } else {
            response.errorBody()?.let {
                val errorBody = withContext(Dispatchers.IO) {
                    it.string()
                }
                errorMessage = gson.fromJson(errorBody, MessageResponseModel::class.java).message
            }

            Result.Error(Exception(errorMessage))
        }
    }
}