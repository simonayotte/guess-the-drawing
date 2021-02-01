package com.example.client_leger

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : AppCompatActivity() {
    // field injection
    @Inject
    lateinit var someClass: SomeClass

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        println(someClass.printSomething())
        val disconnectButton = findViewById<Button>(R.id.mainDisconnectButton)
        disconnectButton.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            // start your next activity
            startActivity(intent)
        }
    }
}

class SomeClass
@Inject
//constructor injection
constructor(private val anotherClass: AnotherClass){
    fun printSomething(): String {
        return anotherClass.printSomethingElse()
    }
}

class AnotherClass
@Inject
constructor(){
    fun printSomethingElse(): String {
        return "Yo it's printing something else !!"
    }
}