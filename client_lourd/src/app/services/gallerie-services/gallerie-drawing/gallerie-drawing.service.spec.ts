import { TestBed } from '@angular/core/testing';

import { GallerieDrawingService } from './gallerie-drawing.service';

describe('GallerieDrawingService', () => {
  let service: GallerieDrawingService;
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GallerieDrawingService]});
    service = TestBed.get(GallerieDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call next fonction', () => {
    const A_STRING = 'a string';

    spyOn(service.svgStringBS, 'next');

    service.setValuesWithSvgString(A_STRING);

    expect(service.svgStringBS.next).toHaveBeenCalled();
  });

});
