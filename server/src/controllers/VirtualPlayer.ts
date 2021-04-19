import { getUsername } from '../database/login';
import { getPointsFromPlayer } from '../database/virtualPlayer';
import config from './VirtualPlayers.json';


export class VirtualPlayer {
    private idPlayer: number;
    private idPartner: number;
    private partnerName: string;

    constructor(idPartner: number, otherVirtualPlayer?: number) {
        let newId = this.getRandomInt(0,4);
        if (otherVirtualPlayer !== undefined) {
            while (newId === otherVirtualPlayer){
                newId = this.getRandomInt(0,4);
            } 
        }
        this.idPlayer = newId;
        this.idPartner = idPartner;
        this.partnerName = "undefined";
    }

    public getIdPlayer(): number {
        return this.idPlayer + 11;
    }

    public getAvatar(): number {
        return config.virtualPlayers[this.idPlayer].avatar;
    }

    public getPlayerName(): string {
        return config.virtualPlayers[this.idPlayer].name;
    }

    public getHint(): string {
        let hintsLenght = config.virtualPlayers[this.idPlayer].hints.length;
        return config.virtualPlayers[this.idPlayer].hints[Math.floor(Math.random() * hintsLenght)];
    }

    public getCheering(): string {
        let cheeringsLenght = config.virtualPlayers[this.idPlayer].cheerings.length;
        return config.virtualPlayers[this.idPlayer].cheerings[Math.floor(Math.random() * cheeringsLenght)] + this.partnerName + "!";
    }

    public async getGameStart(): Promise<string> {
        this.partnerName = await getUsername(this.idPartner)
        return config.virtualPlayers[this.idPlayer].gameStart;
    }

    public getRoundEnd(): string {
        let roundEndLenght = config.virtualPlayers[this.idPlayer].roundEnd.length;
        return config.virtualPlayers[this.idPlayer].roundEnd[Math.floor(Math.random() * roundEndLenght)] + this.partnerName + "!";
    }

    public async getStats(): Promise<string> {
        let sentence = "";
        let roundEndLenght = config.virtualPlayers[this.idPlayer].statsPoints.length;
        sentence = config.virtualPlayers[this.idPlayer].statsPoints[Math.floor(Math.random() * roundEndLenght)] + this.partnerName + "!";
        let points = await getPointsFromPlayer(this.idPartner);
        sentence = sentence.replace("STAT", points.toString());
        return sentence;
    }

    public setTeamMember(name: string): void {
        this.partnerName = name;
    }


    private getRandomInt(min:number, max:number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public getCloseGuess(){
        return "Tu es si proche de la bonne réponse " + this.partnerName + "!!";
    }
}