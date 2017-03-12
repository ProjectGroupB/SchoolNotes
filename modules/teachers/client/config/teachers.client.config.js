(function () {
  'use strict';

  angular
    .module('teachers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    //menuService.addMenuItem('topbar', {
    //  title: 'Teachers',
    //  state: 'teachers',
    //  type: 'dropdown',
    //  roles: ['*']
    //});

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'teachers', {
      title: 'List Teachers',
      state: 'teachers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'teachers', {
      title: 'Create Teacher',
      state: 'teachers.create',
      roles: ['user']
    });
  }
}());
