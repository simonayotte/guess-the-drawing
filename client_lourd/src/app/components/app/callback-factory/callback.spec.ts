import { Callback } from './callback';

describe('Callback', () => {
  it('call should call the callback', () => {
    const spy = jasmine.createSpy();

    const obj = new Callback(spy);
    obj.call();

    expect(spy).toHaveBeenCalled();
  });
});
