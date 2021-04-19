package com.example.client_leger.lobby.viewModel

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.SocketConnectionService
import com.example.client_leger.chat.model.MessageModel
import com.example.client_leger.game.model.GameRepository
import com.example.client_leger.lobby.model.*
import com.example.client_leger.utils.MessageResponseModel
import com.example.client_leger.utils.Result
import com.example.client_leger.utils.UserInfos
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LobbyViewModel @Inject constructor(
        private val userInfos: UserInfos,
        private val socketConnectionService: SocketConnectionService,
        private val lobbyRepository: LobbyRepository,
        private val gameRepository: GameRepository,
) : ViewModel() {

    val lobbyShown = MutableLiveData<LobbyModel?>()
    val lobbyAdapter: LobbyRecyclerAdapter = LobbyRecyclerAdapter(listOf(), lobbyRepository.activeLobbyId, this::changeLobby)
    val lobbyPlayersAdapter: LobbyPlayersRecyclerAdapter =  LobbyPlayersRecyclerAdapter(listOf())

    val successfulSignOut: MutableLiveData<Boolean> = MutableLiveData()
    val goToLeaderboard: MutableLiveData<Boolean> = MutableLiveData()
    val goToProfile: MutableLiveData<Boolean> = MutableLiveData()
    val showTutorial: MutableLiveData<Boolean> = MutableLiveData()
    val goToGame: MutableLiveData<Boolean> = MutableLiveData()
    val goToAddLobby: MutableLiveData<Boolean> = MutableLiveData()
    val chatName = MutableLiveData<String>("Salon 1")
    val message = MutableLiveData<String>("")
    val chatMessage = MutableLiveData<MessageModel>()
    val canStartGame = MutableLiveData<Boolean>(false)

    init {
        lobbyRepository.lobbies.observeForever {
            val activeLobbyId = lobbyRepository.activeLobbyId.value
            if(activeLobbyId != null) {
                lobbyShown.value = it?.find { lobby -> lobby.id == activeLobbyId }
            }
            lobbyAdapter.lobbies = it
            lobbyAdapter.notifyDataSetChanged()
        }

        lobbyRepository.activeLobbyId.observeForever{
            if(it == null) {
                lobbyShown.value = null
            } else {
                lobbyShown.value = lobbyRepository.lobbies.value?.find { lobby -> lobby.id == it }
            }
        }

        lobbyShown.observeForever {
            it?.players?.let { playersList ->
                lobbyPlayersAdapter.players = playersList
                lobbyPlayersAdapter.notifyDataSetChanged()
            }
            canStartGame.value = it?.players?.size ?: 0 >= it?.minPlayers ?: 0
        }

        lobbyRepository.loadGame.observeForever {
            if(it) {
                goToGame.value = true
                lobbyRepository.loadGame.value = false
            }
        }
    }

    fun updateLobbies() {
        lobbyRepository.requestLobbyList()
    }

    fun changeLobby(newLobby: Int?) {
        lobbyRepository.leaveLobby()
        if(newLobby != null) {
            lobbyRepository.joinLobby(newLobby)
        }
    }

    fun onClickAddLobby() {
        goToAddLobby.value = true
    }

    fun onClickSignOut(){
        successfulSignOut.value = true
    }

    fun onClickLeaderboard(){
        goToLeaderboard.value = true
    }

    fun onClickProfile(){
        goToProfile.value = true
    }

    fun onClickStartGame() {
        lobbyRepository.activeLobbyId.value?.let {
            gameRepository.startGame(it)
        }
    }


    fun onClickShowTutorial(){
        showTutorial.value = true
    }
    fun createLobby(gameMode: LobbyModel.GameMode, difficulty: LobbyModel.Difficulty) {
        lobbyRepository.createLobby(gameMode, difficulty)
    }


}