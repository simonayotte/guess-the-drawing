"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const pairMotImage_1 = require("../database/pairMotImage");
const quickdrawURL_1 = require("../models/quickdrawURL");
exports.router = express_1.default.Router({
    strict: true
});
const https = require('https');
const qdsr = require('quickdraw-svg-render');
const fs = require('fs');
exports.router.post('/drawing', async (req, res) => {
    console.log('Incoming PMI drawing info');
    console.log(req.body);
    const iddrawing = await pairMotImage_1.sendDrawing(req.body);
    res.send({ idDrawing: iddrawing });
    console.log('idDrawing associated with PMI drawing ' + iddrawing);
});
exports.router.post('/point', async (req, res) => {
    console.log('Incoming path for PMI');
    console.log(req.body);
    await pairMotImage_1.sendPoint(req.body);
    res.send();
});
exports.router.post('/quickdraw', async (req, res) => {
    const previousWord = req.body.previousWord;
    const numCategories = quickdrawURL_1.QUICKDRAW_OBJECTS.length;
    let quickdraw = quickdrawURL_1.QUICKDRAW_OBJECTS[0];
    do {
        const randomNumber = Math.floor((Math.random() * 10000)) % numCategories;
        quickdraw = quickdrawURL_1.QUICKDRAW_OBJECTS[randomNumber];
    } while (quickdraw === previousWord);
    console.log(quickdraw.word);
    let drawingSvg = qdsr(quickdraw.drawing, false);
    res.send({ quickdraw: drawingSvg, word: quickdraw.word });
});
exports.router.post('/populate-quickdraw', async (req, res) => {
    const category = req.body.category;
    let body = "";
    https.get(category, (response) => {
        let wasAlreadyCalled = false;
        let missingStart = false;
        let missingEnd = false;
        response.on("data", (chunk) => {
            if (!wasAlreadyCalled) {
                const tempChunk = chunk;
                const indexStart = tempChunk.indexOf('{');
                const indexEnd = tempChunk.indexOf('}');
                if (indexStart === -1) {
                    missingStart = true;
                }
                else {
                    missingStart = false;
                }
                if (indexEnd === -1) {
                    missingEnd = true;
                }
                else {
                    missingEnd = false;
                }
                if (missingStart && missingEnd) {
                    body += tempChunk;
                }
                else if (missingStart) {
                    body += tempChunk.slice(0, indexEnd + 1);
                }
                else if (missingEnd) {
                    body += tempChunk.slice(indexStart);
                }
                else if (indexEnd < indexStart) {
                    body += tempChunk.slice(0, indexEnd + 1);
                }
                else {
                    body += tempChunk.slice(indexStart, indexEnd + 1);
                }
                if (body.indexOf('{') !== -1 && body.indexOf('}') !== -1) {
                    wasAlreadyCalled = true;
                    let jsonNewElement = JSON.parse(body);
                    fs.writeFileSync("../" + jsonNewElement.word + ".json", JSON.stringify(jsonNewElement));
                }
            }
        });
        response.on("end", () => {
            try {
                console.log("quickdraw request done");
            }
            catch (error) {
                console.error(error.message);
            }
            ;
        });
    });
});
