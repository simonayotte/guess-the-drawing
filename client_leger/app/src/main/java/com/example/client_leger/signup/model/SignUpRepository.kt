package com.example.client_leger.signup.model

import com.example.client_leger.signin.model.SignInResponseModel
import com.example.client_leger.signup.api.SignUpApi
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.RetrofitApiProvider
import dagger.hilt.android.scopes.ViewModelScoped
import javax.inject.Inject

@ViewModelScoped
class SignUpRepository @Inject constructor(
        private val retrofitApiProvider: RetrofitApiProvider
) {

    private var api: SignUpApi = retrofitApiProvider.getApi(SignUpApi::class.java)

    suspend fun makeSignUpRequest(username: String, email: String, password: String, firstName: String, lastName: String) : Result<SignInResponseModel> {
        val body = SignUpRequestModel(username, email, password, firstName, lastName)
        return retrofitApiProvider.getResponse(api::signUp, body)
    }
}