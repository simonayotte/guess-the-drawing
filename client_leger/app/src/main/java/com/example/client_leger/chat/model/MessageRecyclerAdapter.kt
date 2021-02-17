package com.example.client_leger.chat.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.example.client_leger.R
import com.example.client_leger.lobby.model.LobbyModel
import kotlin.collections.ArrayList

class MessageRecyclerAdapter(private val messages: List<MessageModel>) :
    RecyclerView.Adapter<MessageRecyclerAdapter.ChatViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        var itemView = LayoutInflater.from(parent.context).inflate(R.layout.their_message,
            parent, false)
        val textView: TextView = itemView.findViewById(R.id.name) as TextView
        if (textView.text != "Weber") {
            return ChatViewHolder(itemView)
        } else {
            itemView = LayoutInflater.from(parent.context).inflate(
                R.layout.my_message,
                parent, false
            )
            return ChatViewHolder(itemView)
        }
    }
    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val currentItem = messages[position]
        holder.messageWriter.text = currentItem.messageWriter
        holder.messageTime.text = currentItem.messageTime
        holder.messageContent.text = currentItem.messageContent
    }
    override fun getItemCount() = messages.size

    class ChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val messageWriter:TextView = itemView.findViewById(R.id.name)
//        val writerIcon:TextView = itemView.findViewById(R.id.their_avatar)
        val messageTime:TextView = itemView.findViewById(R.id.time)
        val messageContent:TextView = itemView.findViewById(R.id.message_content)
    }
}
