package com.example.client_leger.chat.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R

class MessageRecyclerAdapter(private val username: String) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    private val messages = ArrayList<MessageModel>()

    companion object {
        const val MY_MESSAGE_VIEW = 1
        const val THEIR_MESSAGE_VIEW = 2
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return if (viewType == MY_MESSAGE_VIEW) {
            val itemView = LayoutInflater.from(parent.context).inflate(R.layout.my_message,
                parent, false)
            MyChatViewHolder(itemView)
        } else {
            val itemView = LayoutInflater.from(parent.context).inflate(R.layout.their_message,
                parent, false)
            TheirChatViewHolder(itemView)
        }

    }
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val currentItem = messages[position]
        if (currentItem.username == username) {
            (holder as MyChatViewHolder).time.text = currentItem.time
            holder.message.text = currentItem.message
        }
        else {
            (holder as TheirChatViewHolder).time.text = currentItem.time
            holder.message.text = currentItem.message
            holder.username.text = currentItem.username
            when (currentItem.avatar) {
                "1" -> holder.avatar.setImageResource(R.drawable.icon_1)
                "2" -> holder.avatar.setImageResource(R.drawable.icon_2)
                "3" -> holder.avatar.setImageResource(R.drawable.icon_3)
                "4" -> holder.avatar.setImageResource(R.drawable.icon_4)
                "5" -> holder.avatar.setImageResource(R.drawable.icon_5)
                "6" -> holder.avatar.setImageResource(R.drawable.icon_6)
                "7" -> holder.avatar.setImageResource(R.drawable.icon_7)
                "8" -> holder.avatar.setImageResource(R.drawable.icon_8)
                "9" -> holder.avatar.setImageResource(R.drawable.icon_9)
                else -> {
                    holder.avatar.setImageResource(R.drawable.icon_0)
                }
            }

        }
    }

    fun setData(newMessages: List<MessageModel>) {
        val diffCallback = MessagesDiffCallback(messages, newMessages)
        val diffResult = DiffUtil.calculateDiff(diffCallback)
        messages.clear()
        messages.addAll(newMessages)
        diffResult.dispatchUpdatesTo(this)
    }

    override fun getItemCount() = messages.size

    override fun getItemViewType(position: Int): Int {
        return if (messages[position].username == username) {
            MY_MESSAGE_VIEW
        } else {
            THEIR_MESSAGE_VIEW
        }
    }

    inner class MyChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val time: TextView = itemView.findViewById(R.id.time)
        val message: TextView = itemView.findViewById(R.id.message_content)
    }

    inner class TheirChatViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val username:TextView = itemView.findViewById(R.id.name)
        val avatar: ImageView = itemView.findViewById(R.id.avatar)
        val time:TextView = itemView.findViewById(R.id.time)
        val message:TextView = itemView.findViewById(R.id.message_content)
    }
}
