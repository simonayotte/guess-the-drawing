import { VirtualPlayer } from "./VirtualPlayer";


export class VirtualPlayerService {
    private virtualPlayers = new Map<number, VirtualPlayer>();

    constructor() {
    }

    public newPlayer(idPartner: number, idOtherVirtualPlayer?: number): number {
        let id = 1000;
        while(this.virtualPlayers.has(id)) {
            id++;
        }
        this.virtualPlayers.set(id, new VirtualPlayer(idPartner, idOtherVirtualPlayer));
        return id;
    }

    public deletePlayer(idVirtualPlayer: number): void {
        this.virtualPlayers.delete(idVirtualPlayer);
    }

    public getIdPlayer(idVirtualPlayer: number): number {
        let id = this.virtualPlayers.get(idVirtualPlayer)?.getIdPlayer();
        return (id != undefined) ? id : 10
    }

    public getName(idVirtualPlayer: number): string {
        let name = this.virtualPlayers.get(idVirtualPlayer)?.getPlayerName();
        return (name != undefined) ? name : "Botty Crocker"
    }

    public getAvatar(idVirtualPlayer: number): number {
        let avatar = this.virtualPlayers.get(idVirtualPlayer)?.getAvatar();
        return (avatar != undefined) ? avatar : 9
    }

    public getHint(idVirtualPlayer: number): string {
        let hint = this.virtualPlayers.get(idVirtualPlayer)?.getHint();
        return (hint != undefined) ? hint : "hint error"
    }

    public getVirtualPlayerName(idVirtualPlayer: number): string {
        let name = this.virtualPlayers.get(idVirtualPlayer)?.getPlayerName();
        return (name != undefined) ? name : "name error"
    }

    public getCheering(idVirtualPlayer: number): string {
        let cheering = this.virtualPlayers.get(idVirtualPlayer)?.getCheering();
        return (cheering != undefined) ? cheering : "cheering error"
    }

    public async getGameStart(idVirtualPlayer: number): Promise<string> {
        let startSentence = await this.virtualPlayers.get(idVirtualPlayer)?.getGameStart();
        return (startSentence != undefined) ? startSentence : "startSentence error"
    }

    public async getStat(idVirtualPlayer: number): Promise<string> {
        let stat;
        try {
            stat = await this.virtualPlayers.get(idVirtualPlayer)?.getStats();
        } catch(err) {
            return "stat error";
        }
        return (stat != undefined) ? stat : "stat error"
    }

    public getRoundEnd(idVirtualPlayer: number): string {
        let endSentence = this.virtualPlayers.get(idVirtualPlayer)?.getRoundEnd();
        return (endSentence != undefined) ? endSentence : "endSentence error"
    }

    public getCloseGuess(idVirtualPlayer: number): string {
        let closeGuessSentence = this.virtualPlayers.get(idVirtualPlayer)?.getCloseGuess();
        return (closeGuessSentence != undefined) ? closeGuessSentence : "closeGuess error"
    }

}