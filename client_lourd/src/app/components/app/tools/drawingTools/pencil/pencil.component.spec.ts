import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { PencilComponent } from './pencil.component';

const PENCIL_SERVICE = 'pencilService';

describe('PencilComponent', () => {
  let component: PencilComponent;
  let fixture: ComponentFixture<PencilComponent>;
  const path: SVGPathElement = {} as SVGPathElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // onMouseEnter
  it('onMouseEnter should call onMouseEnter of pencilService', () => {
    const mockMouseEnter = new MouseEvent('mouseenter');
    spyOn(component[PENCIL_SERVICE], 'onMouseEnter').and.returnValue(path);

    component.onMouseEnter(mockMouseEnter);
    expect(component[PENCIL_SERVICE].onMouseEnter).toHaveBeenCalled();
  });

  // onMouseDownInElement
  it('onMouseDownInElement should call onMouseDownInElement of pencilService', () => {
    const mockMouseDownInElement = new MouseEvent('mousedown');
    spyOn(component[PENCIL_SERVICE], 'onMouseDownInElement').and.returnValue(path);

    component.onMouseDownInElement(mockMouseDownInElement);
    expect(component[PENCIL_SERVICE].onMouseDownInElement).toHaveBeenCalled();
  });

  // onMouseUp
  it('onMouseUp should call onMouseUp of pencilService', () => {
    const mockMouseUp = new MouseEvent('mouseup');
    spyOn(component[PENCIL_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseUp(mockMouseUp);
    expect(component[PENCIL_SERVICE].onMouseUp).toHaveBeenCalled();
  });

  // onMouseMove
  it('onMouseMove should call onMouseMove of pencilService', () => {
    const mockMouseMove = new MouseEvent('mousemove');
    spyOn(component[PENCIL_SERVICE], 'onMouseMove').and.returnValue(path);

    component.onMouseMove(mockMouseMove);
    expect(component[PENCIL_SERVICE].onMouseMove).toHaveBeenCalled();
  });

  // onMouseLeave
  it('onMouseLeave should call onMouseUp of pencilService', () => {
    const mockMouseLeave = new MouseEvent('mouseleave');
    spyOn(component[PENCIL_SERVICE], 'onMouseUp').and.returnValue(path);

    component.onMouseLeave(mockMouseLeave);
    expect(component[PENCIL_SERVICE].onMouseUp).toHaveBeenCalled();
  });
});
