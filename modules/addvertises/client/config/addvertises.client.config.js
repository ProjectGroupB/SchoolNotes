(function () {
  'use strict';

  angular
    .module('addvertises')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Advertise with Us',
      state: 'addvertises',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'addvertises', {
      title: 'List Addvertises',
      state: 'addvertises.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'addvertises', {
      title: 'Create Addvertise',
      state: 'addvertises.create',
      roles: ['user']
    });
  }
}());
