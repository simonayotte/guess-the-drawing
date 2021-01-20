
import { DrawingSizeService } from './drawing-size.service';

const NEGATIVE_INPUT = -10;
const VALID_INPUT = 12;
describe('DrawingSizeService', () => {
  let service: DrawingSizeService;
  beforeEach(() => {
      service = new DrawingSizeService();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
  it('isValidInput should return true if input is a whole number greater than 0 and assign that value', () => {
    expect(service.isValidInput(VALID_INPUT)).toBe(true);
  });
  it('isValidInput should return false if the input is not a number', () => {
    expect(service.isValidInput(Number('aa123'))).toBe(false);
  });
  it('isValidInput should return false if the input is empty or null', () => {
    expect(service.isValidInput(Number(''))).toBe(false);
    expect(service.isValidInput(Number(null))).toBe(false);
  });
  it('isValiInput should return false if input is equal or less than 0', () => {
    expect(service.isValidInput(0)).toBe(false);
    expect(service.isValidInput(NEGATIVE_INPUT)).toBe(false);
  });
  it('userWantsMaxSize should return true if he wants max size', () => {
    service.setValuesToDefault();
    expect(service.getUserWantsMaxSize()).toBe(true);
  });
  it('if the user has changed the width and height, it means he doesent want the max size for his work space', () => {
    service.setValuesToDefault();
    service.updateHeight(VALID_INPUT);
    expect(service.getUserWantsMaxSize()).toBeFalsy();
    service.setValuesToDefault();
    service.updateWidth(VALID_INPUT);
    expect(service.getUserWantsMaxSize()).toBeFalsy();
  });
  it('new drawing should be true if we send the signal that we created a new drawing and the value of UserWantsMaxSize to not be changed',
  () => {
    service.newDrawing();
    service.updateHeight(VALID_INPUT);
    service.updateWidth(VALID_INPUT);
    expect(service.getUserWantsMaxSize()).toBeTruthy();
  });
  it('value should not change if the input is incorrect', () => {
    expect(service.updateWidth(NEGATIVE_INPUT)).toBeFalsy();
    expect(service.updateHeight(NEGATIVE_INPUT)).toBeFalsy();
  });
});
