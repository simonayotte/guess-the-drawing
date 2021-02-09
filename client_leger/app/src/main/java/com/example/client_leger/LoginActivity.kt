package com.example.client_leger

import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.lifecycle.ViewModelProvider
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModel
import androidx.lifecycle.get
import com.example.client_leger.databinding.ActivityLoginBinding
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityLoginBinding = DataBindingUtil.setContentView(this, R.layout.activity_login)
        val viewModel = ViewModelProvider(this).get(LoginViewModel::class.java)

        binding.viewmodel = viewModel
        binding.lifecycleOwner = this
        val background = findViewById<ConstraintLayout>(R.id.loginColorChange)
        val frameAnimation = background.background as AnimationDrawable
        frameAnimation.setEnterFadeDuration(2000)
        frameAnimation.setExitFadeDuration(4000)
        frameAnimation.start()

        viewModel.successfulLogin.observe(this, Observer {
            if(it) {
                val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
            }
        })

        viewModel.showSignUp.observe(this, Observer {
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        })
    }
}