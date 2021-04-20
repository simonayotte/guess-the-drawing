export interface PlayerInfo {
    id: number,
    name: string,
    avatar: string,
    team: number,
    score?: number,
    role?: RoleType
}

export enum RoleType {
    Drawing = "Dessine",
    Guessing = "Devine",
    Watching = ""
}