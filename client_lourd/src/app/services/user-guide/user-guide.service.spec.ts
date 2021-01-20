import { TestBed } from '@angular/core/testing';
import { MenuId } from 'src/app/components/app/user-guide/menu-tree/menu-id.enum';
import { UserGuideService } from './user-guide.service';
const ID_NO_DESCRIPTION = 109;

describe('Service: UserGuide', () => {
  let service: UserGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [UserGuideService] });
    service = TestBed.get(UserGuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('menuIsExpended should return true if menu is expanded', () => {
    service.navigationIsClicked = true;
    const returnedValue = service.menuIsExpanded();
    expect(returnedValue).toBe(true);
  });

  // resetMenuExpansion()
  it('resetMenuExpansion should put navigationIsClicked to false', () => {
    service.navigationIsClicked = true;
    service.resetMenuExpansion();
    expect(service.navigationIsClicked).toBe(false);
  });

  // descriptionIsSelected(MenuId)
  it('descriptionIsSelected should return true if idMenu is the same as idDescription', () => {

    service.idDescription = MenuId.WELCOME;
    const idMenuWelcome: MenuId = MenuId.WELCOME;
    const idMenuNewDrawing: MenuId = MenuId.NEW_DRAWING;

    expect(service.descriptionIsSelected(idMenuNewDrawing)).toBe(false);
    expect(service.descriptionIsSelected(idMenuWelcome)).toBe(true);
  });

  // categoryIsHidden(boolean)
  it('categoryIsHidden should return true if navigationIsClicked and categoryIsClicked are false', () => {
    service.navigationIsClicked = false;
    const categoryIsClicked = false;
    const categoryIsHidden = service.categoryIsHidden(categoryIsClicked);
    expect(categoryIsHidden).toBe(true);
  });

  it('categoryIsHidden should return false if navigationIsClicked or categoryIsClicked are true', () => {
    service.navigationIsClicked = false;
    const categoryIsClicked = true;
    const categoryIsHidden = service.categoryIsHidden(categoryIsClicked);
    expect(categoryIsHidden).toBe(false);
  });

  // displayDescription(number)
  it('displayDescription should change the idDescription to the idMenuItemToDisplay', () => {
    service.idDescription = MenuId.WELCOME;
    const idMenuItemToDisplay: MenuId.WELCOME = 5;
    service.displayDescription(idMenuItemToDisplay);
    expect(service.idDescription).toEqual(idMenuItemToDisplay);
  });

  // backToPreviousPage(String)
  it('backToPreviousPage should return the url of the previous page visited', () => {
    const urlDraw = '/draw/guide';
    const urlHome = '/guide';
    const backToPreviousPageDraw = service.backToPreviousPage(urlDraw);
    const backToPreviousPageHome = service.backToPreviousPage(urlHome);
    expect(backToPreviousPageDraw).toBe('/draw');
    expect(backToPreviousPageHome).toBe('/home');
  });

  it('backToPreviousPage should return the url of the present page', () => {
    const url = '/errorPage';
    const backToPreviousPage = service.backToPreviousPage(url);
    expect(backToPreviousPage).toBe('/guide');
  });

  // previous()
  it('previous should decrement idDescription', () => {
    service.idDescription = 1;
    service.previous();
    expect(service.idDescription).toBe(0);
  });

  // next()
  it('next should increment idDescription', () => {
    service.idDescription = 1;
    service.next();
    expect(service.idDescription).toBe(2);
  });

  // isFirstDescription()
  it('isFirstDescription should return true if the idDecription is WELCOME', () => {
    service.idDescription = MenuId.WELCOME;
    const isFirstDescription = service.isFirstDescription();
    expect(isFirstDescription).toBe(true);
  });

  // isLastDescription()
  it('isLastDescription should return true if the idDecription is MAGNETISM', () => {
    service.idDescription = MenuId.GRID;
    const isLastDescription = service.isLastDescription();
    expect(isLastDescription).toBe(true);
  });

  // getDescriptionParagraphs()
  it('getDescriptionParagraphs should return the paragraphs of the idDescription', () => {
    service.idDescription = MenuId.WELCOME;
    const getDescriptionParagraphs = service.getDescriptionParagraphs();
    const indexWelcome = 1;
    expect(getDescriptionParagraphs).toBe(service.descriptions[indexWelcome].paragraphs);
  });

  it('getDescriptionParagraphs should return a message of error if description is not found', () => {
    service.idDescription = ID_NO_DESCRIPTION;
    const getDescriptionParagraphs = service.getDescriptionParagraphs();
    expect(getDescriptionParagraphs).toEqual(['Pas de description associé à cet élément']);
  });

  // getDescriptionTitle()
  it('getDescriptionTitle should return the title of the idDescription', () => {
    service.idDescription = MenuId.WELCOME;
    const getDescriptionTitle = service.getDescriptionTitle();
    const indexWelcome = 1;
    expect(getDescriptionTitle).toBe(service.descriptions[indexWelcome].title);
  });

  it('getDescriptionTitle should return a message of error if description is not found', () => {
    service.idDescription = ID_NO_DESCRIPTION;
    const getDescriptionTitle = service.getDescriptionTitle();
    expect(getDescriptionTitle).toBe('Pas de titre associé à cet élément');
  });

});
