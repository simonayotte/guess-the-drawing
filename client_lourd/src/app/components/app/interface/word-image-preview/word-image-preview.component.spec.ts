import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordImagePreviewComponent } from './word-image-preview.component';

describe('WordImagePreviewComponent', () => {
  let component: WordImagePreviewComponent;
  let fixture: ComponentFixture<WordImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordImagePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
