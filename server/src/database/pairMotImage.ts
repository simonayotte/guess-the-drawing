const db = require('./database');
import { PMIDrawingModel, PMIPointModel } from '../models/models';

export async function sendDrawing(data : PMIDrawingModel) {
    return new Promise((resolve, reject) => {
        db.query(`
        INSERT INTO pair_mot_image.Drawing(drawingName, indice, difficultyLevel, isRandom)
        VALUES ($1, $2, $3, $4)
        RETURNING Drawing.iddrawing
        `, [data.word, data.hints, data.difficulty, data.isRandom], (err2: any, iddrawing: any) => {
            if (err2) throw err2;
            resolve(iddrawing.rows[0].iddrawing);
        });
    });
};

export async function sendPoint(data : PMIPointModel) {
    await db.query(`
    INSERT INTO pair_mot_image.Line(idDrawing, point, thickness, color, pathOrder)
    VALUES ($1, $2, $3, $4, $5)
    `, [data.idDrawing, data.point, data.thickness, data.color, data.pathOrder], (err2: any,) => {
        if (err2) throw err2;
    });
}; 