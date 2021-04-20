import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbsUpComponent } from './thumbs-up.component';

describe('ThumbsUpComponent', () => {
  let component: ThumbsUpComponent;
  let fixture: ComponentFixture<ThumbsUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThumbsUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbsUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
