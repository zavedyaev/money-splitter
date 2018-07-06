MoneySplitter.controller('MoneySplitterController',
    function ($scope, $location, $routeParams) {

        $scope.reset = function () {
            //default settings
            $scope.checkedByDefault = true;
            $scope.decimalsNumber = 2;
            $scope.showNotes = true;
            $scope.calculateTransactions = true;
            $scope.debtsByFamilies = [];
            $scope.serializedData = "";

            $scope.users = [
                {
                    name: "Vasya"
                },
                {
                    name: "Sasha"
                }];

            $scope.families = [
                [$scope.users[0]],
                [$scope.users[1]]
            ];

            $scope.defaultPayers = [$scope.users[1]];

            $scope.spendings = [
                {
                    spent: 100,
                    payedBy: [$scope.users[0], $scope.users[1]],
                    note: 'Pen',
                    users: [
                        {user: $scope.users[0], checked: true},
                        {user: $scope.users[1], checked: true}
                    ]
                },
                {
                    spent: 150,
                    payedBy: [$scope.users[0]],
                    note: 'Apple',
                    users: [
                        {user: $scope.users[0], checked: false},
                        {user: $scope.users[1], checked: true}
                    ]
                }
            ];
        };

        $scope.reset();

        function round(toRound) {
            // var result;
            // var multiplier = Math.pow(10, $scope.decimalsNumber);
            // result = Math.round(toRound * multiplier) / multiplier;
            // return result;
            return parseFloat(toRound.toFixed($scope.decimalsNumber));
        }

        $scope.round = function (toRound) {
            return round(toRound)
        };

        $scope.addUser = function () {
            var newUser = {
                name: "new user"
            };
            $scope.users.push(newUser);

            for (var i = 0; i < $scope.spendings.length; i++) {
                var spending = $scope.spendings[i];
                spending.users.push({user: newUser, checked: false});
            }
        };

        $scope.removeUser = function (user) {
            var index = $scope.users.indexOf(user);
            $scope.users.splice(index, 1);

            index = $scope.defaultPayers.indexOf(user);
            $scope.defaultPayers.splice(index, 1);

            for (var i = 0; i < $scope.spendings.length; i++) {
                var spending = $scope.spendings[i];
                spending.users.splice(index, 1);
            }
        };

        $scope.addSpending = function () {
            var usersArray = [];
            for (var i = 0; i < $scope.users.length; i++) {
                var userToInsert = $scope.users[i];
                usersArray.push({user: userToInsert, checked: $scope.checkedByDefault});
            }
            var newSpending = {
                spent: 100,
                payedBy: $scope.defaultPayers,
                note: 'note',
                users: usersArray
            };
            $scope.spendings.push(newSpending);
        };

        $scope.removeSpending = function (spending) {
            var index = $scope.spendings.indexOf(spending);
            $scope.spendings.splice(index, 1);
        };

        $scope.getSpentTotal = function () {
            var total = 0;
            for (var i = 0; i < $scope.spendings.length; i++) {
                var spending = $scope.spendings[i];
                total += spending.spent;
            }
            return total;
        };

        $scope.isCheckedSpending = function (spending) {
            var result = false;
            for (var i = 0; i < spending.users.length; i++) {
                if (spending.users[i].checked) {
                    result = true;
                }
            }
            return result;
        };

        $scope.allSpendingChecked = function () {
            var result = true;
            for (var i = 0; i < $scope.spendings.length; i++) {
                if (!$scope.isCheckedSpending($scope.spendings[i])) {
                    result = false;
                }
            }
            return result;
        };

        $scope.getSplittedSpent = function (spending) {
            var result = [];
            var checked = 0;
            for (var i = 0; i < spending.users.length; i++) {
                if (spending.users[i].checked) {
                    checked++;
                }
            }

            for (i = 0; i < spending.users.length; i++) {
                if (spending.users[i].checked) {
                    result.push(spending.spent / checked);
                } else {
                    result.push(0);
                }
            }
            return result;
        };

        $scope.getSplittedSpendingTotal = function () {
            var result = [];
            for (var i = 0; i < $scope.users.length; i++) {
                result.push(0);
            }

            for (i = 0; i < $scope.spendings.length; i++) {
                var splittedSpent = $scope.getSplittedSpent($scope.spendings[i]);
                for (var j = 0; j < splittedSpent.length; j++) {
                    result[j] += splittedSpent[j]
                }
            }

            return result;
        };

        $scope.checkForAll = function (spending) {
            for (var i = 0; i < spending.users.length; i++) {
                spending.users[i].checked = true;
            }
            $scope.recalcDebtsByFamilies();
        };

        $scope.uncheckForAll = function (spending) {
            for (var i = 0; i < spending.users.length; i++) {
                spending.users[i].checked = false;
            }
            $scope.recalcDebtsByFamilies();
        };

        $scope.swapChecks = function (spending) {
            for (var i = 0; i < spending.users.length; i++) {
                spending.users[i].checked = !spending.users[i].checked;
            }
            $scope.recalcDebtsByFamilies();
        };


        $scope.getPayedByUsers = function () {
            var result = [];
            for (var i = 0; i < $scope.users.length; i++) {
                result.push(0);
            }

            for (i = 0; i < $scope.spendings.length; i++) {
                var spending = $scope.spendings[i];
                var spentByUser = spending.spent / spending.payedBy.length;
                for (var j = 0; j < spending.payedBy.length; j++) {
                    var user = spending.payedBy[j];
                    var userIdxInUsers = $scope.users.indexOf(user);
                    result[userIdxInUsers] += spentByUser
                }
            }

            return result;
        };


        $scope.addFamily = function () {
            $scope.families.push([]);
        };

        $scope.removeFamily = function (index) {
            $scope.families.splice(index, 1);
        };

        $scope.range = function (min, max, step) {
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) {
                input.push(i);
            }
            return input;
        };

        $scope.allPeopleInFamilies = function () {
            var userInFamilies = [];
            var result = true;

            for (var i = 0; i < $scope.users.length; i++) {
                userInFamilies.push(0);

                var user = $scope.users[i];
                for (var j = 0; j < $scope.families.length; j++) {
                    var family = $scope.families[j];
                    if (family.indexOf(user) >= 0) {
                        userInFamilies[i]++
                    }
                }

                if (userInFamilies[i] !== 1) {
                    result = false;
                }
            }

            for (i = 0; i < $scope.families.length; i++) {
                family = $scope.families[i];
                if (family.length === 0) {
                    result = false;
                }
            }

            return result;
        };

        $scope.getPayedByFamilies = function () {
            var payedByUsers = $scope.getPayedByUsers();

            var result = [];
            for (var i = 0; i < $scope.families.length; i++) {
                result.push(0);

                var family = $scope.families[i];

                for (var j = 0; j < family.length; j++) {
                    var user = family[j];
                    var userIdxInUsers = $scope.users.indexOf(user);

                    result[i] += payedByUsers[userIdxInUsers]
                }
            }

            return result;
        };

        $scope.getSpentByFamilies = function () {
            var spentByUsers = $scope.getSplittedSpendingTotal();

            var result = [];
            for (var i = 0; i < $scope.families.length; i++) {
                result.push(0);

                var family = $scope.families[i];

                for (var j = 0; j < family.length; j++) {
                    var user = family[j];
                    var userIdxInUsers = $scope.users.indexOf(user);

                    result[i] += spentByUsers[userIdxInUsers]
                }
            }

            return result;
        };

        $scope.getDebtsByFamilies = function () {
            var result = [];

            var differenceByFamily = [];
            var payedByFamilies = $scope.getPayedByFamilies();
            var spentByFamilies = $scope.getSpentByFamilies();

            for (var i = 0; i < $scope.families.length; i++) {
                var family = $scope.families[i];
                var difference = {
                    family: family,
                    difference: payedByFamilies[i] - spentByFamilies[i]
                };
                if (Math.abs(difference.difference) > 0.000001) {
                    differenceByFamily.push(difference)
                }
            }

            while (differenceByFamily.length > 0) {
                differenceByFamily.sort(function (a, b) {
                    return b.difference - a.difference
                });
                var maxCreditor = differenceByFamily[0];
                var maxDebtor = differenceByFamily[differenceByFamily.length - 1];

                var sum;
                if (maxCreditor.difference > -(maxDebtor.difference)) {
                    sum = -(maxDebtor.difference);
                    differenceByFamily.splice(differenceByFamily.length - 1, 1);

                    var newDifference = maxCreditor.difference - sum;
                    if (Math.abs(newDifference) > 0.000001) {
                        maxCreditor.difference = newDifference
                    } else {
                        differenceByFamily.splice(0, 1);
                    }
                } else {
                    sum = maxCreditor.difference;
                    differenceByFamily.splice(0, 1);
                    newDifference = maxDebtor.difference + sum;
                    if (Math.abs(newDifference) > 0.000001) {
                        maxDebtor.difference = newDifference
                    } else {
                        differenceByFamily.splice(differenceByFamily.length - 1, 1);
                    }
                }

                differenceByFamily = differenceByFamily.filter(function (item) {
                    return Math.abs(item.difference) > 0.000001
                });

                result.push({
                    debtor: maxDebtor.family,
                    creditor: maxCreditor.family,
                    debt: sum
                })
            }

            return result
        };

        // ucs-2 string to base64 encoded ascii
        function utoa(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
        }
        // base64 encoded ascii to ucs-2 string
        function atou(str) {
            return decodeURIComponent(escape(window.atob(str)));
        }

        $scope.getSerializedData = function () {
            var dataObject = {
                checkedByDefault: $scope.checkedByDefault,
                decimalsNumber: $scope.decimalsNumber,
                showNotes: $scope.showNotes,
                calculateTransactions: $scope.calculateTransactions,
                users: $scope.users,
                families: $scope.families,
                defaultPayers: $scope.defaultPayers,
                spendings: $scope.spendings
            };
            return utoa(JSON.stringify(dataObject))
        };

        $scope.updateUrl = function () {
            $scope.serializedData = $scope.getSerializedData();
            $location.search("data", $scope.serializedData);
        };

        $scope.recalcDebtsByFamilies = function () {
            $scope.debtsByFamilies = $scope.getDebtsByFamilies();
            $scope.updateUrl()
        };

        $scope.$watchCollection('spendings', function () {
            $scope.recalcDebtsByFamilies()
        });

        $scope.$watchCollection('families', function () {
            $scope.recalcDebtsByFamilies()
        });


        function findUserByName(name) {
            return $scope.users.find(function (user) { return user.name === name; })
        }

        $scope.loadSerializedData = function () {
            var dataObject = JSON.parse(atou($scope.serializedData));

            $scope.checkedByDefault = dataObject.checkedByDefault;
            $scope.decimalsNumber = dataObject.decimalsNumber;
            $scope.showNotes = dataObject.showNotes;
            $scope.calculateTransactions = dataObject.calculateTransactions;
            $scope.users = dataObject.users;
            $scope.families = dataObject.families;

            for (var i = 0; i < $scope.families.length; i++) {
                var family = $scope.families[i];
                var refreshedFamily = [];
                for (var j = 0; j < family.length; j++) {
                    var user = family[j];
                    var existingUser = findUserByName(user.name);
                    refreshedFamily.push(existingUser)
                }

                $scope.families[i] = refreshedFamily
            }

            $scope.defaultPayers = dataObject.defaultPayers;

            for (i = 0; i < $scope.defaultPayers.length; i++) {
                user = $scope.defaultPayers[i];
                existingUser = findUserByName(user.name);
                $scope.defaultPayers[i] = user
            }

            $scope.spendings = dataObject.spendings;

            for (i = 0; i < $scope.spendings.length; i++) {
                var spending = $scope.spendings[i];

                var refreshedPayedBy = [];
                for (j = 0; j < spending.payedBy.length; j ++) {
                    user = spending.payedBy[j];
                    existingUser = findUserByName(user.name);
                    refreshedPayedBy.push(user)
                }
                spending.payedBy = refreshedPayedBy;

                for (j = 0; j < spending.users.length; j ++) {
                    user = spending.users[j];
                    existingUser = findUserByName(user.user.name);
                    user.user = existingUser
                }
            }

            $scope.recalcDebtsByFamilies()
        };

        var urlParam = $routeParams.data;
        if (urlParam !== undefined && urlParam !== "") {
            $scope.serializedData = urlParam;
            $scope.loadSerializedData();
        }
    }
);

