package com.example.client_leger.lobby.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.example.client_leger.R
import kotlin.collections.ArrayList
import kotlinx.android.synthetic.main.activity_lobby.*


class LobbyRecyclerAdapter(private val lobbies: List<LobbyModel>) :
    RecyclerView.Adapter<LobbyRecyclerAdapter.LobbyViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LobbyViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.lobby_list_item,
            parent, false)
        return LobbyViewHolder(itemView)
    }
    override fun onBindViewHolder(holder: LobbyViewHolder, position: Int) {
        val currentItem = lobbies[position]
        holder.lobbyName.text = currentItem.lobbyName
        holder.playerNumber.text = currentItem.playerNumber
        holder.gamemode.text = currentItem.gameMode
    }
    override fun getItemCount() = lobbies.size

    class LobbyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val lobbyName:TextView = itemView.findViewById(R.id.lobby_name)
        val playerNumber:TextView = itemView.findViewById(R.id.player_number)
        val gamemode:TextView = itemView.findViewById(R.id.gamemode)
    }
}
