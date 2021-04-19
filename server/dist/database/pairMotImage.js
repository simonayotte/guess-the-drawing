"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPoint = exports.sendDrawing = void 0;
const db = require('./database');
async function sendDrawing(data) {
    return new Promise((resolve, reject) => {
        db.query(`
        INSERT INTO pair_mot_image.Drawing(drawingName, indice, difficultyLevel, isRandom)
        VALUES ($1, $2, $3, $4)
        RETURNING Drawing.iddrawing
        `, [data.word, data.hints, data.difficulty, data.isRandom], (err2, iddrawing) => {
            if (err2)
                throw err2;
            resolve(iddrawing.rows[0].iddrawing);
        });
    });
}
exports.sendDrawing = sendDrawing;
;
async function sendPoint(data) {
    await db.query(`
    INSERT INTO pair_mot_image.Line(idDrawing, point, thickness, color, pathOrder)
    VALUES ($1, $2, $3, $4, $5)
    `, [data.idDrawing, data.point, data.thickness, data.color, data.pathOrder], (err2) => {
        if (err2)
            throw err2;
    });
}
exports.sendPoint = sendPoint;
;
