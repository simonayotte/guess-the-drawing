import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetaData } from '../../models/meta-data';
import { CanvasManager } from '../../components/app/tools/graphics/canvas-manager';
import { CANVAS_DEFAULT_DIMENSIONS } from '../../components/app/tools/graphics/graphics-constants';
import { DATATYPES } from '../../components/app/tools/graphics/graphics-factory/datatype-factory';
import { GraphicsManager } from '../../components/app/tools/graphics/graphics-manager';
import { GraphicFormat } from '../../components/app/tools/graphics/graphics-types';
import { SvgManager } from '../../components/app/tools/graphics/svg-manager';

interface IEmailData {
  base64Data: string;
  email: string;
  fileName: string;
  imageType: string;
}

export const ALERT_INVALID_EMAIL = "Le format de l'adresse courriel est invalide.";
export const ALERT_SENT_EMAIL = 'Le courriel a été envoyé avec succès.';
export const ALERT_NONE = '';
const SEND_MAIL_URL = 'http://localhost:3000/email/send';
const EMAIL_REGEX = /^[\w\-\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

@Injectable({
  providedIn: 'root'
})
export class ExporterService {
  graphicalManager: GraphicsManager;
  emailAlert: BehaviorSubject<{ msg: string, err: boolean }>;

  constructor(private http: HttpClient) {
    this.graphicalManager = new GraphicsManager();
    this.emailAlert = new BehaviorSubject<{ msg: string, err: boolean }>({msg: ALERT_NONE, err: false});
  }

  exportLocally(source: SVGElement | HTMLElement, format: GraphicFormat): string {
    return this.graphicalManager.getUrl(source, format);
  }

  exportEmail(source: SVGElement | HTMLElement, format: GraphicFormat, emailAddress: string, filename: string): void {
    const url = (source instanceof SVGElement) ? SvgManager.getB64(source) : this.graphicalManager.getUrl(source, format);

    const emailData: IEmailData = {
      base64Data: url,
      email: emailAddress,
      fileName: filename,
      imageType: DATATYPES[format]
    };

    this.http.post<MetaData>(SEND_MAIL_URL, emailData).subscribe(
      () => {
        this.emailAlert.next({msg: ALERT_SENT_EMAIL, err: false});
      },
      () => {
        this.emailAlert.next({msg: ALERT_INVALID_EMAIL, err: true});
      }
    );
  }

  updatePreviewCanvas(svg: SVGElement, canvas: HTMLCanvasElement): void {
    const ratio = SvgManager.getAspectRatio(svg);
    ratio.width *= CANVAS_DEFAULT_DIMENSIONS.width;
    ratio.height *= CANVAS_DEFAULT_DIMENSIONS.height;
    CanvasManager.resize(canvas, ratio);
    this.graphicalManager.svgToCanvas(svg, canvas, false);
  }

  updateExportCanvas(svg: SVGElement, canvas: HTMLCanvasElement): void {
    this.graphicalManager.svgToCanvas(svg, canvas, true);
  }

  validateEmail(email: string): boolean {
    const regex = new RegExp(EMAIL_REGEX);
    return regex.test(email);
  }
}
