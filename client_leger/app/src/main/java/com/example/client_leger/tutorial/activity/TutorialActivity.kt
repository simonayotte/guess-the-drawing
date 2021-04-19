package com.example.client_leger.tutorial.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageView
import androidx.databinding.BindingAdapter
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.databinding.ActivityLobbyBinding
import com.example.client_leger.databinding.ActivityTutorialBinding
import com.example.client_leger.lobby.activity.LobbyActivity
import com.example.client_leger.lobby.model.LobbyRecyclerAdapter
import com.example.client_leger.lobby.model.TopSpacingItemDecoration
import com.example.client_leger.lobby.viewModel.LobbyViewModel
import com.example.client_leger.signin.activity.SiginInActivity
import com.example.client_leger.tutorial.model.TutorialRecyclerAdapter
import com.example.client_leger.tutorial.viewModel.TutorialViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.activity_lobby.*
import kotlinx.android.synthetic.main.activity_tutorial.*

@AndroidEntryPoint
class TutorialActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityTutorialBinding = DataBindingUtil.setContentView(
                this,
                R.layout.activity_tutorial
        )
        val viewModel = ViewModelProvider(this).get(TutorialViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this

        val tutorialAdapter = TutorialRecyclerAdapter(viewModel.getSections(), viewModel)
        tutorial_recycler_view.adapter = tutorialAdapter
        val topSpacingDecorator = TopSpacingItemDecoration(10)
        tutorial_recycler_view.addItemDecoration(topSpacingDecorator)
        tutorial_recycler_view.layoutManager = LinearLayoutManager(this)
        tutorial_recycler_view.setHasFixedSize(false)

        viewModel.imageRessource.observe(this, Observer {
            binding.tutorialImage.setImageResource(it)
        })

        viewModel.goToLobby.observe(this, Observer {
            if (it) {
                finish()
            }
        })
    }
}