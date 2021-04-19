package com.example.client_leger.signup.activity

import android.app.AlertDialog
import android.content.DialogInterface
import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.client_leger.MainActivity
import com.example.client_leger.R
import com.example.client_leger.databinding.ActivitySignUpBinding
import com.example.client_leger.lobby.activity.LobbyActivity
import com.example.client_leger.signin.activity.SiginInActivity
import com.example.client_leger.signup.viewModel.SignUpViewModel
import com.example.client_leger.tutorial.activity.TutorialActivity
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
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
            val firstIntent = Intent(this, LobbyActivity::class.java)
            startActivity(firstIntent)
            val intent = Intent(this, TutorialActivity::class.java)
            startActivity(intent)
        })
        viewModel.showSignIn.observe(this, Observer {
            finish()
        })

        viewModel.errorMessage.observe(this, {
            if(it != null) {
                val dialogBuilder: AlertDialog.Builder = AlertDialog.Builder(this)
                dialogBuilder.setMessage(if(it.isEmpty()) "Une erreur est survenue!" else it)
                dialogBuilder.setNeutralButton("Fermer") { dialog: DialogInterface, _: Int ->
                    dialog.dismiss()
                    viewModel.errorMessage.value = null
                }
                dialogBuilder.show()
            }
        })
    }
}