import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EffectsService {
  goodGuessPath : string;
  badGuessPath : string;
  audio : HTMLAudioElement 

  constructor() {
    this.badGuessPath = "assets/sounds/loose-piano.wav"
    this.goodGuessPath= "assets/sounds/bonus.wav"
    this.audio = new Audio();
  }

  // Effet sonore que l'on joue apres chaque tentavive de resolution du dessin
  playAudio(isGuessCorrect : boolean) : void {
    if (isGuessCorrect)
      this.audio.src = this.goodGuessPath
    else this.audio.src = this.badGuessPath
    this.audio.load();
    this.audio.play();
  }
}
