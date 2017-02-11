(function () {
  'use strict';

  angular
    .module('events')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Events',
      state: 'events',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'events', {
      title: 'List Events',
      state: 'events.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'events', {
      title: 'Create Event',
      state: 'events.create',
      roles: ['user']
    });
  }
}());
