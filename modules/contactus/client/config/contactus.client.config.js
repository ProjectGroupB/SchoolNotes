(function () {
  'use strict';

  angular
    .module('contactus')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Contact',
      state: 'contactus',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'contactus', {
      title: 'List Contactus',
      state: 'contactus.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'contactus', {
      title: 'Create Contactu',
      state: 'contactus.create',
      roles: ['user']
    });
  }
}());
