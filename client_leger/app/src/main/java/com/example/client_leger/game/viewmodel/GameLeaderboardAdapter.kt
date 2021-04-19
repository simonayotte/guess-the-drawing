package com.example.client_leger.game.viewmodel

import android.graphics.Color
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.lifecycle.MutableLiveData
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import com.example.client_leger.game.model.PlayerInfo
import kotlinx.serialization.PrimitiveKind


class GameLeaderboardAdapter(var players: List<PlayerInfo>, var artistIdLiked: MutableLiveData<Int>, var artistIdDisliked: MutableLiveData<Int>) : RecyclerView.Adapter<GameLeaderboardAdapter.ViewHolder>() {

    inner class ViewHolder(listItemView: View) : RecyclerView.ViewHolder(listItemView) {
        val playerCard = itemView.findViewById<ConstraintLayout>(R.id.PlayerCard)
        val playerAvatar = itemView.findViewById<ImageView>(R.id.PlayerAvatar)
        val playerName = itemView.findViewById<TextView>(R.id.PlayerName)
        val playerRole = itemView.findViewById<TextView>(R.id.PlayerRole)
        val playerScore = itemView.findViewById<TextView>(R.id.PlayerScore)
        val thumbsUp = itemView.findViewById<ImageView>(R.id.thumbsUpPlayer)
        val thumbsDown = itemView.findViewById<ImageView>(R.id.thumbsDownPlayer)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val contactView = LayoutInflater.from(parent.context)
            .inflate(R.layout.game_leaderboard_list_item, parent, false)
        return ViewHolder(contactView)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {
        val playerItem: PlayerInfo = players[position]
        when (playerItem.avatar) {
            "1" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_1)
            "2" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_2)
            "3" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_3)
            "4" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_4)
            "5" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_5)
            "6" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_6)
            "7" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_7)
            "8" -> viewHolder.playerAvatar.setImageResource(R.drawable.icon_8)
            else -> {
                viewHolder.playerAvatar.setImageResource(R.drawable.icon_0)
            }
        }
        viewHolder.playerName.text = playerItem.name
        viewHolder.playerRole.text = playerItem.role.value
        viewHolder.playerScore.text = playerItem.score.toString()
        when (playerItem.team) {
            1 -> viewHolder.playerCard.setBackgroundColor(Color.rgb(186, 225, 255))
            2 -> viewHolder.playerCard.setBackgroundColor(Color.rgb(255,189,186))
            else -> {
                viewHolder.playerCard.setBackgroundColor(Color.WHITE)
            }
        }

        artistIdLiked.observeForever{it ->
            if (it == playerItem.id){
                viewHolder.thumbsUp.visibility = View.VISIBLE
            } else {
                viewHolder.thumbsUp.visibility = View.INVISIBLE
            }
        }
        artistIdDisliked.observeForever { it ->
            if (it == playerItem.id) {
                viewHolder.thumbsDown.visibility = View.VISIBLE
            } else {
                viewHolder.thumbsDown.visibility = View.INVISIBLE
            }
        }


    }

    override fun getItemCount() = players.size
}