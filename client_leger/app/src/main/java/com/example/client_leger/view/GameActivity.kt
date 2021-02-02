package com.example.client_leger.view

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.client_leger.R
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class GameActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_game)
    }
}