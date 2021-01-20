import {Input, Renderer2} from '@angular/core';
import { AltDownNotImplementedError } from '../../../errors/alt-down-not-implemented';
import { AltUpNotImplementedError } from '../../../errors/alt-up-not-implemented';
import { ArrowsChangeNotImplementedError } from '../../../errors/arrows-change-not-implemented';
import { BackspaceDownNotImplementedError } from '../../../errors/backspace-down-not-implemented';
import { CtrlCNotImplemented } from '../../../errors/ctrl-cnot-implemented';
import { CtrlVNotImplemented } from '../../../errors/ctrl-vnot-implemented';
import { DeleteClickNotImplementedError } from '../../../errors/delete-click-not-implemented';
import { DoubleClickNotImplementedError } from '../../../errors/double-click-not-implemented-error';
import { EscapeClickNotImplementedError } from '../../../errors/escape-click-not-implemented';
import { MouseClickNotImplementedError } from '../../../errors/mouse-click-not-implemented';
import { MouseDownNotImplementedError } from '../../../errors/mouse-down-not-implemented';
import { MouseEnterNotImplementedError } from '../../../errors/mouse-enter-not-implemented';
import { MouseLeaveNotImplementedError } from '../../../errors/mouse-leave-not-implemented';
import { MouseMoveNotImplementedError } from '../../../errors/mouse-move-not-implemented';
import { MouseUpNotImplementedError } from '../../../errors/mouse-up-not-implemented';
import { MouseWheelNotImplementedError } from '../../../errors/mouse-wheel-not-implemented';
import { RendererNotImplementedError } from '../../../errors/renderer-not-implemented';
import { RightClickDownNotImplementedError } from '../../../errors/right-click-down-not-implemented';
import { RightMouseDownInElementNotImplementedError } from '../../../errors/right-mouse-down-in-element-not-implemented';
import { ShiftDownNotImplementedError } from '../../../errors/shift-down-not-implemented';
import { ShiftUpNotImplementedError } from '../../../errors/shift-up-not-implemented';
import { ShortCutNotImplemented } from '../../../errors/short-cut-not-implemented';
import { Color } from './color-picker/color';

export abstract class AbstractTool {
    @Input() tool: AbstractTool;
    name: string;

    initializeRenderer(renderer: Renderer2): void {
        const error: RendererNotImplementedError = new RendererNotImplementedError('Renderer Not implemented');
        throw error;
    }

    // If a mouseEvent is not implemented by a tool, it will throw an error saying that this event is not implemented
    onDoubleClick(event: MouseEvent): SVGPathElement  {
        const error: DoubleClickNotImplementedError = new DoubleClickNotImplementedError('Double click not implemented');
        throw error;
    }

    onMouseDownInElement(event: MouseEvent, primaryColor?: Color, secondary?: Color): SVGPathElement | null {
        const error: MouseDownNotImplementedError = new MouseDownNotImplementedError('Mouse down in element not implemented');
        throw error;
    }

    onRightMouseDownInElement(event: MouseEvent, color: Color): SVGPathElement | null {
        const error: RightMouseDownInElementNotImplementedError =
                new RightMouseDownInElementNotImplementedError('Right mouse down in element not implemented');
        throw error;
    }

    onMouseDown(event: MouseEvent, primaryColor?: Color, secondary?: Color): SVGPathElement | null {
        const error: MouseDownNotImplementedError = new MouseDownNotImplementedError('Mouse Down not implemented');
        throw error;
    }

    onRightClickDown(event: MouseEvent): SVGPathElement | null {
        const error: RightClickDownNotImplementedError = new RightClickDownNotImplementedError('Mouse Down right not implemented');
        throw error;
    }

    onMouseUp(event: MouseEvent): SVGPathElement {
        const error: MouseUpNotImplementedError = new MouseUpNotImplementedError('Mouse up not implemented');
        throw error;
    }

    onMouseEnter(event: MouseEvent, primaryColor?: Color, secondary?: Color): SVGPathElement {
        const error: MouseEnterNotImplementedError = new MouseEnterNotImplementedError('Mouse enter not implemented');
        throw error;
    }

    onMouseClick(event: MouseEvent): SVGPathElement {
        const error: MouseClickNotImplementedError = new MouseClickNotImplementedError('Mouse click not implemented');
        throw error;
    }

    onMouseMove(event: MouseEvent): SVGPathElement {
        const error: MouseMoveNotImplementedError =  new MouseMoveNotImplementedError('Mouse move not implemented');
        throw error;
    }

    onEscapeClick(event: KeyboardEvent): SVGPathElement {
        const error: EscapeClickNotImplementedError =  new EscapeClickNotImplementedError('Escape Click not implemented');
        throw error;
    }

    onDeleteClick(event: KeyboardEvent): SVGPathElement {
        const error: DeleteClickNotImplementedError = new DeleteClickNotImplementedError('Delete click not implemented');
        throw error;
    }

    onBackspaceDown(event: KeyboardEvent): SVGPathElement {
        const error: BackspaceDownNotImplementedError = new BackspaceDownNotImplementedError('Backspace down not implemented');
        throw error;
    }

    onShiftDown(event?: KeyboardEvent): SVGPathElement | null  {
        const error: ShiftDownNotImplementedError = new ShiftDownNotImplementedError('Shift down not implemented');
        throw error;
    }

    onShiftUp(event?: KeyboardEvent): SVGPathElement | null {
        const error: ShiftUpNotImplementedError = new ShiftUpNotImplementedError('Shift up not implemented');
        throw error;
    }

    onAltUp(): void {
        const error: AltUpNotImplementedError = new AltUpNotImplementedError('Alt up not implemented');
        throw error;
    }

    onAltDown(): void {
        const error: AltDownNotImplementedError = new AltDownNotImplementedError('Alt down not implemented');
        throw error;
    }

    onMouseWheel(event: WheelEvent): void {
        const error: MouseWheelNotImplementedError = new MouseWheelNotImplementedError('On mouse wheel not implemented');
        throw error;
    }

    onMouseLeave(event: MouseEvent): SVGPathElement {
        const error: MouseLeaveNotImplementedError = new MouseLeaveNotImplementedError('Mouse leave not implemented');
        throw error;
    }

    onArrowsChange(arrowsDown: Map<string, boolean>, event: KeyboardEvent): void {
        const error: ArrowsChangeNotImplementedError =  new ArrowsChangeNotImplementedError('This tool doesnt utilize the arrows');
        throw error;
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
