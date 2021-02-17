package com.example.client_leger.lobby.model

class LobbyData {

    companion object{
        fun createDataSet(): ArrayList<LobbyModel>{
            val list = ArrayList<LobbyModel>()
            list.add(
                LobbyModel(
                    "Salon 1",
                    "3/4 joueurs",
                    "Hardcore",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 2",
                    "0/4 joueurs",
                    "BattleRoyal",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 3",
                    "1/4 joueurs",
                    "Classique",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 4",
                    "1/4 joueurs",
                    "Classique",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 5",
                    "1/4 joueurs",
                    "Classique",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 6",
                    "1/4 joueurs",
                    "Classique",
                )
            )
            list.add(
                LobbyModel(
                    "Salon 7",
                    "1/4 joueurs",
                    "Classique",
                )
            )
            return list
        }
    }
}