import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from '../../../../app-routing.module';
import { AppModule } from '../../../../app.module';
import { MaterialModule } from '../../../../material/material.module';
import { Color } from './color';
import { ColorPickerComponent } from './color-picker.component';

const COLOR_PICKER_SERVICE = 'colorPickerService';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit()
  it('should intantiate color if undefined', () => {
    component.color = null as unknown as Color;
    const fakeColor = new Color(Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_COLOR, Color.MAX_ALPHA);
    component[COLOR_PICKER_SERVICE].density.next(fakeColor);
    expect(component.color).toBe(fakeColor);
  });
});
