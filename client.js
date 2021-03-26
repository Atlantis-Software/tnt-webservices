var soap = require('soap'); // 0.33.0
var Expedition = require('./expedition');

var createClient = function(url, username, password, cb) {
  soap.createClient(url, function(err, socket) {
    if (err) {
      return cb(err);
    }
    var options = {
      hasTimeStamp: false
    };
    var wsSecurity = new soap.WSSecurity(username, password, options);
    socket.setSecurity(wsSecurity);
    var client = {
      createExpedition: function() {
        return new Expedition(socket);
      },
      citiesGuide: function(zipCode, cb) {
        socket.citiesGuide({zipCode}, function(err, result) {
          if (err) {
            return cb(new Error(err.message));
          }
          cb(null, result);
        });
      }
    };
    cb(null, client);
  });
};

module.exports = createClient;