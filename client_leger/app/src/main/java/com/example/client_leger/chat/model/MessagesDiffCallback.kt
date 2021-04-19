package com.example.client_leger.chat.model

import androidx.annotation.Nullable
import androidx.recyclerview.widget.DiffUtil

class MessagesDiffCallback(private val oldList: List<MessageModel>, private val newList: List<MessageModel>) : DiffUtil.Callback() {
    override fun getOldListSize(): Int = oldList.size
    override fun getNewListSize(): Int = newList.size

    // Quickly check if two items are the same
    // If not, directly refresh it. Otherwise, try areContentsTheSame
    override fun areItemsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldList[oldItemPosition].time == newList[newItemPosition].time
    }

    override fun areContentsTheSame(oldItemPosition: Int, newItemPosition: Int): Boolean {
        return oldList[oldItemPosition] == newList[newItemPosition]
    }

    @Nullable
    override fun getChangePayload(oldPosition: Int, newPosition: Int): Any? {
        return super.getChangePayload(oldPosition, newPosition)
    }
}