(function () {
  'use strict';

  angular
    .module('contactus')
    .controller('ContactusListController', ContactusListController);

  ContactusListController.$inject = ['ContactusService'];

  function ContactusListController(ContactusService) {
    var vm = this;

    vm.contactus = ContactusService.query();
  }
}());
