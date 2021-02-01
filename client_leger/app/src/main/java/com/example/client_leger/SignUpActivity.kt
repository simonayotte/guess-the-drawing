package com.example.client_leger

import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.client_leger.databinding.ActivitySignUpBinding

class SignUpActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)
        val binding: ActivitySignUpBinding = DataBindingUtil.setContentView(this, R.layout.activity_sign_up)
        val viewModel = ViewModelProvider(this).get(SignUpViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this

        val background = findViewById<ConstraintLayout>(R.id.signupColorChange)
        val frameAnimation = background.background as AnimationDrawable
        frameAnimation.setEnterFadeDuration(2000)
        frameAnimation.setExitFadeDuration(4000)
        frameAnimation.start()
        viewModel.successfulSignUp.observe(this, Observer {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        })
        viewModel.showSignIn.observe(this, Observer {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        })
    }
}