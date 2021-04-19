package com.example.client_leger.lobby.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.lifecycle.LiveData
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R

class LobbyRecyclerAdapter(var lobbies: List<LobbyModel>, private val currentLobbyId: LiveData<Int?>, private val changeLobby: (id: Int?) -> Unit) :
    RecyclerView.Adapter<LobbyRecyclerAdapter.LobbyViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LobbyViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.lobby_list_item,
            parent, false)
        return LobbyViewHolder(itemView)
    }
    override fun onBindViewHolder(holder: LobbyViewHolder, position: Int) {
        val currentItem = lobbies[position]
        holder.lobbyName.text = holder.itemView.context.getString(R.string.LobbyName, currentItem.id)
        holder.playerNumber.text = holder.itemView.context.getString(R.string.NumberOfPlayers, currentItem.players.size, currentItem.maxPlayers)
        holder.gameMode.text = currentItem.gameMode.value
        holder.difficulty.text = currentItem.difficulty.value
        holder.joinButton.setOnClickListener { changeLobby(currentItem.id) }
        holder.leaveButton.setOnClickListener { changeLobby(null) }
        holder.joinButton.isEnabled = currentItem.players.size < currentItem.maxPlayers
        currentLobbyId.observeForever {
            if(it == currentItem.id) {
                holder.joinButton.visibility = View.GONE
                holder.leaveButton.visibility = View.VISIBLE
            } else {
                holder.joinButton.visibility = View.VISIBLE
                holder.leaveButton.visibility = View.GONE
            }
        }
    }
    override fun getItemCount() = lobbies.size

    class LobbyViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val lobbyName:TextView = itemView.findViewById(R.id.lobby_name)
        val playerNumber:TextView = itemView.findViewById(R.id.player_number)
        val gameMode:TextView = itemView.findViewById(R.id.gamemode)
        val difficulty:TextView = itemView.findViewById(R.id.difficulty)
        val joinButton:Button = itemView.findViewById(R.id.lobby_join_button)
        val leaveButton:Button = itemView.findViewById(R.id.lobby_leave_button)
    }
}
