import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BasicDialogComponent } from './basic-dialog.component';

describe('BasicDialogComponent', () => {
  let component: BasicDialogComponent;
  let fixture: ComponentFixture<BasicDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicDialogComponent ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: 'message received'}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
