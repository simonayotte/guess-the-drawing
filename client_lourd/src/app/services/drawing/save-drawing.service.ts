import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { MetaData } from '../../models/meta-data';
import { LOWER_A_CHARCODE,
  LOWER_Z_CHARCODE, NINE_CHARCODE,
  UPPER_A_CHARCODE, UPPER_Z_CHARCODE, ZERO_CHARCODE } from '../../components/app/tools/color-picker/constants';
const MIN_CHAR = 2;
const MAX_CHAR = 50;

@Injectable({
  providedIn: 'root'
})
export class SaveDrawingService {

  private imageMetadata: MetaData;

  constructor(private http: HttpClient) {
    this.imageMetadata = {name: '', tags: [''], imageData: ''};
  }

  nameIsValid(name: string): boolean {
    let counter = 0;
    for (const char of name) {
      const charCode = char.charCodeAt(0);
      if (charCode < ZERO_CHARCODE || (charCode > NINE_CHARCODE && charCode < UPPER_A_CHARCODE)
        || (charCode > UPPER_Z_CHARCODE && charCode < LOWER_A_CHARCODE)
        || charCode > LOWER_Z_CHARCODE) {
        return false;
      }
      counter++;
    }
    return (counter >= MIN_CHAR && counter <= MAX_CHAR) ? true : false;
  }

  saveDrawing(name: string, tags: string[], sourceSvg: SVGElement): void {
    const imageData = SvgManager.getB64(sourceSvg);
    this.imageMetadata = { name, tags, imageData };
    this.http.post<MetaData>('http://localhost:3000/database/metadata', this.imageMetadata).subscribe();
  }
}
