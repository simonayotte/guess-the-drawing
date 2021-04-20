import { Injectable, Renderer2 } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

export class RendererProviderService {

  private rendererInstance: Renderer2
  constructor() { }

  setRendererInstance(renderer: Renderer2): void {
    this.rendererInstance = renderer
  }

  getRendererInstance(): Renderer2 {
    return this.rendererInstance
  }
}
