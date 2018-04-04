'use strict';

angular.module('impactApp')
  .config(function($stateProvider) {
    var index = 'demande.vie_au_travail';
    $stateProvider
      .state(index, {
        url: '/vie_au_travail',
        templateUrl: 'app/demande/demande.section.html',
        controller: 'DemandeSectionCtrl',
        redirectTo: index + '.situation_professionnelle.condition',
        authenticate: true,
        authorized: ['user'],
        resolve: {
          sectionId: function() {
            return 'vie_au_travail';
          },

          section: function(sections, sectionId) {
            return _.find(sections, {id: sectionId});
          },

          sectionModel: function() {
            return {};
          },

          previousModel: function(demande, sectionId) {
            return _.cloneDeep(demande.data[sectionId]);
          },

          saveSection: function($state, RequestResource, currentUser, demande, sectionId, sectionModel) {
            return function() {
              sectionModel.__completion = true;
              sectionModel.updatedAt = Date.now();
              demande.data[sectionId] = sectionModel;
              RequestResource.update(demande).$promise.then(function(){
                $state.go('demande', {shortId: demande.shortId}, {reload: true});
              });
            };
          }
        },
        data: {
          history: []
        }
      });
  });
