(function () {
  'use strict';

  angular
    .module('sponsors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sponsors',
      state: 'sponsors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sponsors', {
      title: 'List Sponsors',
      state: 'sponsors.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'sponsors', {
      title: 'Create Sponsor',
      state: 'sponsors.create',
      roles: ['user']
    });
  }
}());
