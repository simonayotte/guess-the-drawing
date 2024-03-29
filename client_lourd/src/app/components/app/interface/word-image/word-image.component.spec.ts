/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WordImageComponent } from './word-image.component';

describe('WordImageComponent', () => {
  let component: WordImageComponent;
  let fixture: ComponentFixture<WordImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
