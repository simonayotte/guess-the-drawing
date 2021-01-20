import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LastSelectedColorsComponent } from './last-selected-colors.component';

const SELECTED_COLOR_SERVICE = 'selectedColorsService';
const INDEX = 1;

describe('LastSelectedColorsComponent', () => {
  let component: LastSelectedColorsComponent;
  let fixture: ComponentFixture<LastSelectedColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastSelectedColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSelectedColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // reUseColor()
  it('reUseColor should call reUseColor from selectedColorService', () => {
    const mockEvent = new MouseEvent('mousedown');
    spyOn(component[SELECTED_COLOR_SERVICE], 'reUseColor').and.returnValue();
    component.reUseColor(INDEX, mockEvent);

    expect(component[SELECTED_COLOR_SERVICE].reUseColor).toHaveBeenCalled();
  });

});
