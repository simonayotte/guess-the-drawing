export class TranslateReader {
    static readTransform(path: SVGPathElement): DOMPoint {
        const transform = path.getAttribute('transform');
        let SUMX = 0;
        let SUMY = 0;
        if (transform === null) {
            return new DOMPoint(SUMX , SUMY);
        } else {
            const arrayElem = transform.split(' ').filter((elem) => Number(elem));
            for (let i = 0; i < arrayElem.length; i++) {
                SUMX += Number(arrayElem[i]);
                SUMY += Number(arrayElem[i + 1]);
                i++;
            }
        }
        return new DOMPoint(SUMX, SUMY);
    }
}
