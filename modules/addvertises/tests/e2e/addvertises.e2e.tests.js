'use strict';

describe('Addvertises E2E Tests:', function () {
  describe('Test Addvertises page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/addvertises');
      expect(element.all(by.repeater('addvertise in addvertises')).count()).toEqual(0);
    });
  });
});
