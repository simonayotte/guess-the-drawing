package com.example.client_leger.channel_join.model

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.liveData
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import io.reactivex.Observable
import io.reactivex.subjects.PublishSubject
import javax.inject.Inject

class ChannelJoinRecyclerAdapter @Inject constructor(
        private val channels: List<String>,
        private val userInfos: UserInfos,
): RecyclerView.Adapter<ChannelJoinRecyclerAdapter.ViewHolder>() {
    override fun getItemCount() = channels.size
    val channelToJoin = MutableLiveData<String>();

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = channels[position]
        holder.bind(item)
        val joinButton = holder.itemView.findViewById<Button>(R.id.join_button)
        joinButton.setOnClickListener{
            channelToJoin.postValue(item)
        }
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder.from(parent)
    }

    class ViewHolder private constructor(itemView: View) : RecyclerView.ViewHolder(itemView){
        val channelName: TextView = itemView.findViewById(R.id.channel_name)

        fun bind(item: String) {
            val res = itemView.context.resources
            channelName.text = item
        }

        companion object {
            fun from(parent: ViewGroup): ViewHolder {
                val layoutInflater = LayoutInflater.from(parent.context)
                val view = layoutInflater
                    .inflate(R.layout.channel_join_list_item, parent, false)

                return ViewHolder(view)
            }
        }
    }
}