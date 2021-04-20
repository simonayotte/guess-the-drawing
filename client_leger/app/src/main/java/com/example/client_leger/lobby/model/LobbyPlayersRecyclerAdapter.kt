package com.example.client_leger.lobby.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R

class LobbyPlayersRecyclerAdapter(var players: List<LobbyPlayer>) :
    RecyclerView.Adapter<LobbyPlayersRecyclerAdapter.LobbyPlayersViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LobbyPlayersViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(
            R.layout.lobby_players_list_item,
            parent, false)
        return LobbyPlayersViewHolder(itemView)
    }
    override fun onBindViewHolder(holder: LobbyPlayersViewHolder, position: Int) {
        val currentItem = players[position]
        val avatar: Int = when (currentItem.avatar) {
            "1" -> R.drawable.icon_1
            "2" -> R.drawable.icon_2
            "3" -> R.drawable.icon_3
            "4" -> R.drawable.icon_4
            "5" -> R.drawable.icon_5
            "6" -> R.drawable.icon_6
            "7" -> R.drawable.icon_7
            "8" -> R.drawable.icon_8
            "9" -> R.drawable.icon_9
            else -> {
                R.drawable.icon_0
            }
        }
        holder.playerAvatar.setImageResource(avatar)
        holder.playerName.text = currentItem.username
    }
    override fun getItemCount() = players.size

    class LobbyPlayersViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val playerAvatar: ImageView = itemView.findViewById(R.id.player_avatar)
        val playerName: TextView = itemView.findViewById(R.id.player_name)
    }
}
