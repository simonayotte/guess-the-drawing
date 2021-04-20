package com.example.client_leger.game.view

import android.app.AlertDialog
import android.content.DialogInterface
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.view.animation.AccelerateInterpolator
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.client_leger.MediaPlayerService
import com.example.client_leger.R
import com.example.client_leger.databinding.ActivityGameBinding
import com.example.client_leger.drawing.view.DrawingView
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.game.model.PlayerInfo
import com.example.client_leger.game.viewmodel.GameViewModel
import com.example.client_leger.lobby.model.LobbyRepository
import com.example.client_leger.utils.UserInfos
import com.plattysoft.leonids.ParticleSystem
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject


@AndroidEntryPoint
class GameActivity : AppCompatActivity() {

    lateinit var viewModel: GameViewModel
    @Inject lateinit var mediaPlayerService: MediaPlayerService
    @Inject lateinit var lobbyRepository: LobbyRepository
    @Inject lateinit var gameRepository: GameRepository
    @Inject lateinit var userInfos: UserInfos

    var openedDialog: AlertDialog? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding: ActivityGameBinding = DataBindingUtil.setContentView<ActivityGameBinding>(this, R.layout.activity_game)
        viewModel = ViewModelProvider(this).get(GameViewModel::class.java)
        binding.viewmodel = viewModel
        binding.lifecycleOwner = this


        val drawingView: DrawingView = supportFragmentManager.findFragmentById(R.id.drawing_fragment) as DrawingView
        viewModel.currentRound.observe(this, {
            if (it != null) {
                if (it.rightOfReply) {
                    showRightOfReplyDialog(it.currentRole == PlayerInfo.RoleType.GUESSING)
                } else { // new artist
                    val isArtist = it.currentRole == PlayerInfo.RoleType.DRAWING
                    drawingView.isEnabled.value = isArtist
                    drawingView.reset()
                    if (isArtist) showArtistWordDialog(it.word)
                }
            }
        })
        viewModel.endGameMessage.observe(this, {
            if (!it.isNullOrEmpty()) {
                showEndGameDialog(it)
            }
        })
        mediaPlayerService.createGoodGuessSound(this);
        mediaPlayerService.createBadGuessSound(this);
    }

    override fun onStart() {
        super.onStart()
        viewModel.clientIsReady()
    }

    private fun showRightOfReplyDialog(canReply: Boolean) {
        val message = if(canReply) "L'adversaire a échoué! Vous avez un droit de réplique."
        else "Vous avez atteint le nombre d'essais / le temps limite! Droit de réplique à l'autre équipe."
        createBasicAlertDialog(message)

        Handler(Looper.getMainLooper()).postDelayed({
            openedDialog?.let {
                openedDialog = null
                it.dismiss()
            }
        }, 5000)
    }

    private fun showArtistWordDialog(word: String) {
        createBasicAlertDialog("Vous êtes l'artiste, voici votre mot : $word") {
            viewModel.artistIsReady()
        }
    }

    public fun showEndGameDialog(message: String) {
        val isWinner = isWinner()
        if (isWinner)
            showFireworks()
        val title = if (isWinner) "Victoire !" else "Défaite !"
        createBasicAlertDialog(message, title, "Retourner au salon") {
            lobbyRepository.activeLobbyId.value = null
            finish() //go back to previous activity (lobbies)
        }
    }

    private fun createBasicAlertDialog(message: String, title: String = "", neutralButton: String = "Fermer", dismissListener: DialogInterface.OnDismissListener? = null) {
        val dialogBuilder: AlertDialog.Builder = AlertDialog.Builder(this)
        if(!title.isNullOrEmpty()) {
            dialogBuilder.setTitle(title)
        }
        dialogBuilder.setMessage(message)
        dialogBuilder.setNeutralButton(neutralButton) { dialog: DialogInterface, _: Int ->
            dialog.dismiss()
        }
        if(dismissListener != null) {
            dialogBuilder.setOnDismissListener(dismissListener)
        }
        openedDialog?.let {
            openedDialog = null
            it.dismiss()
        }
        openedDialog = dialogBuilder.show()
    }

    public fun showFireworks() {

        ParticleSystem(this, 80, R.drawable.confeti3, 10000)
                .setSpeedModuleAndAngleRange(0f, 0.3f, 180, 180)
                .setRotationSpeed(144f)
                .setAcceleration(0.00005f, 90)
                .emit(findViewById<View>(R.id.emiter_top_right), 8)

        ParticleSystem(this, 80, R.drawable.confeti2, 10000)
                .setSpeedModuleAndAngleRange(0f, 0.3f, 0, 0)
                .setRotationSpeed(144f)
                .setAcceleration(0.00005f, 90)
                .emit(findViewById<View>(R.id.emitter_top_left), 8)

    }

    private fun isWinner() : Boolean {
        val id = userInfos.idplayer.value
        val players = gameRepository.players.value
        if (id !== null) {
            var maxScore = 0
            if (players !== null) {
                for (player in players) {
                    if (player.score > maxScore)
                        maxScore = player.score
                }
                for (player in players) {
                    if (player.id == id)
                        return maxScore == player.score
                }
            }
            return false
        }
        return false
    }
    override fun onBackPressed() {
    }
}