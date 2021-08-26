var invoice = angular.module('invoice', []);
invoice.controller('InvoiceController', function($scope){
  $scope.invoice = {
    items: [{
      name: 'item',
      description: 'item description',
      qty: 5,
      price: 5.5
    }]
  };
  $scope.add = function(){
    $scope.invoice.items.push({
      name: '',
      description: '',
      qty: 1,
      price: 0
    });
  },
    $scope.remove = function(index){
    $scope.invoice.items.splice(index, 1);
  },
    $scope.total = function(){
    var total = 0;
    angular.forEach($scope.invoice.items, function(item){
      total += item.qty * item.price;
    })
    return total;
  }
});