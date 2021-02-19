package com.example.client_leger.chat.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.example.client_leger.R
import com.example.client_leger.lobby.model.LobbyModel
import kotlin.collections.ArrayList

class MessageRecyclerAdapter(private val messages: List<MessageModel>, private val username: String) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {
    companion object {
        const val MY_MESSAGE_VIEW = 1
        const val THEIR_MESSAGE_VIEW = 2
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        if (viewType == MY_MESSAGE_VIEW) {
            var itemView = LayoutInflater.from(parent.context).inflate(R.layout.my_message,
                    parent, false)
            return MyChatViewHolder(itemView)
        }
        else {
            var itemView = LayoutInflater.from(parent.context).inflate(R.layout.their_message,
                    parent, false)
            return TheirChatViewHolder(itemView)
        }

    }
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val currentItem = messages[position]
        if (currentItem.messageWriter == username) {
            (holder as MyChatViewHolder).messageTime.text = currentItem.messageTime
            holder.messageContent.text = currentItem.messageContent
        }
        else {
            (holder as TheirChatViewHolder).messageTime.text = currentItem.messageTime
            holder.messageContent.text = currentItem.messageContent
            holder.messageWriter.text = currentItem.messageWriter
            when (currentItem.writerIcon) {
                "1" -> holder.writerIcon.setImageResource(R.drawable.icon_1)
                "2" -> holder.writerIcon.setImageResource(R.drawable.icon_2)
                "3" -> holder.writerIcon.setImageResource(R.drawable.icon_3)
                "4" -> holder.writerIcon.setImageResource(R.drawable.icon_4)
                "5" -> holder.writerIcon.setImageResource(R.drawable.icon_5)
                "6" -> holder.writerIcon.setImageResource(R.drawable.icon_6)
                "7" -> holder.writerIcon.setImageResource(R.drawable.icon_7)
                "8" -> holder.writerIcon.setImageResource(R.drawable.icon_8)
                else -> {
                    holder.writerIcon.setImageResource(R.drawable.icon_0)
                }
            }

        }


    }
    override fun getItemCount() = messages.size

    override fun getItemViewType(position: Int): Int {
        if (messages[position].messageWriter == username) {
            return MY_MESSAGE_VIEW
        }
        else {
            return THEIR_MESSAGE_VIEW
        }
    }

    inner class MyChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        val messageTime: TextView = itemView.findViewById(R.id.time)
        val messageContent: TextView = itemView.findViewById(R.id.message_content)
    }
    class TheirChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val messageWriter:TextView = itemView.findViewById(R.id.name)
        val writerIcon: ImageView = itemView.findViewById(R.id.avatar)
        val messageTime:TextView = itemView.findViewById(R.id.time)
        val messageContent:TextView = itemView.findViewById(R.id.message_content)
    }
}
