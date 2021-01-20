import { TestBed } from '@angular/core/testing';

import { Color } from 'src/app/components/app/tools/color-picker/color';
import { SvgStringManipulationService } from './svg-string-manipulation.service';

const A_SVG_STRING = '<svg xmlns="http://www.w3.org/2000/svg" _ngcontent-cwr-c11="" height="890"' +
'stroke-width="0px" style="background-color:rgba(122, 36, 33, 1)" width="800">' +
'<path _ngcontent-cwr-c10="" stroke-width="25" stroke="rgba(46, 49, 49, 1)" fill="none" stroke-linecap="round"' +
' stroke-linejoin="round" d="M 364 213 L 364 213 L 500 395 "/></svg>';
const A_SVG_STRING_WITHOUT_SVG_TAGS = '<path _ngcontent-cwr-c10="" stroke-width="25" stroke="rgba(46, 49, 49, 1)" ' +
'fill="none" stroke-linecap="round" stroke-linejoin="round" d="M 364 213 L 364 213 L 500 395 "/>';
const R_VALUE = 122;
const G_VALUE = 36;
const B_VALUE = 33;
const A_COLOR = new Color(R_VALUE, G_VALUE, B_VALUE, 1);
const RETURN_HEIGHT = 890;
const RETURN_WIDTH = 800;

describe('SvgStringManipulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [SvgStringManipulationService]})
  );

  it('should be created', () => {
    const service: SvgStringManipulationService = TestBed.get(SvgStringManipulationService);
    expect(service).toBeTruthy();
  });

  // deleteSvgHtmlTag
  it('deleteSvgHtmlTag should return string without svg tags', () => {
    const returnString = SvgStringManipulationService.deleteSvgHtmlTag(A_SVG_STRING);

    expect(returnString).toContain(A_SVG_STRING_WITHOUT_SVG_TAGS);
  });

  // getHeight
  it('getHeight should return the width', () => {
    const returnString = SvgStringManipulationService.getHeight(A_SVG_STRING);

    expect(returnString).toBe(RETURN_HEIGHT);
  });

  // getWidth
  it('getWidth should return the width', () => {
    const returnString = SvgStringManipulationService.getWidth(A_SVG_STRING);

    expect(returnString).toBe(RETURN_WIDTH);
  });

  // getBackGroundColor
  it('getBackGroundColor should return the color from the string', () => {
    const returnColor = SvgStringManipulationService.getBackGroundColor(A_SVG_STRING);

    expect(returnColor.getR()).toEqual(A_COLOR.getR());
    expect(returnColor.getG()).toEqual(A_COLOR.getG());
    expect(returnColor.getB()).toEqual(A_COLOR.getB());
    expect(returnColor.getA()).toEqual(A_COLOR.getA());
  });

});
