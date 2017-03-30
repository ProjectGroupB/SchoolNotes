(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Art Contest',
      state: 'artsubmissions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'artsubmissions', {
      title: 'List Art Submissions',
      state: 'artsubmissions.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'artsubmissions', {
      title: 'Create Art Submission',
      state: 'artsubmissions.create'
    });

  }
}());
