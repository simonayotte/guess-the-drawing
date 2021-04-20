package com.example.client_leger.lobby.activity

import android.app.AlertDialog
import android.content.Intent
import android.graphics.drawable.AnimationDrawable
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.client_leger.R
import com.example.client_leger.chat.model.ChatData
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.chat.model.MessageRecyclerAdapter
import com.example.client_leger.databinding.ActivityLobbyBinding
import com.example.client_leger.game.view.GameActivity
import com.example.client_leger.leaderboard.activity.LeaderboardActivity
import com.example.client_leger.leaderboard.model.LeaderboardModel
import com.example.client_leger.lobby.model.*
import com.example.client_leger.lobby.viewModel.LobbyViewModel
import com.example.client_leger.profile.activity.ProfileActivity
import com.example.client_leger.profile.model.GameHistoryModel
import com.example.client_leger.profile.model.StatisticsModel
import com.example.client_leger.profile.model.LoginHistoryModel
import com.example.client_leger.profile.model.UserIdentityModel
import com.example.client_leger.utils.Result
import com.example.client_leger.tutorial.activity.TutorialActivity
import com.example.client_leger.utils.UserInfos
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.android.synthetic.main.activity_lobby.*
import kotlinx.android.synthetic.main.dialog_create_lobby.view.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import java.lang.reflect.Type
import javax.inject.Inject
import kotlinx.serialization.*


@AndroidEntryPoint
class LobbyActivity : AppCompatActivity() {
    @Inject lateinit var userInfos: UserInfos
    @Inject lateinit var leaderboardRepository: LeaderboardRepository
    @Inject lateinit var loginHistoryRepository: LoginHistoryRepository
    @Inject lateinit var gameHistoryRepository: GameHistoryRepository
    @Inject lateinit var lobbyRepository: LobbyRepository
    @Inject lateinit var userIdentityRepository: UserIdentityRepository
    @Inject lateinit var statisticsRepository: StatisticsRepository

    private lateinit var viewModel: LobbyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val binding: ActivityLobbyBinding = DataBindingUtil.setContentView(
                this,
                R.layout.activity_lobby
        )
        viewModel = ViewModelProvider(this).get(LobbyViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this
        val background = findViewById<ConstraintLayout>(R.id.lobbyContainer)
        val frameAnimation = background.background as AnimationDrawable
        frameAnimation.setEnterFadeDuration(2000)
        frameAnimation.setExitFadeDuration(4000)
        frameAnimation.start()

        lobby_recycler_view.adapter = viewModel.lobbyAdapter
        lobby_recycler_view.layoutManager = LinearLayoutManager(this)
        lobby_recycler_view.setHasFixedSize(false)
        lobby_players.adapter = viewModel.lobbyPlayersAdapter
        lobby_players.layoutManager = LinearLayoutManager(this)

        viewModel.goToGame.observe(this, {
            if (it) {
                val intent = Intent(this, GameActivity::class.java)
                startActivity(intent)
                viewModel.goToGame.value = false
            }
        })

        viewModel.goToAddLobby.observe(this, { initCreateLobbyDialog() })

        viewModel.successfulSignOut.observe(this, Observer {
            if (it) {
                finish()
            }
        })
        viewModel.goToLeaderboard.observe(this, Observer {
            if (it) {
                val intent = Intent(this, LeaderboardActivity::class.java)
                var stats = ArrayList<LeaderboardModel>()
                viewModel.viewModelScope.launch {
                    when (val response = leaderboardRepository.makeGetStatsRequest()) {
                        is Result.Success<LeaderboardStatsResponse> -> {
                            var i = 0;
                            for (stat in response.data.stats) {

                                var leaderboardElement: LeaderboardModel = LeaderboardModel(
                                        stat.username,
                                        ++i,
                                        stat.victories.toInt(),
                                        stat.totalpoints.toInt(),
                                        stat.classicvictories.toInt(),
                                        stat.brvictories.toInt(),
                                        stat.bestscoresprintsolo.toInt(),
                                        stat.bestscorecoop.toInt(),
                                        stat.gamesplayed.toInt(),
                                        stat.likes.toInt(),
                                        stat.dislikes.toInt(),
                                )
                                stats.add(leaderboardElement);
                            }
                            intent.putExtra("Stats", stats)
                            startActivity(intent)
                        }
                        else -> {
                            Log.d("getStatsLeaderboard", "bad")
                        }
                    }
                }

            }
        })
        viewModel.goToProfile.observe(this, Observer {
            if (it) {
                val intent = Intent(this, ProfileActivity::class.java)
                var logins = ArrayList<LoginHistoryModel>()
                var games = ArrayList<GameHistoryModel>()
                viewModel.viewModelScope.launch {
                    when (val response = loginHistoryRepository.makeGetLoginHistoryRequest(userInfos.idplayer.value!!)) {
                        is Result.Success<ArrayList<LoginHistoryModel>> -> {
                            for (login in  response.data) {
                                var loginElement: LoginHistoryModel = LoginHistoryModel(
                                        login.isLogin,
                                        login.loginDate
                                )
                                logins.add(loginElement)
                            }
                            intent.putExtra("logins", logins)
                        }
                        else -> {
                            Log.d("getLoginHistory", "failure")
                        }
                    }
                    when (val game_history_response = gameHistoryRepository.makeGetGameHistoryRequest(userInfos.idplayer.value!!)) {
                        is Result.Success<ArrayList<GameHistoryModel>> -> {
                            for (game in game_history_response.data) {
                                var gameElement: GameHistoryModel = GameHistoryModel(
                                        game.gameModeId,
                                        game.gameDate,
                                        game.gameResult,
                                        game.players,
                                        game.iswinner
                                )
                                games.add(gameElement)
                            }
                            intent.putExtra("games", games)
                        }
                        else -> {
                            Log.d("getGameHistory", "failure")
                        }
                    }
                    when (val user_identity_response = userIdentityRepository.makeGetLoginHistoryRequest(userInfos.idplayer.value!!)) {
                        is Result.Success<UserIdentityModel> -> {
                            intent.putExtra("userIdentity", user_identity_response.data)
                        }
                        else -> {
                            Log.d("getUserIdentity", "failure")
                        }
                    }
                    when (val statistics_response = statisticsRepository.makeGetStatisticsRequest(userInfos.idplayer.value!!)) {
                        is Result.Success<StatisticsModel> -> {
                            intent.putExtra("statistics", statistics_response.data)
                        }
                        else -> {
                            Log.d("getStatistics", "failure")
                        }
                    }
                    startActivity(intent)
                }
            }
        })
        viewModel.showTutorial.observe(this, Observer {
            if (it) {
                val intent = Intent(this, TutorialActivity::class.java)
                startActivity(intent)
            }
        })

        viewModel.lobbyShown.observe(this, {
            when (it?.gameMode) {
                LobbyModel.GameMode.CLASSIC -> binding.lobbyModeImage.setImageResource(R.drawable.ic_star_solid)
                LobbyModel.GameMode.SPRINT_SOLO -> binding.lobbyModeImage.setImageResource(R.drawable.ic_running_solid)
                LobbyModel.GameMode.SPRINT_COOP -> binding.lobbyModeImage.setImageResource(R.drawable.ic_running_solid)
                LobbyModel.GameMode.BATTLE_ROYAL -> binding.lobbyModeImage.setImageResource(R.drawable.ic_crown_solid)
            }
        })
        viewModel.updateLobbies()

    }

//    private fun showGallery() {
//        Chat fragment = new Chat()
//        getSupportFragmentManager().beginTransaction()
//                .replace(R.id.fragment_container, fragment)
//                .commit();
//    }

    override fun onDestroy() {
        if(isFinishing) { //when the user decided to exit
            GlobalScope.launch(Dispatchers.IO) {
                lobbyRepository.logOut()
            }
        }
        super.onDestroy()
    }

    private fun initCreateLobbyDialog() {
        val dialogBuilder: AlertDialog.Builder = AlertDialog.Builder(this)
        val dialogView: View = layoutInflater.inflate(R.layout.dialog_create_lobby, null)
        dialogBuilder.setView(dialogView)
        val dialog: AlertDialog = dialogBuilder.create()
        dialogView.confirmButton.setOnClickListener {
            val lobbyMode: LobbyModel.GameMode? = when {
                dialogView.sprintSoloButton.isChecked -> LobbyModel.GameMode.SPRINT_SOLO
                dialogView.sprintCoopButton.isChecked -> LobbyModel.GameMode.SPRINT_COOP
                dialogView.classicButton.isChecked -> LobbyModel.GameMode.CLASSIC
                dialogView.battleRoyaleButton.isChecked -> LobbyModel.GameMode.BATTLE_ROYAL
                else -> null
            }
            val lobbyDifficulty: LobbyModel.Difficulty? = when {
                dialogView.easyButton.isChecked -> LobbyModel.Difficulty.EASY
                dialogView.mediumButton.isChecked -> LobbyModel.Difficulty.MEDIUM
                dialogView.hardButton.isChecked -> LobbyModel.Difficulty.HARD
                else -> null
            }
            if(lobbyMode != null && lobbyDifficulty != null){
                viewModel.createLobby(lobbyMode, lobbyDifficulty)
                dialog.dismiss()
            }
        }
        dialogView.cancelButton.setOnClickListener { dialog.cancel() }
        dialogView.modeRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            dialogView.confirmButton.isEnabled = checkedId != -1
                    && dialogView.difficultyRadioGroup.checkedRadioButtonId != -1
        }
        dialogView.difficultyRadioGroup.setOnCheckedChangeListener { _, checkedId ->
            dialogView.confirmButton.isEnabled = checkedId != -1
                    && dialogView.modeRadioGroup.checkedRadioButtonId != -1
        }
        dialogBuilder.setOnDismissListener {
            viewModel.goToAddLobby.value = false
        }
        dialog.show()
    }

}

