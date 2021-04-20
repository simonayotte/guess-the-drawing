import { Input, Renderer2, Directive } from '@angular/core';
import { CtrlCNotImplemented } from '../../../errors/ctrl-cnot-implemented';
import { CtrlVNotImplemented } from '../../../errors/ctrl-vnot-implemented';
import { RendererNotImplementedError } from '../../../errors/renderer-not-implemented';
import { ShortCutNotImplemented } from '../../../errors/short-cut-not-implemented';

@Directive()
export abstract class AbstractTool {
    @Input() tool: AbstractTool;
    name: string;

    initializeRenderer(renderer: Renderer2): void {
        const error: RendererNotImplementedError = new RendererNotImplementedError('Renderer Not implemented');
        throw error;
    }

    // If a mouseEvent is not implemented by a tool, it will throw an error saying that this event is not implemented
    onDoubleClick(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseDownInElement(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseDown(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onRightClickDown(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseUp(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseEnter(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseClick(event: MouseEvent): SVGPathElement | null  {
      return null;
    }

    onMouseMove(event: MouseEvent): SVGPathElement | null {
      return null;
    }

    onEscapeClick(event: KeyboardEvent): SVGPathElement | null {
      return null;
    }

    onDeleteClick(event: KeyboardEvent): SVGPathElement | null {
      return null;
    }

    onBackspaceDown(event: KeyboardEvent): SVGPathElement | null {
      return null;
    }

    onShiftDown(event?: KeyboardEvent): SVGPathElement | null {
      return null;
    }

    onShiftUp(event?: KeyboardEvent): SVGPathElement | null {
      return null;
    }

    onAltUp(): void {
        return;
    }

    onAltDown(): void {
        return;
    }

    onMouseWheel(event: WheelEvent): void {
      return;
    }

    onMouseLeave(event: MouseEvent): SVGPathElement | null {
      return null;
    }

    onCtrlC(): void {
        const error: CtrlCNotImplemented = new CtrlCNotImplemented('This tool does not support ctrl+c');
        throw error;
    }
    onCtrlV(): void {
        const error: CtrlVNotImplemented = new CtrlVNotImplemented('This tool does not support ctrl+v');
        throw error;
    }
    onCtrlX(): void {
        const error: ShortCutNotImplemented = new ShortCutNotImplemented('This tool does not support ctrl+x');
        throw error;
    }
    onDelete(): void {
        const error: ShortCutNotImplemented = new ShortCutNotImplemented('This tool does not support delete');
        throw error;
    }
    onCtrlD(): void {
        const error: ShortCutNotImplemented = new ShortCutNotImplemented('This tool does not support ctrl+D');
        throw error;
    }
}
