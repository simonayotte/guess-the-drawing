package com.example.client_leger.model

import com.example.client_leger.Result
import com.google.gson.GsonBuilder
import dagger.hilt.android.scopes.ViewModelScoped
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedOutputStream
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import javax.inject.Inject


@ViewModelScoped
class LoginRepository @Inject constructor() {
    val gson = GsonBuilder()
            .serializeNulls()
            .disableHtmlEscaping()
            .create()
    private val loginUrl = "https://902d4e0b-5c97-4265-86bc-e8c57a2222af.mock.pstmn.io/login"

    suspend fun makeLoginRequest(userName: String, password: String): Result<LoginResponse>? {
        // On execute sur un autre thread pour pas bloquer le main
        return withContext(Dispatchers.IO) {
            return@withContext try {
                val url = URL(loginUrl)
                (url.openConnection() as? HttpURLConnection)?.run {
                    val jsonBody = createLoginBody(userName, password)
                    println(jsonBody)
                    requestMethod = "POST"
                    setRequestProperty("Content-Type", "application/json; utf-8")
                    setRequestProperty("Accept", "application/json tabarnaque")
                    doOutput = true
                    val writer = OutputStreamWriter(outputStream)
                    writer.write(jsonBody)
                    writer.flush()
                    //outputStream.write(jsonBody.toByteArray())
                    return@run Result.Success(LoginResponse(inputStream.bufferedReader().readText()))
                }
            } catch (e: Exception) {
                return@withContext Result.Error(Exception("Cannot open HttpURLConnection"))
            }
        }
    }

    private fun createLoginBody(userName: String, password: String): String{
        val map: HashMap<String, Any> = HashMap()
        map["username"] = userName
        map["password"] = password
        return gson.toJson(map)
    }
}

data class LoginResponse(val jsonBody: String){
    val loginSuccessful:Boolean = JSONObject(jsonBody).getString("login") == "true"
}