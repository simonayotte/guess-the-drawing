import express, { response } from 'express';
import { sendDrawing, sendPoint } from '../database/pairMotImage';
import { QUICKDRAW_OBJECTS } from '../models/quickdrawURL';


export const router = express.Router({
    strict: true
});

const https = require('https');
const qdsr = require('quickdraw-svg-render');
const fs = require('fs');

router.post('/drawing', async (req, res) => {
    const iddrawing = await sendDrawing(req.body);
    res.send({idDrawing: iddrawing});
});

router.post('/point', async (req, res) => {
    await sendPoint(req.body);
    res.send();
});

router.post('/quickdraw', async (req, res) => {
    const previousWord = req.body.previousWord;
    const numCategories = QUICKDRAW_OBJECTS.length
    let quickdraw = QUICKDRAW_OBJECTS[0]
    do {
        const randomNumber = Math.floor((Math.random()*10000))%numCategories;
        quickdraw = QUICKDRAW_OBJECTS[randomNumber]
    } while(quickdraw === previousWord)
    let drawingSvg = qdsr(quickdraw.drawing, false);
    res.send({quickdraw: drawingSvg, word: quickdraw.word});

});

router.post('/populate-quickdraw', async (req, res) => {
    const category = req.body.category;
    let body = "";

    https.get(category,(response: any) => {
        let wasAlreadyCalled = false;
        let missingStart = false;
        let missingEnd = false;
    
        response.on("data", (chunk: any) => {
            if(!wasAlreadyCalled){
                const tempChunk: string = chunk;
                const indexStart = tempChunk.indexOf('{') 
                const indexEnd = tempChunk.indexOf('}') 
                if(indexStart === -1){
                    missingStart = true;
                } else {
                    missingStart = false;
                }

                if(indexEnd === -1){
                    missingEnd = true;
                } else {
                    missingEnd = false;
                }

                if(missingStart && missingEnd){
                    body +=  tempChunk
                } else if(missingStart){
                    body +=  tempChunk.slice(0, indexEnd + 1)
                } else if(missingEnd){
                    body +=  tempChunk.slice(indexStart)
                } else if(indexEnd < indexStart){
                    body +=  tempChunk.slice(0, indexEnd + 1)
                } else {
                    body +=  tempChunk.slice(indexStart, indexEnd + 1)
                }
                if(body.indexOf('{') !== -1 && body.indexOf('}') !== -1){
                    wasAlreadyCalled = true;
                    let jsonNewElement = JSON.parse(body);
                    fs.writeFileSync("../"+ jsonNewElement.word +".json", JSON.stringify(jsonNewElement))
                }
            }
        });
    
        response.on("end", () => {
        
            try {
            } catch (error) {
                console.error(error.message);
            };
        });
    })  
    
    
});
