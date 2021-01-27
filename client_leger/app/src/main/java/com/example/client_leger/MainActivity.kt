package com.example.client_leger

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
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