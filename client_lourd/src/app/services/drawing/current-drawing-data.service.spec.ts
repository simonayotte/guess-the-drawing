
import { CurrentDrawingDataService } from './current-drawing-data.service';
describe('CurrentDrawingDataService', () => {
  let service: CurrentDrawingDataService;
  const path: SVGPathElement = {} as SVGPathElement;
  beforeEach(() => {
      service = new CurrentDrawingDataService();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('stack should not be empty when we add path to it', () => {
    service.addPathToDrawing(path);
    expect(service.drawingIsEmpty()).toBeFalsy();
  });
  it('stack should be empty when we clear it', () => {
    service.addPathToDrawing(path);
    service.clearStack();
    expect(service.drawingIsEmpty()).toBeTruthy();
  });
});
