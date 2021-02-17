package com.example.client_leger.signin.activity

import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.lifecycle.ViewModelProvider
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import com.example.client_leger.MainActivity
import com.example.client_leger.R
import com.example.client_leger.signup.activity.SignUpActivity
import com.example.client_leger.databinding.ActivitySignInBinding
import com.example.client_leger.lobby.activity.LobbyActivity
import com.example.client_leger.signin.viewModel.SignInViewModel
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class SiginInActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivitySignInBinding = DataBindingUtil.setContentView(this, R.layout.activity_sign_in)
        val viewModel = ViewModelProvider(this).get(SignInViewModel::class.java)

        binding.viewmodel = viewModel
        binding.lifecycleOwner = this
        val background = findViewById<ConstraintLayout>(R.id.loginColorChange)
        val frameAnimation = background.background as AnimationDrawable
        frameAnimation.setEnterFadeDuration(2000)
        frameAnimation.setExitFadeDuration(4000)
        frameAnimation.start()

        viewModel.successfulLogin.observe(this, Observer {
            if(it) {
                val intent = Intent(this, LobbyActivity::class.java)
                startActivity(intent)
            }
        })

        viewModel.showSignUp.observe(this, Observer {
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        })
    }
}