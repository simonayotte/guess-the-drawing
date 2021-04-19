// Configuration des models de la database
export interface PMIDrawingModel {
    word: string,
    difficulty: number,
    hints: string[],
    isRandom: boolean,
}

export interface PMIPointModel {
    idDrawing: number,
    point: string,
    thickness: number,
    color: string,
    pathOrder: number,
}
