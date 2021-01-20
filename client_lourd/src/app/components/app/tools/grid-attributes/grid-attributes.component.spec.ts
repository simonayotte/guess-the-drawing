import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRoutingModule } from '../../../../app-routing.module';
import { AppModule } from '../../../../app.module';
import { MaterialModule } from '../../../../material/material.module';
import { GridAttributesComponent } from './grid-attributes.component';

const GRID_SERVICE = 'gridService';
const SET_TRANSPARENCY = 'setTransparency';
const SET_GRID_PIXEL_SIZE = 'setGridPixelSize';
const SET_ACTIVATION = 'setActivation';

const FAKE_NUMBER = 0;

describe('GridAttributesComponent', () => {
  let component: GridAttributesComponent;
  let fixture: ComponentFixture<GridAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ MaterialModule, AppRoutingModule, AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateTransparency should call setTransparency from gridService', () => {
    const spy = spyOn(component[GRID_SERVICE], SET_TRANSPARENCY);

    component.updateTransparency(FAKE_NUMBER);

    expect(spy).toHaveBeenCalled();
  });

  it('updateGridPixelSize should call setGridPixelSize from gridService', () => {
    const spy = spyOn(component[GRID_SERVICE], SET_GRID_PIXEL_SIZE);

    component.updateGridPixelSize(FAKE_NUMBER);

    expect(spy).toHaveBeenCalled();
  });

  it('updateActivation should call setActivation from gridService', () => {
    const spy = spyOn(component[GRID_SERVICE], SET_ACTIVATION);

    component.updateActivation(true);

    expect(spy).toHaveBeenCalled();
  });
});
