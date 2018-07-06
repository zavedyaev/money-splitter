var moneySplitterConfig = function ($routeProvider) {

    $routeProvider
        .when('/', {
            controller: 'MoneySplitterController',
            templateUrl: 'view/table.html'
        })
        .when('/:data', {
            controller: 'MoneySplitterController',
            templateUrl: 'view/table.html'
        });
};

var MoneySplitter = angular.module('MoneySplitter', ['ngRoute']).config(moneySplitterConfig);
