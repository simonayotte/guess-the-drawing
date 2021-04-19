package com.example.client_leger.leaderboard.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.example.client_leger.R
import kotlin.collections.ArrayList
import kotlinx.android.synthetic.main.activity_lobby.*


class LeaderboardRecyclerAdapter(private val players: ArrayList<LeaderboardModel>) :
    RecyclerView.Adapter<LeaderboardRecyclerAdapter.LeaderboardViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LeaderboardViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.leaderboard_list_item,
            parent, false)
        return LeaderboardViewHolder(itemView)
    }
    override fun onBindViewHolder(holder: LeaderboardViewHolder, position: Int) {
        val currentItem = players[position]
        holder.playerName.text = currentItem.username
        holder.position.text = currentItem.position.toString()
        holder.victories.text = currentItem.victories.toString()
        holder.points.text = currentItem.totalPoints.toString()
        holder.classicVictories.text = currentItem.classicVictories.toString()
        holder.brVictories.text = currentItem.brVictories.toString()
        holder.bestScoreSprintSolo.text = currentItem.bestScoreSprintSolo.toString()
        holder.bestScoreCoop.text = currentItem.bestScoreCoop.toString()
        holder.playedGames.text = currentItem.gamesPlayed.toString()
        holder.likes.text = currentItem.likes.toString()
        holder.dislikes.text = currentItem.dislikes.toString()
        // TODO leaderboard
    }
    override fun getItemCount() = players.size

    class LeaderboardViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val playerName:TextView = itemView.findViewById(R.id.leaderboard_player_name)
        val position:TextView = itemView.findViewById(R.id.leaderboard_position)
        val victories:TextView = itemView.findViewById(R.id.leaderboard_victories)
        val points:TextView = itemView.findViewById(R.id.leaderboard_points)
        val classicVictories:TextView = itemView.findViewById(R.id.leaderboard_classic_victories)
        val brVictories:TextView = itemView.findViewById(R.id.leaderboard_br_victories)
        val bestScoreSprintSolo:TextView = itemView.findViewById(R.id.leaderboard_best_score_sprint_Solo)
        val bestScoreCoop:TextView = itemView.findViewById(R.id.leaderboard_best_score_coop)
        val playedGames:TextView = itemView.findViewById(R.id.leaderboard_played_games)
        val likes:TextView = itemView.findViewById(R.id.leaderboard_likes)
        val dislikes:TextView = itemView.findViewById(R.id.leaderboard_dislikes)
        // TODO leaderboard
    }
}
