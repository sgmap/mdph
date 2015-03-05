'use strict';


angular.module('impactApp')
  .controller('SectionCtrl', function($scope, $state, $timeout, $window, request, section, sectionModel) {
    $scope.section = section;
    $scope.sectionModel = sectionModel;

    $scope.saveLastSref = function(sref) {
      sectionModel.__lastSref = sref;
    };
  })
  .controller('FormSectionCtrl', function($scope, $state, $timeout, $window, request, section, sectionModel, saveSection) {
    $scope.section = section;
    $scope.sectionModel = sectionModel;

    $scope.saveLastSref = function(sref) {
      sectionModel.__lastSref = sref;
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.submit = function(form) {
      if (form.$invalid) {
        form.showError = true;
      } else {
        saveSection();
      }
    };
  });
