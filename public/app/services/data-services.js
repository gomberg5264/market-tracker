angular.module('App')
.service('DataServices', DataServices);

function DataServices($http){

  this.searchStocks = function(query) {
    var req = {
      url: '/api/stocks/lookup/' + query,
      method: "GET",
    }

    return $http(req).then(function success(res) {
      console.log("success");
      return res;
    }, function failure(res) {
        console.log("failure");
    });
  }

  this.getStockDetails = function(stockArray, cb) {
    var results = [];
    var numErrors = 0;
    stockArray.forEach(function(stock) {
      var req = {
        url: '/api/stocks/quote/' + stock,
        method: "GET",
      }
      $http(req).then(function success(res) {
        results.push(res.data);
        console.log("success");
        if (stockArray.length === (results.length+ numErrors)) {
          cb(results);
        }
      }, function failure(res) {
        console.log("failure");
        numErrors++;

        if (stockArray.length === (results.length+ numErrors)) {
          cb(results);
        }
      });
    })
  }

  this.getChartData = function(symbolsArr) {
    var dataScope = this;
    var chartRequestObject = {
      Normalized: false,
      NumberOfDays: 730,
      DataPeriod: "Day",
      Elements: symbolsArr
    };
    var json = JSON.stringify(chartRequestObject);
    var url = encodeURIComponent(json);
    var req = {
      url: '/api/stocks/chart/' + url,
      method: "GET"
    }

    return $http(req).then(function success(res) {
      console.log("get chart data success");

      var chartDataArray = [];

      var dates = res.data.Dates.map(function(date, dateIndex){
        return new Date(date).getTime();
      })

      console.log(res.data);

      res.data.Elements.forEach(function(element, elemIndex){
        chartDataArray.push({
          symbol: element.Symbol,
          currency: element.Currency,
          type: element.Type,
          data: []
        });
        dates.forEach(function(date, dateIndex){
          var value = res.data.Elements[elemIndex].DataSeries.close.values[dateIndex];
          chartDataArray[elemIndex].data.push([date, value]);
        })
      })

      console.log("chart data array: ", chartDataArray);

      return chartDataArray;
    }, function failure(res) {
        console.log("get chart data failure");
    });
  }

  this.dateArrayToMs = function(arr){
    return arr = arr.map(function(item){
      var date = new Date(item);
      var ms = date.getTime();
      return ms;
    })
  }

  this.watchStock = function(symbol, quantity){
    
  }

}

DataServices.$inject = ['$http'];
