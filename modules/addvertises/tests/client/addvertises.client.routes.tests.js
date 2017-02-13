(function () {
  'use strict';

  describe('Addvertises Route Tests', function () {
    // Initialize global variables
    var $scope,
      AddvertisesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AddvertisesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AddvertisesService = _AddvertisesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('addvertises');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/addvertises');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AddvertisesController,
          mockAddvertise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('addvertises.view');
          $templateCache.put('modules/addvertises/client/views/view-addvertise.client.view.html', '');

          // create mock Addvertise
          mockAddvertise = new AddvertisesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Addvertise Name'
          });

          // Initialize Controller
          AddvertisesController = $controller('AddvertisesController as vm', {
            $scope: $scope,
            addvertiseResolve: mockAddvertise
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:addvertiseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.addvertiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            addvertiseId: 1
          })).toEqual('/addvertises/1');
        }));

        it('should attach an Addvertise to the controller scope', function () {
          expect($scope.vm.addvertise._id).toBe(mockAddvertise._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/addvertises/client/views/view-addvertise.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AddvertisesController,
          mockAddvertise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('addvertises.create');
          $templateCache.put('modules/addvertises/client/views/form-addvertise.client.view.html', '');

          // create mock Addvertise
          mockAddvertise = new AddvertisesService();

          // Initialize Controller
          AddvertisesController = $controller('AddvertisesController as vm', {
            $scope: $scope,
            addvertiseResolve: mockAddvertise
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.addvertiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/addvertises/create');
        }));

        it('should attach an Addvertise to the controller scope', function () {
          expect($scope.vm.addvertise._id).toBe(mockAddvertise._id);
          expect($scope.vm.addvertise._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/addvertises/client/views/form-addvertise.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AddvertisesController,
          mockAddvertise;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('addvertises.edit');
          $templateCache.put('modules/addvertises/client/views/form-addvertise.client.view.html', '');

          // create mock Addvertise
          mockAddvertise = new AddvertisesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Addvertise Name'
          });

          // Initialize Controller
          AddvertisesController = $controller('AddvertisesController as vm', {
            $scope: $scope,
            addvertiseResolve: mockAddvertise
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:addvertiseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.addvertiseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            addvertiseId: 1
          })).toEqual('/addvertises/1/edit');
        }));

        it('should attach an Addvertise to the controller scope', function () {
          expect($scope.vm.addvertise._id).toBe(mockAddvertise._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/addvertises/client/views/form-addvertise.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
