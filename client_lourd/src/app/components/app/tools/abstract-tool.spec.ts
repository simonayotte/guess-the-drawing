/*import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ShapeToolComponent } from './shapeTools/shape-tool/shape-tool.component';

class MockRenderer2 {
  appendChild(): void {
    return;
  }
  setAttribute(): void {
    return;
  }
  createElement(): void {
    return;
  }
}
*/
/* describe('Abstract tool', () => {
  let mockShapeTool: ShapeToolComponent;
  let mockMouseEvent: MouseEvent;
  let mockKeyboardEvent: KeyboardEvent;
  let mockRenderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{provide: Renderer2, useClass: MockRenderer2}]}).compileComponents();
  });

  beforeEach(() => {
    mockShapeTool = new ShapeToolComponent();
    mockMouseEvent = new MouseEvent('mouseEvent');
    mockKeyboardEvent = new KeyboardEvent('keyboardEvent');
    mockRenderer = TestBed.get(Renderer2);
  });

  // initializeRenderer()
  it ('initializeRenderer should catch an error', () => {
    try {
      mockShapeTool.initializeRenderer(mockRenderer);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseLeave()
  it ('onMouseLeave should catch an error', () => {
    try {
      mockShapeTool.onMouseLeave(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseWheel()
  it ('onMouseWheel should catch an error', () => {
    try {
      mockShapeTool.onMouseWheel(new WheelEvent('test'));
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onAltDown()
  it ('onAltDown should catch an error', () => {
    try {
      mockShapeTool.onAltDown();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onAltUp()
  it ('onAltUp should catch an error', () => {
    try {
      mockShapeTool.onAltUp();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onShiftUp()
  it ('onShiftUp should catch an error', () => {
    try {
      mockShapeTool.onShiftUp(mockKeyboardEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  it('onArrowsChange should catch an erro', () => {
    expect(() => {
      mockShapeTool.onArrowsChange(new Map(), mockKeyboardEvent);
    }).toThrowError();
  });

  // onShiftDown()
  it ('onShiftDown should catch an error', () => {
    try {
      mockShapeTool.onShiftDown(mockKeyboardEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onBackspaceDown()
  it ('onBackspaceDown should catch an error', () => {
    try {
      mockShapeTool.onBackspaceDown(mockKeyboardEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onDeleteClick()
  it ('onDeleteClick should catch an error', () => {
    try {
      mockShapeTool.onDeleteClick(mockKeyboardEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onEscapeClick()
  it ('onEscapeClick should catch an error', () => {
    try {
      mockShapeTool.onEscapeClick(mockKeyboardEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseMove()
  it ('onMouseMove should catch an error', () => {
    try {
      mockShapeTool.onMouseMove(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseClick()
  it ('onMouseClick should catch an error', () => {
    try {
      mockShapeTool.onMouseClick(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseEnter()
  it ('onMouseEnter should catch an error', () => {
    try {
      mockShapeTool.onMouseEnter(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseUp()
  it ('onMouseUp should catch an error', () => {
    try {
      mockShapeTool.onMouseUp(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseDown()
  it ('onMouseDown should catch an error', () => {
    try {
      mockShapeTool.onMouseDown(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onMouseDownInElement()
  it ('onMouseDownInElement should catch an error', () => {
    try {
      mockShapeTool.onMouseDownInElement(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });

  // onDoubleClick()
  it ('onDoubleClick should catch an error', () => {
    try {
      mockShapeTool.onDoubleClick(mockMouseEvent);
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
  it ('onctrlc should catch an error', () => {
    try {
      mockShapeTool.onCtrlC();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
  it ('onctrlv should catch an error', () => {
    try {
      mockShapeTool.onCtrlV();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
  it ('onctrlD should catch an error', () => {
    try {
      mockShapeTool.onCtrlD();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
  it ('onctrlX should catch an error', () => {
    try {
      mockShapeTool.onCtrlX();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
  it ('onDelete should catch an error', () => {
    try {
      mockShapeTool.onDelete();
      expect(1).toEqual(0);
    } catch (err) {
      expect(1).toEqual(1);
    }
  });
});
*/
