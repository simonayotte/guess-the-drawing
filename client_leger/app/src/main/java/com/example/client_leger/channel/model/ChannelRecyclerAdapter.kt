package com.example.client_leger.channel.model

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
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

class ChannelRecyclerAdapter @Inject constructor(
        var channels: ArrayList<String>,
        private val userInfos: UserInfos,
): RecyclerView.Adapter<ChannelRecyclerAdapter.ViewHolder>() {
    val channelToDelete = MutableLiveData<String>();
    override fun getItemCount() = channels.size

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = channels[position]
        holder.bind(item)
        holder.itemView.setOnClickListener{
            userInfos.activeChannel.value = channels[position]
            userInfos.notificationChannel.value?.let { channelTampon ->
                channelTampon.remove(holder.channelName.text.toString())
                userInfos.notificationChannel.postValue(channelTampon)
            }
            holder.notification.visibility = View.INVISIBLE
        }

        val quitButton = holder.itemView.findViewById<ImageButton>(R.id.quit_button)
        quitButton.setOnClickListener {
            channelToDelete.postValue(item)
        }

        if(userInfos.notificationChannel.value?.contains(holder.channelName.text.toString()) == true){
            holder.notification.visibility = View.VISIBLE
        } else {
            holder.notification.visibility = View.INVISIBLE
        }

    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder.from(parent)
    }

    class ViewHolder private constructor(itemView: View) : RecyclerView.ViewHolder(itemView){
        val channelName: TextView = itemView.findViewById(R.id.channel_name)
        val quitButton: ImageButton = itemView.findViewById(R.id.quit_button)
        val notification: ImageView = itemView.findViewById(R.id.notification)

        fun bind(item: String) {
            channelName.text = item
            if (item == "general" || item.startsWith("Lobby")) {
                quitButton.isEnabled = false
                quitButton.visibility = View.INVISIBLE;
            }
        }

        companion object {
            fun from(parent: ViewGroup): ViewHolder {
                val layoutInflater = LayoutInflater.from(parent.context)
                val view = layoutInflater
                    .inflate(R.layout.channel_list_item, parent, false)

                return ViewHolder(view)
            }
        }
    }
}