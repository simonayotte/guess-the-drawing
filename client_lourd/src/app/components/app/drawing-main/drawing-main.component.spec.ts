import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppModule } from 'src/app/app.module';
import { MaterialModule } from 'src/app/material/material.module';
import { DrawingMainComponent } from './drawing-main.component';

describe('DrawingMainComponent', () => {
  let component: DrawingMainComponent;
  let fixture: ComponentFixture<DrawingMainComponent>;
  const SCROLLING_SERVICE = 'scrollingService';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MaterialModule, AppRoutingModule, AppModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
  fixture = TestBed.createComponent(DrawingMainComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onScroll should call .next on scrollPos of scrollingService', () => {
    const mockEvent = new Event('scrool');
    const mockTarget = jasmine.createSpyObj('target', ['scrollLeft', 'scrollTop']);
    spyOnProperty(mockEvent, 'target').and.returnValue(mockTarget);
    spyOn(component[SCROLLING_SERVICE].scrollPos, 'next');
    component.onScroll(mockEvent);
    expect(component[SCROLLING_SERVICE].scrollPos.next).toHaveBeenCalled();
  });

});
