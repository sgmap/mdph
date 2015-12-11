'use strict';

angular.module('impactApp')
  .controller('DocumentsComplementairesCtrl', function($scope, $modal, $state, UploadService, request, documentTypes) {
    $scope.request = request;
    $scope.documentTypes = documentTypes;

    $scope.filesVM = _.groupBy(request.documents, 'type');

    $scope.upload = function(file, documentFile) {
      UploadService.upload(request, $scope.filesVM, file, documentFile);
    };

    $scope.chooseType = function() {
      var modalInstance = $modal.open({
        templateUrl: 'app/demande/steps/documents/modal_type.html',
        controller: 'ChooseTypeModalInstanceCtrl',
        resolve: {
          categories: function() {
            var filtered = _.filter(documentTypes, function(type) {
              return typeof _.find($scope.documentTypes, {id: type.id}) === 'undefined';
            });

            // TODO: filter by categories
            var categories = _.groupBy(filtered, 'category');
            return categories;
          }
        }
      });

      modalInstance.result.then(function(selected) {
        $scope.documentTypes.push(selected);
      });
    };
  })
  .controller('ChooseTypeModalInstanceCtrl', function($scope, $modalInstance, $filter, categories) {
    $scope.categories = categories;

    $scope.filterCategories = function() {
      if (!$scope.query) {
        return $scope.categories;
      }

      var filtered = {};
      angular.forEach($scope.categories, function(documents, category) {
        if ($filter('filter')(documents, $scope.query).length > 0) {
          filtered[category] = documents;
        }
      });

      return filtered;
    };

    $scope.select = function(selected) {
      $modalInstance.close(selected);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
