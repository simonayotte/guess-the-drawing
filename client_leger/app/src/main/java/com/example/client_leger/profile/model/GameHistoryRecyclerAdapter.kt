package com.example.client_leger.profile.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import kotlin.collections.ArrayList

class GameHistoryRecyclerAdapter(private val games : ArrayList<GameHistoryModel>) :
    RecyclerView.Adapter<GameHistoryRecyclerAdapter.GameHistoryViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): GameHistoryViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.game_history_item,
                parent, false)
        return GameHistoryViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: GameHistoryRecyclerAdapter.GameHistoryViewHolder, position: Int) {
        val currentItem = games[position]
        holder.gameModeId.text = getGameMode(currentItem.gameModeId)
        holder.gameDate.text = formatDateString(currentItem.gameDate)
        holder.iswinner.text = getGameVictoryStatus(currentItem.iswinner)
        holder.gameResult.text = formatGameResult(currentItem.gameResult)

        val playersSize = currentItem.players.size

        if(playersSize >= 1)
            holder.player1.text = currentItem.players[0]
        if(playersSize >= 2)
            holder.player2.text = currentItem.players[1]
        if(playersSize >= 3)
            holder.player3.text = currentItem.players[2]
        if(playersSize >= 4)
            holder.player4.text = currentItem.players[3]
    }

    override fun getItemCount() = games.size

    class GameHistoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val gameModeId: TextView = itemView.findViewById(R.id.gamemode)
        val gameDate: TextView = itemView.findViewById(R.id.game_date)
        val iswinner: TextView = itemView.findViewById(R.id.is_winner)
        val gameResult: TextView = itemView.findViewById(R.id.game_result)

        val player1: TextView = itemView.findViewById(R.id.player1)
        val player2: TextView = itemView.findViewById(R.id.player2)
        val player3: TextView = itemView.findViewById(R.id.player3)
        val player4: TextView = itemView.findViewById(R.id.player4)
    }

    fun getGameMode(gamemodeid : Int) : String {
        if(gamemodeid == 0)
            return "Sprint Solo"
        else if (gamemodeid == 1)
            return "Sprint Co-Op"
        else if (gamemodeid == 2)
            return "Classique"
        return "Battle Royale"
    }

    fun getGameVictoryStatus(status : Boolean) : String {
        if (status)
            return "Victoire"
        else
            return "Défaite"
    }

    fun formatDateString(dateString : String) : String {
        var string = dateString.replace('Z', ' ')
        string = string.replace('T', ' ')
        string = string.substring(0, dateString.length - 5)
        return string
    }

    fun formatGameResult(result : Int) : String {
        return "$result points"
    }

}