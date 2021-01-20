import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuId } from './menu-id.enum';
import { MenuTreeComponent } from './menu-tree.component';

const USER_GUIDE_SERVICE = 'userGuideService';

describe('MenuTreeComponent', () => {
  let component: MenuTreeComponent;
  let fixture: ComponentFixture<MenuTreeComponent>;
  const idMenuItemToDisplay: MenuId = MenuId.WELCOME;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuTreeComponent],
      imports: [MaterialModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // resetMenuExpansion
  it('resetMenuExpansion should call resetMenuExpansion() function from UserGuideService', () => {
    spyOn(component[USER_GUIDE_SERVICE], 'resetMenuExpansion').and.returnValue();

    component.resetMenuExpansion();
    expect(component[USER_GUIDE_SERVICE].resetMenuExpansion).toHaveBeenCalled();

  });

  // displayDescription
  it('displayDescription should call displayDescription() function from UserGuideService', () => {
    spyOn(component[USER_GUIDE_SERVICE], 'displayDescription').and.returnValue();

    component.displayDescription(idMenuItemToDisplay);
    expect(component[USER_GUIDE_SERVICE].displayDescription).toHaveBeenCalled();

  });
});
