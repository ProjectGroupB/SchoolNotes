'use strict';

describe('Artsubmissions E2E Tests:', function () {
  describe('Test Artsubmissions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/artsubmissions');
      expect(element.all(by.repeater('artsubmission in artsubmissions')).count()).toEqual(0);
    });
  });
});
