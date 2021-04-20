import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { SvgManager } from 'src/app/components/app/tools/graphics/svg-manager';
import { SaveDrawingService } from './save-drawing.service';

const VALID_NAME = 'validName';
const NAME_WITH_SPACE = 'name with space';
const NAME_TOO_SHORT = 'n';
const NAME_TOO_LONG = 'looooooooooooooooooooooooooooooooooooooooooooooooooooooongName';
const NAME_WITH_SPECIAL_CHARACHTER = '!"/$%?&*()';
const IMAGE_METADATA = 'imageMetadata';

describe('Service: SaveDrawing', () => {
  let injector: TestBed;
  let service: SaveDrawingService;
  const mockSvg: SVGElement = {} as SVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    injector = getTestBed();
    service = injector.get(SaveDrawingService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // saveDrawing()
  it('saveDrawing should be true if nameIs valid', () => {
    spyOn(SvgManager, 'getB64').and.returnValue('svg string');
    service[IMAGE_METADATA] = {name: '', tags: [''], imageData: ''};
    service.saveDrawing(VALID_NAME, ['0', '1'], mockSvg);
    expect(service[IMAGE_METADATA]).toEqual({name: VALID_NAME, tags: ['0', '1'], imageData: 'svg string'});
  });

  // nameIsValid()
  it('nameIsValid should be true if nameIs valid', () => {
    const returnedValue = service.nameIsValid(VALID_NAME);
    expect(returnedValue).toBe(true);
  });

  // nameIsValid()
  it('nameIsValid should be false if name is too short', () => {
    const returnedValue = service.nameIsValid(NAME_TOO_SHORT);
    expect(returnedValue).toBe(false);
  });

  // nameIsValid()
  it('nameIsValid should be false if name is too long', () => {
    const returnedValue = service.nameIsValid(NAME_TOO_LONG);
    expect(returnedValue).toBe(false);
  });

  // nameIsValid()
  it('nameIsValid should be false if name has space', () => {
    const returnedValue = service.nameIsValid(NAME_WITH_SPACE);
    expect(returnedValue).toBe(false);
  });

   // nameIsValid()
  it('nameIsValid should be false if name has space', () => {
    const returnedValue = service.nameIsValid(NAME_WITH_SPECIAL_CHARACHTER);
    expect(returnedValue).toBe(false);
  });
});
