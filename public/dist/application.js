'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
  'use strict';

  app.registerModule('activities');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');

(function (app) {
  'use strict';

  app.registerModule('artsubmissions');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('chat');

(function (app) {
  'use strict';

  app.registerModule('contactus');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

(function (app) {
  'use strict';

  app.registerModule('games');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('sponsors');
}(ApplicationConfiguration));

(function (app) {
  'use strict';

  app.registerModule('teachers');
}(ApplicationConfiguration));

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

(function () {
  'use strict';

  angular
    .module('activities')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Activities',
      state: 'activities',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'activities', {
      title: 'List Activities',
      state: 'activities.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'activities', {
      title: 'Create Activity',
      state: 'activities.create',
      roles: ['user']
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('activities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('activities', {
        abstract: true,
        url: '/activities',
        template: '<ui-view/>'
      })
      .state('activities.list', {
        url: '',
        templateUrl: 'modules/activities/client/views/list-activities.client.view.html',
        controller: 'ActivitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Activities List'
        }
      })
      .state('activities.create', {
        url: '/create',
        templateUrl: 'modules/activities/client/views/form-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        resolve: {
          activityResolve: newActivity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Activities Create'
        }
      })
      .state('activities.edit', {
        url: '/:activityId/edit',
        templateUrl: 'modules/activities/client/views/form-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        resolve: {
          activityResolve: getActivity
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Activity {{ activityResolve.name }}'
        }
      })
      .state('activities.view', {
        url: '/:activityId',
        templateUrl: 'modules/activities/client/views/view-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        resolve: {
          activityResolve: getActivity
        },
        data: {
          pageTitle: 'Activity {{ activityResolve.name }}'
        }
      });
  }

  getActivity.$inject = ['$stateParams', 'ActivitiesService'];

  function getActivity($stateParams, ActivitiesService) {
    return ActivitiesService.get({
      activityId: $stateParams.activityId
    }).$promise;
  }

  newActivity.$inject = ['ActivitiesService'];

  function newActivity(ActivitiesService) {
    return new ActivitiesService();
  }
}());

(function () {
  'use strict';

  // Activities controller
  angular
    .module('activities')
    .controller('ActivitiesController', ActivitiesController);

  ActivitiesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'activityResolve'];

  function ActivitiesController ($scope, $state, $window, Authentication, activity) {
    var vm = this;

    vm.authentication = Authentication;
    vm.activity = activity;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Activity
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.activity.$remove($state.go('activities.list'));
      }
    }

    // Save Activity
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.activityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.activity._id) {
        vm.activity.$update(successCallback, errorCallback);
      } else {
        vm.activity.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('activities.view', {
          activityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('activities')
    .controller('ActivitiesListController', ActivitiesListController);

  ActivitiesListController.$inject = ['ActivitiesService'];

  function ActivitiesListController(ActivitiesService) {
    var vm = this;

    vm.activities = ActivitiesService.query();
  }
}());

// Activities service used to communicate Activities REST endpoints
(function () {
  'use strict';

  angular
    .module('activities')
    .factory('ActivitiesService', ActivitiesService);

  ActivitiesService.$inject = ['$resource'];

  function ActivitiesService($resource) {
    return $resource('api/activities/:activityId', {
      activityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Articles',
      state: 'articles.create',
      roles: ['user']
    });

    // Add the dropdown item for admin to review articles
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Review Articles',
      state: 'articles.reviewList',
      roles: ['user', 'admin']
    });

  }
]);

'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html'
      })
      // added to allow review of a asubmitted article
      .state('articles.reviewList', {
        url: '',
        templateUrl: 'modules/articles/client/views/reviewList-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/create-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html'
      })
      
      // added to allow review of a asubmitted article
      .state('articles.review', {
        url: '/:articleId/review',
        templateUrl: 'modules/articles/client/views/review-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })

      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/edit-article.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // approve submitted article
    $scope.approve = function (article) {
      console.log('approving article');

      if (article) {
        article.status = 'Approved';
        article.$update();
      }
      else {
        $scope.article.status = 'Approved';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };
    // reject submitted article
    $scope.reject = function (article) {
      console.log('rejecting article');

      if (article) {
        article.status = 'Rejected';
        article.$update();
      }
      else {
        $scope.article.status = 'Rejected';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };
    // send alert that submitted article needs revision
    $scope.alert = function (article) {
      console.log('alerting author article needs revision');

      if (article) {
        article.status = 'Waiting for Revision';
        article.$update();
      }
      else {
        $scope.article.status = 'Waiting for Revision';
        $scope.article.$update(function () {
          $location.path('articles/' + $scope.article._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find a list of Articles
    $scope.findForReview = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);

'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Art Contest',
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

(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('artsubmissions', {
        abstract: true,
        url: '/artsubmissions',
        template: '<ui-view/>'
      })
      .state('artsubmissions.list', {
        url: '',
        templateUrl: 'modules/artsubmissions/client/views/list-artsubmissions.client.view.html',
        controller: 'ArtsubmissionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Artsubmissions List'
        }
      })
      .state('artsubmissions.create', {
        url: '/create',
        templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: newArtsubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Artsubmissions Create'
        }
      })
      .state('artsubmissions.edit', {
        url: '/:artsubmissionId/edit',
        templateUrl: 'modules/artsubmissions/client/views/form-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: getArtsubmission
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Artsubmission {{ artsubmissionResolve.name }}'
        }
      })
      .state('artsubmissions.view', {
        url: '/:artsubmissionId',
        templateUrl: 'modules/artsubmissions/client/views/view-artsubmission.client.view.html',
        controller: 'ArtsubmissionsController',
        controllerAs: 'vm',
        resolve: {
          artsubmissionResolve: getArtsubmission
        },
        data: {
          pageTitle: 'Artsubmission {{ artsubmissionResolve.name }}'
        }
      });
  }

  getArtsubmission.$inject = ['$stateParams', 'ArtsubmissionsService'];

  function getArtsubmission($stateParams, ArtsubmissionsService) {
    return ArtsubmissionsService.get({
      artsubmissionId: $stateParams.artsubmissionId
    }).$promise;
  }

  newArtsubmission.$inject = ['ArtsubmissionsService'];

  function newArtsubmission(ArtsubmissionsService) {
    return new ArtsubmissionsService();
  }
}());

(function () {
  'use strict';

  // Artsubmissions controller
  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsController', ArtsubmissionsController);

  ArtsubmissionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'artsubmissionResolve'];

  function ArtsubmissionsController ($scope, $state, $window, Authentication, artsubmission) {
    var vm = this;

    vm.authentication = Authentication;
    vm.artsubmission = artsubmission;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Artsubmission
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.artsubmission.$remove($state.go('artsubmissions.list'));
      }
    }

    // Save Artsubmission
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.artsubmissionForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.artsubmission._id) {
        vm.artsubmission.$update(successCallback, errorCallback);
      } else {
        vm.artsubmission.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('artsubmissions.view', {
          artsubmissionId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .controller('ArtsubmissionsListController', ArtsubmissionsListController);

  ArtsubmissionsListController.$inject = ['ArtsubmissionsService'];

  function ArtsubmissionsListController(ArtsubmissionsService) {
    var vm = this;

    vm.artsubmissions = ArtsubmissionsService.query();
  }
}());

// Artsubmissions service used to communicate Artsubmissions REST endpoints
(function () {
  'use strict';

  angular
    .module('artsubmissions')
    .factory('ArtsubmissionsService', ArtsubmissionsService);

  ArtsubmissionsService.$inject = ['$resource'];

  function ArtsubmissionsService($resource) {
    return $resource('api/artsubmissions/:artsubmissionId', {
      artsubmissionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

// Configuring the Chat module
angular.module('chat').run(['Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Chat',
      state: 'chat'
    });
  }
]);

'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat',
        templateUrl: 'modules/chat/client/views/chat.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Create the 'chat' controller
angular.module('chat').controller('ChatController', ['$scope', '$location', 'Authentication', 'Socket',
  function ($scope, $location, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'chatMessage' event
    Socket.on('chatMessage', function (message) {
      $scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $scope.sendMessage = function () {
      // Create a new message object
      var message = {
        text: this.messageText
      };

      // Emit a 'chatMessage' message event
      Socket.emit('chatMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function () {
      Socket.removeListener('chatMessage');
    });
  }
]);

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

(function () {
  'use strict';

  angular
    .module('contactus')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('contactus', {
        abstract: true,
        url: '/contactus',
        template: '<ui-view/>'
      })
      .state('contactus.list', {
        url: '',
        templateUrl: 'modules/contactus/client/views/list-contactus.client.view.html',
        controller: 'ContactusListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Contactus List'
        }
      })
      .state('contactus.create', {
        url: '/create',
        templateUrl: 'modules/contactus/client/views/form-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: newContactu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Contactus Create'
        }
      })
      .state('contactus.edit', {
        url: '/:contactuId/edit',
        templateUrl: 'modules/contactus/client/views/form-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: getContactu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Contactu {{ contactuResolve.name }}'
        }
      })
      .state('contactus.view', {
        url: '/:contactuId',
        templateUrl: 'modules/contactus/client/views/view-contactu.client.view.html',
        controller: 'ContactusController',
        controllerAs: 'vm',
        resolve: {
          contactuResolve: getContactu
        },
        data: {
          pageTitle: 'Contactu {{ contactuResolve.name }}'
        }
      });
  }

  getContactu.$inject = ['$stateParams', 'ContactusService'];

  function getContactu($stateParams, ContactusService) {
    return ContactusService.get({
      contactuId: $stateParams.contactuId
    }).$promise;
  }

  newContactu.$inject = ['ContactusService'];

  function newContactu(ContactusService) {
    return new ContactusService();
  }
}());

(function () {
  'use strict';

  // Contactus controller
  angular
    .module('contactus')
    .controller('ContactusController', ContactusController);

  ContactusController.$inject = ['$scope', '$state', '$window', 'Authentication', 'contactuResolve'];

  function ContactusController ($scope, $state, $window, Authentication, contactu) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contactu = contactu;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contactu
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contactu.$remove($state.go('contactus.list'));
      }
    }

    // Save Contactu
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactuForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contactu._id) {
        vm.contactu.$update(successCallback, errorCallback);
      } else {
        vm.contactu.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contactus.view', {
          contactuId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

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

// Contactus service used to communicate Contactus REST endpoints
(function () {
  'use strict';

  angular
    .module('contactus')
    .factory('ContactusService', ContactusService);

  ContactusService.$inject = ['$resource'];

  function ContactusService($resource) {
    return $resource('api/contactus/:contactuId', {
      contactuId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector',
  function ($q, $injector) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

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

(function () {
  'use strict';

  angular
    .module('games')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('games', {
        abstract: true,
        url: '/games',
        template: '<ui-view/>'
      })
      .state('games.list', {
        url: '',
        templateUrl: 'modules/games/client/views/list-games.client.view.html',
        controller: 'GamesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Games List'
        }
      })
      .state('games.create', {
        url: '/create',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: newGame
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Games Create'
        }
      })
      .state('games.edit', {
        url: '/:gameId/edit',
        templateUrl: 'modules/games/client/views/form-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Game {{ gameResolve.name }}'
        }
      })
      .state('games.view', {
        url: '/:gameId',
        templateUrl: 'modules/games/client/views/view-game.client.view.html',
        controller: 'GamesController',
        controllerAs: 'vm',
        resolve: {
          gameResolve: getGame
        },
        data: {
          pageTitle: 'Game {{ gameResolve.name }}'
        }
      });
  }

  getGame.$inject = ['$stateParams', 'GamesService'];

  function getGame($stateParams, GamesService) {
    return GamesService.get({
      gameId: $stateParams.gameId
    }).$promise;
  }

  newGame.$inject = ['GamesService'];

  function newGame(GamesService) {
    return new GamesService();
  }
}());

(function () {
  'use strict';

  var canvas;
  var tile;
  var selectionOne = {
    selected: false,
    xCoord: 0,
    yCoord: 0,
    letter: 'A'
  };
  var selectionTwo = {
    selected: false,
    xCoord: 0,
    yCoord: 0,
    letter: 'A'
  };
  var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var gameboard = new Array(15);
  for (var i =0; i < 15; i++) {
    gameboard[i] = new Array(15);
    for (var j = 0; j < 15; j++){
      var rando = Math.random() * 26;
      var gamePiece = { letter:letters[Math.floor(rando)], xCoord:0, yCoord:0, isSelected:false };
      gameboard[i][j] = gamePiece;
    }
  }
  var answers = ['bacon','steak','cheese','ribs','ham','chicken','salad','potato','mushroom','pepperoni','sausage','bbq','bread','lettuce','carrot','beans','food'];

  // Games controller
  angular
    .module('games')
    .controller('GamesController', GamesController);

  GamesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gameResolve'];

  function GamesController ($scope, $state, $window, Authentication, game) {
    var vm = this;

    vm.authentication = Authentication;
    vm.game = game;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    init(); // initialize the game board
    // Remove existing Game
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.game.$remove($state.go('games.list'));
      }
    }

    // Save Game
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gameForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.game._id) {
        vm.game.$update(successCallback, errorCallback);
      } else {
        vm.game.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('games.view', {
          gameId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.clicked = function(event){
      var address = detectClickAddress(event.offsetX, event.offsetY);
      var i = address.iAddress;
      var j = address.jAddress;
      if (selectionOne.found){
        if (address.found){
          if ((selectionOne.xCoord === i && selectionOne.yCoord === j) || (selectionTwo.found && selectionTwo.xCoord === i && selectionTwo.yCoord === j)){
            selectionOne.found = false;
            selectionTwo.found = false;
          } else {
            var compatible = detectCompatibleSelection(address);
            if (compatible){
              selectionTwo.xCoord = i;
              selectionTwo.yCoord = j;
              selectionTwo.letter = address.letter;
              selectionTwo.found = true;
            }
                      // Test if the address found is compatible with selectionOne. In other words, is it on the same x OR y OR is it diagonal. Apply selectionTwo if so
                      // maybe I should found = false on selection one if incompatible thing?
          }
        }
      } else {
        if (address.found){
          selectionOne.xCoord = i;
          selectionOne.yCoord = j;
          selectionOne.letter = address.letter;
          selectionOne.found = true;
        }
      }


          //console.log("mx offset = " + event.offsetX + "   my offset = " + event.offsetY);
      draw();
          //init();
    };
  }

  function init() {
    canvas = document.getElementById('gameCanvas');
    tile = canvas.getContext('2d');
    draw();
  }

  function draw(){
    tile.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawAnswers();
    drawSelection();
  }

  function drawSelection(){

    if (selectionOne.found){
      tile.beginPath();
      tile.arc(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = '#FF0000';
      tile.stroke();
      tile.closePath();
    }

    if (selectionTwo.found){
      tile.beginPath();
      tile.arc(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32, 12, 0, Math.PI*2, false);
      tile.strokeStyle = '#FF0000';
      tile.stroke();
      tile.closePath();

      tile.beginPath();
      tile.strokeStyle = '#FFFF00';

      tile.moveTo(25 + selectionOne.xCoord * 32, 17 + selectionOne.yCoord * 32);
      tile.lineTo(25 + selectionTwo.xCoord * 32, 17 + selectionTwo.yCoord * 32);
      tile.stroke();
      tile.closePath();
    }
  }

  function drawBoard(){
    for (var i = 0; i < gameboard.length; i++){
      for (var j = 0; j < gameboard.length; j++){
        var xCoord = 15 + i * 32;
        var yCoord = 25 + j * 32;
        gameboard[i][j].xCoord = xCoord;
        gameboard[i][j].yCoord = yCoord;
        tile.beginPath();
        tile.fillStyle = '#000000';
        tile.font = '24px serif';
        tile.fillText(gameboard[i][j].letter, xCoord, yCoord);
        tile.closePath();
      }
    }
  }

  function drawAnswers(){
    tile.beginPath();
    if (answers.length >= 6) {
      for (var i = 0; i < 6; i++) {
        tile.fillStyle = '#000000';
        tile.font = '24px serif';
        tile.fillText(answers[i], 25, 524 + i * 28);
      }
    } else if (answers >= 12) {

    } else {

    }

    for (var j = 0; j < answers.length; j++) {
      tile.fillStyle = '#000000';
      tile.font = '24px serif';
      if (j < 6) {
        tile.fillText(answers[j], 25, 524 + j * 28);
      } else if (j < 12) {
        tile.fillText(answers[j], 205, 524 + ((j - 6) * 28));
      } else {
        tile.fillText(answers[j], 375, 524 + ((j - 12) * 28));
      }
    }
    tile.closePath();
  }

  function detectCompatibleSelection(secondSel){
    var compatible = false;
    var i = secondSel.iAddress;
    var j = secondSel.jAddress;
    if (i === selectionOne.xCoord || j === selectionOne.yCoord){
      compatible = true;
    }
    var xtest = Math.abs(i - selectionOne.xCoord);
    var ytest = Math.abs(j - selectionOne.yCoord);
    if (xtest === ytest){
      compatible = true;
    }
    return compatible;
  }

  function detectClickAddress(xClick, yClick){
        //console.log("clicked");
    var address = { found:false, xCoord:0, yCoord:0, iAddress: 0, jAddress: 0 };
    for (var i = 0; i < gameboard.length; i++) {
      for (var j = 0; j < gameboard.length; j++) {
        var xCoord = gameboard[i][j].xCoord;
        var yCoord = gameboard[i][j].yCoord;
        var newx = Math.abs(xCoord - xClick + 8);
        var newy = Math.abs(yCoord - yClick - 8);
        var distance = Math.sqrt(newx * newx + newy * newy);
                //console.log("Distance = " + distance);
        if (distance <= 12){
          address.found = true;
          address.xCoord = xCoord;
          address.yCoord = yCoord;
          address.iAddress = i;
          address.jAddress = j;
        }

      }
    }
    return address;
  }

    //console.log("loading");
    //window.onload = init; // initilize the canvas and tile variables after the page loads.
}());

(function () {
  'use strict';

  angular
    .module('games')
    .controller('GamesListController', GamesListController);

  GamesListController.$inject = ['GamesService'];

  function GamesListController(GamesService) {
    var vm = this;

    vm.games = GamesService.query();
  }
}());

// Games service used to communicate Games REST endpoints
(function () {
  'use strict';

  angular
    .module('games')
    .factory('GamesService', GamesService);

  GamesService.$inject = ['$resource'];

  function GamesService($resource) {
    return $resource('api/games/:gameId', {
      gameId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('sponsors')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Sponsors',
      state: 'sponsors',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'sponsors', {
      title: 'Our Sponsors',
      state: 'sponsors.list'
    });

    menuService.addSubMenuItem('topbar', 'sponsors', {
      title: 'Become a Sponsor',
      state: 'sponsors.create'
    });

    menuService.addSubMenuItem('topbar', 'sponsors', {
      title: 'Manage Site Advertisements',
      state: 'sponsors.edit',
      roles: ('admin')
    });

    //// Add the dropdown create item
    //menuService.addSubMenuItem('topbar', 'sponsors', {
    //  title: 'Create Sponsor',
    //  state: 'sponsors.create',
    //  roles: ['user']
    //});
  }
}());

(function () {
  'use strict';

  angular
    .module('sponsors')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('sponsors', {
        abstract: true,
        url: '/sponsors',
        template: '<ui-view/>'
      })
      .state('sponsors.list', {
        url: '',
        templateUrl: 'modules/sponsors/client/views/list-sponsors.client.view.html',
        controller: 'SponsorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Sponsors List'
        }
      })
      .state('sponsors.create', {
        url: '/create',
        templateUrl: 'modules/sponsors/client/views/form-sponsor.client.view.html',
        controller: 'SponsorsController',
        controllerAs: 'vm',
        resolve: {
          sponsorResolve: newSponsor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Sponsors Create'
        }
      })
      .state('sponsors.edit', {
        url: '/:sponsorId/edit',
        templateUrl: 'modules/sponsors/client/views/form-sponsor.client.view.html',
        controller: 'SponsorsController',
        controllerAs: 'vm',
        resolve: {
          sponsorResolve: getSponsor
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Sponsor {{ sponsorResolve.name }}'
        }
      })
      .state('sponsors.view', {
        url: '/:sponsorId',
        templateUrl: 'modules/sponsors/client/views/view-sponsor.client.view.html',
        controller: 'SponsorsController',
        controllerAs: 'vm',
        resolve: {
          sponsorResolve: getSponsor
        },
        data: {
          pageTitle: 'Sponsor {{ sponsorResolve.name }}'
        }
      });
  }

  getSponsor.$inject = ['$stateParams', 'SponsorsService'];

  function getSponsor($stateParams, SponsorsService) {
    return SponsorsService.get({
      sponsorId: $stateParams.sponsorId
    }).$promise;
  }

  newSponsor.$inject = ['SponsorsService'];

  function newSponsor(SponsorsService) {
    return new SponsorsService();
  }
}());

(function () {
  'use strict';

  angular
    .module('sponsors')
    .controller('SponsorsListController', SponsorsListController);

  SponsorsListController.$inject = ['SponsorsService'];

  function SponsorsListController(SponsorsService) {
    var vm = this;

    vm.sponsors = SponsorsService.query();
  }
}());

(function () {
  'use strict';

  // Sponsors controller
  angular
    .module('sponsors')
    .controller('SponsorsController', SponsorsController);

  SponsorsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'sponsorResolve'];

  function SponsorsController ($scope, $state, $window, Authentication, sponsor) {
    var vm = this;

    vm.authentication = Authentication;
    vm.sponsor = sponsor;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Sponsor
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.sponsor.$remove($state.go('sponsors.list'));
      }
    }

    // Save Sponsor
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.sponsorForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.sponsor._id) {
        vm.sponsor.$update(successCallback, errorCallback);
      } else {
        vm.sponsor.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('sponsors.view', {
          sponsorId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }

    }

    document.getElementById('uploadBtn').onchange = function () {
      document.getElementById('uploadFile').value = this.value;
    };
  }
}());

// Sponsors service used to communicate Sponsors REST endpoints
(function () {
  'use strict';

  angular
    .module('sponsors')
    .factory('SponsorsService', SponsorsService);

  SponsorsService.$inject = ['$resource'];

  function SponsorsService($resource) {
    return $resource('api/sponsors/:sponsorId', {
      sponsorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

(function () {
  'use strict';

  angular
    .module('teachers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Teachers',
      state: 'teachers',
      type: 'dropdown',
      roles: ['*']
    });

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

(function () {
  'use strict';

  angular
    .module('teachers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('teachers', {
        abstract: true,
        url: '/teachers',
        template: '<ui-view/>'
      })
      .state('teachers.list', {
        url: '',
        templateUrl: 'modules/teachers/client/views/list-teachers.client.view.html',
        controller: 'TeachersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Teachers List'
        }
      })
      .state('teachers.create', {
        url: '/create',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: newTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Teachers Create'
        }
      })
      .state('teachers.edit', {
        url: '/:teacherId/edit',
        templateUrl: 'modules/teachers/client/views/form-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Teacher {{ teacherResolve.name }}'
        }
      })
      .state('teachers.view', {
        url: '/:teacherId',
        templateUrl: 'modules/teachers/client/views/view-teacher.client.view.html',
        controller: 'TeachersController',
        controllerAs: 'vm',
        resolve: {
          teacherResolve: getTeacher
        },
        data: {
          pageTitle: 'Teacher {{ teacherResolve.name }}'
        }
      });
  }

  getTeacher.$inject = ['$stateParams', 'TeachersService'];

  function getTeacher($stateParams, TeachersService) {
    return TeachersService.get({
      teacherId: $stateParams.teacherId
    }).$promise;
  }

  newTeacher.$inject = ['TeachersService'];

  function newTeacher(TeachersService) {
    return new TeachersService();
  }
}());

(function () {
  'use strict';

  angular
    .module('teachers')
    .controller('TeachersListController', TeachersListController);

  TeachersListController.$inject = ['TeachersService'];

  function TeachersListController(TeachersService) {
    var vm = this;

    vm.teachers = TeachersService.query();
  }
}());

(function () {
  'use strict';

  // Teachers controller
  angular
    .module('teachers')
    .controller('TeachersController', TeachersController);

  TeachersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'teacherResolve'];

  function TeachersController ($scope, $state, $window, Authentication, teacher) {
    var vm = this;

    vm.authentication = Authentication;
    vm.teacher = teacher;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Teacher
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.teacher.$remove($state.go('teachers.list'));
      }
    }

    // Save Teacher
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.teacherForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.teacher._id) {
        vm.teacher.$update(successCallback, errorCallback);
      } else {
        vm.teacher.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('teachers.view', {
          teacherId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

// Teachers service used to communicate Teachers REST endpoints
(function () {
  'use strict';

  angular
    .module('teachers')
    .factory('TeachersService', TeachersService);

  TeachersService.$inject = ['$resource'];

  function TeachersService($resource) {
    return $resource('api/teachers/:teacherId', {
      teacherId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      });
  }
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
              case 401:
                // Deauthenticate the global user
                Authentication.user = null;

                // Redirect to signin page
                $location.path('signin');
                break;
              case 403:
                // Add unauthorized behaviour
                break;
            }

            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html'
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html'
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html'
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html'
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html'
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    //If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }

      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with greater than 10 characters, numbers, lowercase, upppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
