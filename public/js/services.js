angular.module('starter.services', [])
    .service('userService', ['$http', '$q', function($http, $q) {

        this.signIn = function(user) {
            var defer = $q.defer();
            $http.post('/login', user).success(function(response) {
                defer.resolve(response);
            });
            return defer.promise;
        };
    }])
    .service('timeSheetService', ['$http', '$q', function($http, $q) {

        this.getTimeSheet = function(user) {
            var defer = $q.defer();
            $http.get('/js/data.json').success(function(response) {
                defer.resolve(response);
            });
            return defer.promise;
        };
    }])


.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Dia 1',
        lastText: '23/05/2016',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Dia 2',
        lastText: '24/05/2016',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Dia 3',
        lastText: '25/05/2016',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Dia 4',
        lastText: '26/05/2016',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Dia 5',
        lastText: '27/05/2016',
        face: 'img/mike.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
});
