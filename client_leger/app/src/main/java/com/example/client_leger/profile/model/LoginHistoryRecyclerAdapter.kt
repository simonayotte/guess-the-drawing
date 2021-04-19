package com.example.client_leger.profile.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import kotlin.collections.ArrayList

class LoginHistoryRecyclerAdapter(private val logins: ArrayList<LoginHistoryModel>) :
    RecyclerView.Adapter<LoginHistoryRecyclerAdapter.LoginHistoryViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LoginHistoryViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.connection_history_list_item,
                parent, false)
        return LoginHistoryViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: LoginHistoryRecyclerAdapter.LoginHistoryViewHolder, position: Int) {
        val currentItem = logins[position]
        holder.isLogin.text = getConnectionStatus(currentItem.isLogin)
        holder.loginDate.text = formatDateString(currentItem.loginDate)
    }

    override fun getItemCount() = logins.size

    class LoginHistoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val isLogin: TextView = itemView.findViewById(R.id.connection_status)
        val loginDate: TextView = itemView.findViewById(R.id.connection_date)
    }

    fun getConnectionStatus(status : Boolean) : String {
        if (status)
            return "Connexion"
        else
            return "Déconnexion"
    }

    fun formatDateString(dateString : String) : String {
        var string = dateString.replace('Z', ' ')
        string = string.replace('T', ' ')
        string = string.substring(0, dateString.length - 5)
        return string
    }
}