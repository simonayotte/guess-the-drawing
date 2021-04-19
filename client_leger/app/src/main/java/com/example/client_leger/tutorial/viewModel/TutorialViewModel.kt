package com.example.client_leger.tutorial.viewModel

import android.widget.ImageView
import androidx.databinding.BindingAdapter
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.client_leger.R
import com.example.client_leger.tutorial.model.TutorialData
import com.example.client_leger.tutorial.model.TutorialModel
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject


@HiltViewModel
class TutorialViewModel @Inject constructor(
) : ViewModel() {
    val goToLobby: MutableLiveData<Boolean> = MutableLiveData()
    var title = MutableLiveData<String>("Titre")
    var content = MutableLiveData<String>("Contenu")
    var imageRessource = MutableLiveData<Int>(R.drawable.icon_0)
    private var sectionList = arrayListOf<TutorialModel>()
    private var currentSection = 0


    init {
        sectionList = TutorialData.createDataSet()
        setSection(currentSection)
    }

    fun onClickGoToLobby(){
        goToLobby.value = true
    }

    fun getSections(): ArrayList<TutorialModel> {
        return sectionList
    }

    fun setSection(sectionNumber: Int){
        currentSection = sectionNumber
        title.value = sectionList[sectionNumber].title
        content.value = sectionList[sectionNumber].content
        imageRessource.value = sectionList[sectionNumber].image

    }

    fun nextSection(){
        if (currentSection < sectionList.size-1 ) {
            currentSection++
            setSection(currentSection)
        }
    }

    fun previousSection(){
        if (currentSection > 0) {
            currentSection--
            setSection(currentSection)
        }
    }

}