'use strict';

describe('Sponsors E2E Tests:', function () {
  describe('Test Sponsors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/sponsors');
      expect(element.all(by.repeater('sponsor in sponsors')).count()).toEqual(0);
    });
  });
});
