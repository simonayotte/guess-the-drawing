import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../../../../material/material.module';
import { GridComponent } from './grid.component';

const INCREMENT_GRID_PIXELS = 'incrementGridPixels';
const DECREMENT_GRID_PIXELS = 'decrementGridPixels';
const GRID_SERVICE = 'gridService';

const FAKE_EVENT = {} as KeyboardEvent;

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridComponent ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onPlus should call incrementGridPixels', () => {
    const spy = spyOn(component[GRID_SERVICE], INCREMENT_GRID_PIXELS);

    component.onPlus(FAKE_EVENT);

    expect(spy).toHaveBeenCalled();
  });

  it('onMinus should call decrementGridPixels', () => {
    const spy = spyOn(component[GRID_SERVICE], DECREMENT_GRID_PIXELS);

    component.onMinus(FAKE_EVENT);

    expect(spy).toHaveBeenCalled();
  });
});
