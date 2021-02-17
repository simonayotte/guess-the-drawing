/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginService } from 'src/app/services/login/login.service';

import { ConversationComponent } from './conversation.component';

describe('ConversationComponent', () => {
  let component: ConversationComponent;
  let fixture: ComponentFixture<ConversationComponent>;
  let mockLoginService: LoginService;

  beforeEach(async(() => {
    mockLoginService = jasmine.createSpyObj('loginService', ['getCurrentUser']);

    TestBed.configureTestingModule({
      declarations: [ConversationComponent],
      imports: [],
      providers: [{provide: LoginService, useValue: mockLoginService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
