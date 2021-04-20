import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameActivityComponent } from './game-activity.component';

describe('GameActivityComponent', () => {
  let component: GameActivityComponent;
  let fixture: ComponentFixture<GameActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
