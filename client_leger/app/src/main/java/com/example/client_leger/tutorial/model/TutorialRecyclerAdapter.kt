package com.example.client_leger.tutorial.model

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.example.client_leger.R
import com.example.client_leger.tutorial.viewModel.TutorialViewModel
import kotlin.collections.ArrayList
import kotlinx.android.synthetic.main.activity_lobby.*


class TutorialRecyclerAdapter(private val sections: ArrayList<TutorialModel>, private val viewModel: TutorialViewModel) :
    RecyclerView.Adapter<TutorialRecyclerAdapter.TutorialViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TutorialViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.tutorial_list_item,
            parent, false)
        return TutorialViewHolder(itemView)
    }
    override fun onBindViewHolder(holder: TutorialViewHolder, position: Int) {
        val currentItem = sections[position]
        holder.title.text = currentItem.title
        holder.itemView.setOnClickListener{
            viewModel.setSection(position)
        }
    }
    override fun getItemCount() = sections.size

    class TutorialViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title:TextView = itemView.findViewById(R.id.section_title)
    }
}
