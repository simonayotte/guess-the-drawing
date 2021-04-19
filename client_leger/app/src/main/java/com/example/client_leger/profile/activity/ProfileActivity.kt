package com.example.client_leger.profile.activity

import android.os.Bundle
import android.view.animation.AccelerateInterpolator
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.databinding.ActivityProfileBinding
import com.example.client_leger.profile.model.*
import com.example.client_leger.profile.viewModel.ProfileViewModel
import com.example.client_leger.utils.UserInfos
import com.plattysoft.leonids.ParticleSystem
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.activity_leaderboard.*
import kotlinx.android.synthetic.main.activity_profile.*
import android.view.View
import javax.inject.Inject


@AndroidEntryPoint
class ProfileActivity : AppCompatActivity() {
    @Inject lateinit var userInfos: UserInfos
    lateinit var loginHistoryList : ArrayList<LoginHistoryModel>
    lateinit var loginHistoryAdapter: LoginHistoryRecyclerAdapter
    lateinit var gameHistoryList : ArrayList<GameHistoryModel>
    lateinit var gameHistoryAdapter: GameHistoryRecyclerAdapter
    lateinit var identity: UserIdentityModel
    lateinit var statistics: StatisticsModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get data
        loginHistoryList = getLoginHistory()
        gameHistoryList = getGameHistory()
        identity = getUserIdentity()
        statistics = getUserStatistics()


        // Adapters
        loginHistoryAdapter = LoginHistoryRecyclerAdapter(loginHistoryList)
        gameHistoryAdapter = GameHistoryRecyclerAdapter(gameHistoryList)

        // Binding
        val binding: ActivityProfileBinding = DataBindingUtil.setContentView(
            this,
            R.layout.activity_profile
        )
        val viewModel = ViewModelProvider(this).get(ProfileViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this

        val avatar: Int = when (userInfos.avatar.value) {
            "1" -> R.drawable.icon_1
            "2" -> R.drawable.icon_2
            "3" -> R.drawable.icon_3
            "4" -> R.drawable.icon_4
            "5" -> R.drawable.icon_5
            "6" -> R.drawable.icon_6
            "7" -> R.drawable.icon_7
            "8" -> R.drawable.icon_8
            else -> {
                R.drawable.icon_0
            }
        }
        binding.playerAvatar.setImageResource(avatar)
        binding.username.text = userInfos.username.value
        binding.firstLastName.text = identity.firstName + " " + identity.lastName
        binding.email.text = identity.email

        binding.gameNumbers.text = statistics.gamePlayed.toString()
        binding.winrate.text = (statistics.winRate * 100).toString() + "%"
        binding.averageGameTime.text = statistics.averageTimePerGame
        binding.totalTimePlayed.text = statistics.totalTimePlayed
        binding.bestScoreSprint.text = statistics.bestScoreSprintSolo.toString()
        binding.thumbsUp.text = statistics.likes.toString()
        binding.thumbsDown.text = statistics.dislikes.toString()


        // Init recycler views
        initLoginHistoryRecyclerView()
        initGameHistoryRecyclerView()

        viewModel.goBack.observe(this, Observer {
            if (it) {
                finish()
            }
        })
    }

    private fun initLoginHistoryRecyclerView() {
        connection_history_recycler_view.adapter = loginHistoryAdapter
        connection_history_recycler_view.addItemDecoration(
            DividerItemDecoration(
                this,
                DividerItemDecoration.VERTICAL
            )
        )
        connection_history_recycler_view.layoutManager = LinearLayoutManager(this)
        connection_history_recycler_view.setHasFixedSize(false)
    }

    private fun getLoginHistory(): ArrayList<LoginHistoryModel> {
        val logins: ArrayList<LoginHistoryModel> = intent.getParcelableArrayListExtra<LoginHistoryModel>(
            "logins"
        ) as ArrayList<LoginHistoryModel>
        return logins
    }

    private fun initGameHistoryRecyclerView() {
        game_history_recycler_view.adapter = gameHistoryAdapter
        game_history_recycler_view.addItemDecoration(
            DividerItemDecoration(
                this,
                DividerItemDecoration.VERTICAL
            )
        )
        game_history_recycler_view.layoutManager = LinearLayoutManager(this)
        game_history_recycler_view.setHasFixedSize(false)
    }

    private fun getGameHistory(): ArrayList<GameHistoryModel> {
        val games: ArrayList<GameHistoryModel> = intent.getParcelableArrayListExtra<GameHistoryModel>(
            "games"
        ) as ArrayList<GameHistoryModel>
        return games
    }

    private fun getUserIdentity() : UserIdentityModel {
        val userIdentity: UserIdentityModel = intent.getParcelableExtra<UserIdentityModel>("userIdentity") as UserIdentityModel
        return userIdentity
    }

    private fun getUserStatistics() : StatisticsModel {
        val statistics: StatisticsModel = intent.getParcelableExtra<StatisticsModel>("statistics") as StatisticsModel
        return statistics
    }
}