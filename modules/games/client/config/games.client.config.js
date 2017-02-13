(function () {
  'use strict';

  angular
    .module('games')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Games',
      state: 'games',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'games', {
      title: 'List Games',
      state: 'games.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'games', {
      title: 'Create Game',
      state: 'games.create',
      roles: ['user']
    });
  }
}());
