(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Artsubmissions',
      state: 'artsubmissions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'artsubmissions', {
      title: 'List Artsubmissions',
      state: 'artsubmissions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'artsubmissions', {
      title: 'Create Artsubmission',
      state: 'artsubmissions.create',
      roles: ['user']
    });
  }
}());
