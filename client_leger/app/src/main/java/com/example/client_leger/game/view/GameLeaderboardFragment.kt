package com.example.client_leger.game.view

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import com.example.client_leger.databinding.FragmentGameLeaderboardBinding
import com.example.client_leger.game.viewmodel.GameLeaderboardAdapter
import com.example.client_leger.game.viewmodel.GameLeaderboardViewModel
import com.example.client_leger.lobby.viewModel.LobbyViewModel
import com.example.client_leger.signup.activity.SignUpActivity
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.fragment_game_leaderboard.view.*

@AndroidEntryPoint
class GameLeaderboardFragment : Fragment(R.layout.fragment_game_leaderboard) {

    private lateinit var viewModel: GameLeaderboardViewModel


    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        viewModel = ViewModelProvider(this).get(GameLeaderboardViewModel::class.java)
        val binding = FragmentGameLeaderboardBinding.inflate(inflater, container, false)
        binding.lifecycleOwner = this

        binding.viewmodel = viewModel

        val recyclerView: RecyclerView = binding.GameLeaderboardFrame.LeaderboardLayout.LeaderboardView
        recyclerView.adapter = viewModel.adapter
        val layoutManager = LinearLayoutManager(activity)
        layoutManager.orientation = LinearLayoutManager.VERTICAL
        recyclerView.layoutManager = layoutManager

        viewModel.thumbsDisableOverlay.observe(viewLifecycleOwner, Observer {
            if (it){
                binding.thumbsDisableOverlay.visibility = View.VISIBLE
                binding.thumbsDownButton.isClickable = false;
                binding.thumbsUpButton.isClickable = false;
            } else {
                binding.thumbsDisableOverlay.visibility = View.INVISIBLE
                binding.thumbsDownButton.isClickable = true;
                binding.thumbsUpButton.isClickable = true;
            }
        })

        return binding.root
    }
}