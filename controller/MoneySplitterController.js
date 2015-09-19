MoneySplitter.controller('MoneySplitterController',
  function($scope, $location, $routeParams) {

    //settings
    $scope.checkedByDefault = true;
    $scope.decimalsNumber = 2;

    $scope.users = [
      {
        name: "Vasya"
      }, 
      {
        name: "Sasha"
      }];

    $scope.spendings = [
      {
        spent: 100,
        users: [
          {user: $scope.users[0], checked: true}, 
          {user: $scope.users[1], checked: true}, 
        ]
      },
      {
        spent: 150,
        users: [
          {user: $scope.users[0], checked: false}, 
          {user: $scope.users[1], checked: true}, 
        ]
      }
    ]

    function round(toRound) {
      var result;
      var multiplier = Math.pow(10, $scope.decimalsNumber);
      result = Math.round(toRound * multiplier) / multiplier;
      return result;
    }

    $scope.addUser = function() {
      var newUser = {
        name: "new user"
      };
      $scope.users.push(newUser);

      for(var i = 0; i < $scope.spendings.length; i++){
          var spending = $scope.spendings[i];
          spending.users.push({user: newUser, checked: false});
      }
    };

    $scope.removeUser = function(user) {
      var index = $scope.users.indexOf(user);
      $scope.users.splice(index, 1);

      for(var i = 0; i < $scope.spendings.length; i++){
          var spending = $scope.spendings[i];
          spending.users.splice(index, 1);
      }
    };

    $scope.addSpending = function() {
      var usersArray = [];
      for(var i = 0; i < $scope.users.length; i++){
          var userToInsert = $scope.users[i];
          usersArray.push({user: userToInsert, checked: $scope.checkedByDefault});
      }
      var newSpending = {
        spent: 100,
        users: usersArray
      };
      $scope.spendings.push(newSpending);
    };

    $scope.removeSpending = function(spending) {
      var index = $scope.spendings.indexOf(spending);
      $scope.spendings.splice(index, 1);
    }

    $scope.getSpentTotal = function(){
      var total = 0;
      for(var i = 0; i < $scope.spendings.length; i++){
          var spending = $scope.spendings[i];
          total += spending.spent;
      }
      return round(total);
    }

    $scope.isCheckedSpending = function(spending) {
      var result = false;
      for(var i = 0; i < spending.users.length; i++){
          if (spending.users[i].checked) {
            result = true;
          }
      }
      return result;
    }

    $scope.allSpendingChecked = function() {
      var result = true;
      for(var i = 0; i < $scope.spendings.length; i++){
          if (!$scope.isCheckedSpending($scope.spendings[i])) {
            result = false;
          }
      }
      return result;
    }

    $scope.getSplittedSpent = function(spending) {
      var result = [];
      var checked = 0;
      for(var i = 0; i < spending.users.length; i++){
          if (spending.users[i].checked) {
            checked++;
          }
      }

      for(var i = 0; i < spending.users.length; i++){
          if (spending.users[i].checked) {
            result.push(round(spending.spent / checked));
          } else {
            result.push(0);
          }
      }
      return result;
    }

    $scope.getSplittedSpendingTotal = function() {
      var result = [];
      for(var i = 0; i < $scope.users.length; i++){
          result.push(0);
      }

      for(var i = 0; i < $scope.spendings.length; i++){
          var splittedSpent = $scope.getSplittedSpent($scope.spendings[i]);
          for (var j = 0; j < splittedSpent.length; j++) {
            result[j] += splittedSpent[j]
          }
      }

      for(var i = 0; i < $scope.users.length; i++){
          result[i] = round(result[i]);
      }

      return result;
    }

    $scope.checkForAll = function(spending) {
      for (var i = 0; i < spending.users.length; i++) {
        spending.users[i].checked = true;
      }
    }

    $scope.uncheckForAll = function(spending) {
      for (var i = 0; i < spending.users.length; i++) {
        spending.users[i].checked = false;
      }
    }

    $scope.swapChecks = function(spending) {
      for (var i = 0; i < spending.users.length; i++) {
        spending.users[i].checked = !spending.users[i].checked;
      }
    }
  }
);

