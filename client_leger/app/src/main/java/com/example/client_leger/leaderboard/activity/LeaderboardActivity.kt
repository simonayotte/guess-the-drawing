package com.example.client_leger.leaderboard.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.databinding.ActivityLeaderboardBinding
import com.example.client_leger.leaderboard.model.LeaderboardModel
import com.example.client_leger.leaderboard.model.LeaderboardRecyclerAdapter
import com.example.client_leger.leaderboard.viewModel.LeaderboardViewModel
import com.example.client_leger.lobby.activity.LobbyActivity
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.activity_leaderboard.*

@AndroidEntryPoint
class LeaderboardActivity : AppCompatActivity() {
    lateinit var leaderboardList: ArrayList<LeaderboardModel>;
    lateinit var leaderboardAdapter: LeaderboardRecyclerAdapter;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        leaderboardList = getLeaderboard()
        leaderboardAdapter = LeaderboardRecyclerAdapter(leaderboardList)
        val binding: ActivityLeaderboardBinding = DataBindingUtil.setContentView(this, R.layout.activity_leaderboard)
        val viewModel = ViewModelProvider(this).get(LeaderboardViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this

        initLeaderboardRecyclerView()

        viewModel.goBack.observe(this, Observer {
            if(it) {
                finish()
            }
        })
    }

    private fun initLeaderboardRecyclerView() {
        leaderboard_recycler_view.adapter = leaderboardAdapter
        leaderboard_recycler_view.addItemDecoration(DividerItemDecoration(this, DividerItemDecoration.VERTICAL))
        leaderboard_recycler_view.layoutManager = LinearLayoutManager(this)
        leaderboard_recycler_view.setHasFixedSize(false)
    }

    private fun getLeaderboard(): ArrayList<LeaderboardModel> {
        val stats: ArrayList<LeaderboardModel> = intent.getParcelableArrayListExtra<LeaderboardModel>("Stats") as ArrayList<LeaderboardModel>
        return stats
    }
}