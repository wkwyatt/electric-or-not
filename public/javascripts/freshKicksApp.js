var kicksApp = angular.module('freshKicks', []);

kicksApp.controller('standingsCntrl', standingsCntrl);

function standingsCntrl($scope, $http) {
	// $http.get('/standings/shoes').success(function(data, status) {
		// $scope.localDopeArray = data.dopeArray;
		// $scope.localTrashArray = data.trashArray;
	// });
	
	// $scope.dopeShoes = dopeArray;
	// $scope.trashShoes = trashArray;
}