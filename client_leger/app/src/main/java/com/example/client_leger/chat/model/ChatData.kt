package com.example.client_leger.chat.model

class ChatData {

    companion object{
        fun createDataSet(): ArrayList<MessageModel>{
            val list = ArrayList<MessageModel>()
            list.add(
                MessageModel(
                    "Failix",
                    "1",
                    "15:43:34",
                    "Yo",
                )
            )
            list.add(
                MessageModel(
                    "Weber",
                    "2",
                    "15:43:34",
                    "Salut",
                )
            )
            list.add(
                MessageModel(
                    "Failix",
                    "1",
                    "15:43:34",
                    "Ca va?",
                )
            )
            list.add(
                MessageModel(
                    "Weber",
                    "2",
                    "15:43:34",
                    "Oui toi?",
                )
            )
            list.add(
                MessageModel(
                    "Failix",
                    "1",
                    "15:43:34",
                    "Yup, pret pour le match?",
                )
            )
            list.add(
                MessageModel(
                    "Weber",
                    "1",
                    "15:43:34",
                    "Let's goooooo",
                )
            )
            return list
        }
    }
}