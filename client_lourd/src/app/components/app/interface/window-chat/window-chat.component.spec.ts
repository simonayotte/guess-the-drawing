/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WindowChatComponent } from './window-chat.component';

describe('WindowChatComponent', () => {
  let component: WindowChatComponent;
  let fixture: ComponentFixture<WindowChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WindowChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
