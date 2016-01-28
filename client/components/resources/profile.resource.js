'use strict';

angular.module('impactApp')
  .factory('ProfileResource', function($resource) {
    var Profile = $resource('/api/users/:userId/profiles/:id', {
      id: '@_id'
    });

    Profile.prototype.getTitle = function() {
      if (this.identites && this.identites.beneficiaire) {
        return this.identites.beneficiaire.prenom + ' ' + this.identites.beneficiaire.nom;
      } else {
        return 'Nouveau profil';
      }
    };

    Profile.prototype.saveSection = function(sectionId, sectionModel, user, onSuccess) {
      sectionModel.__completion = true;
      sectionModel.updatedAt = Date.now();

      this[sectionId] = sectionModel;
      this.$save({userId: user._id}, onSuccess);
    };

    return Profile;
  });
