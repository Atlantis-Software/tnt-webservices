# tnt-webservices
A Node.js library to use tnt webservices

## Installation

Installation uses the [npm](http://npmjs.org/) package manager.  Just type the following command after installing npm.

    npm install tnt-webservices

## Example

```javascript
var tnt = require('tnt-webservices');

tnt(url, username, password, function(err, client) {
  if (err) {
    return console.log(err)
  }
  var expedition = client.createExpedition();
  try {
    expedition.setAccountNumber('06324676');
    expedition.setShippingDate('2021-03-26');
    expedition.setLabelFormat('EPL');
    expedition.setServiceCode('J');
    expedition.setSaturdayDelivery(false);
    expedition.sender.setName('EXPEDITEUR S.A.');
    expedition.sender.setAddress1('1, RUE DEPART');
    expedition.sender.setAddress2('test');
    expedition.sender.setZipCode('75001');
    expedition.sender.setCity('PARIS');
    expedition.sender.setContactFirstName('test');
    expedition.sender.setContactLastName('test');
    expedition.sender.setEmailAddress('expediteur@test.fr');
    expedition.sender.setPhoneNumber('0102030405');
    expedition.receiver.setName('RECEVEUR S.A.');
    expedition.receiver.setAddress1('2, RUE ARRIVEE');
    expedition.receiver.setAddress2('test');
    expedition.receiver.setZipCode('69001');
    expedition.receiver.setCity('LYON');
    expedition.addParcelRequest('1.1');
  } catch(err) {
    return console.log(err);
  }
  expedition.send(function(err, result) {
    if (err) {
      return console.log(err);
    }
    console.log(JSON.stringify(result));
  });
  client.citiesGuide('69003', function(err, result) {
    if (err) {
      return console.log(err);
    }
    console.log(result);
  });
});
```


## License

tnt-webservices is available under the MIT license.
