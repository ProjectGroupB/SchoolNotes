(function () {
  'use strict';

  describe('Artsubmissions Route Tests', function () {
    // Initialize global variables
    var $scope,
      ArtsubmissionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ArtsubmissionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ArtsubmissionsService = _ArtsubmissionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('artsubmissions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/artsubmissions');
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
          ArtsubmissionsController,
          mockArtsubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('artsubmissions.view');
          $templateCache.put('modules/artsubmissions/client/views/view-artsubmission.client.view.html', '');

          // create mock Artsubmission
          mockArtsubmission = new ArtsubmissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Artsubmission Name'
          });

          // Initialize Controller
          ArtsubmissionsController = $controller('ArtsubmissionsController as vm', {
            $scope: $scope,
            artsubmissionResolve: mockArtsubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:artsubmissionId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.artsubmissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            artsubmissionId: 1
          })).toEqual('/artsubmissions/1');
        }));

        it('should attach an Artsubmission to the controller scope', function () {
          expect($scope.vm.artsubmission._id).toBe(mockArtsubmission._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/artsubmissions/client/views/view-artsubmission.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ArtsubmissionsController,
          mockArtsubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('artsubmissions.create');
          $templateCache.put('modules/artsubmissions/client/views/form-artsubmission.client.view.html', '');

          // create mock Artsubmission
          mockArtsubmission = new ArtsubmissionsService();

          // Initialize Controller
          ArtsubmissionsController = $controller('ArtsubmissionsController as vm', {
            $scope: $scope,
            artsubmissionResolve: mockArtsubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.artsubmissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/artsubmissions/create');
        }));

        it('should attach an Artsubmission to the controller scope', function () {
          expect($scope.vm.artsubmission._id).toBe(mockArtsubmission._id);
          expect($scope.vm.artsubmission._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/artsubmissions/client/views/form-artsubmission.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ArtsubmissionsController,
          mockArtsubmission;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('artsubmissions.edit');
          $templateCache.put('modules/artsubmissions/client/views/form-artsubmission.client.view.html', '');

          // create mock Artsubmission
          mockArtsubmission = new ArtsubmissionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Artsubmission Name'
          });

          // Initialize Controller
          ArtsubmissionsController = $controller('ArtsubmissionsController as vm', {
            $scope: $scope,
            artsubmissionResolve: mockArtsubmission
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:artsubmissionId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.artsubmissionResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            artsubmissionId: 1
          })).toEqual('/artsubmissions/1/edit');
        }));

        it('should attach an Artsubmission to the controller scope', function () {
          expect($scope.vm.artsubmission._id).toBe(mockArtsubmission._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/artsubmissions/client/views/form-artsubmission.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
