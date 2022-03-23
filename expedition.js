var Sender = require('./sender');
var Receiver = require('./receiver');
var ParcelRequest = require('./parcelRequest');
var PaybackInfo = require('./paybackInfo');
var PickUpRequest = require('./pickUpRequest');


var expedition = function(socket) {
  this._socket = socket;
  this.sender = new Sender(this);
  this.receiver = new Receiver(this);
  this.parcelsRequest = [];
};

expedition.prototype.send = function(cb) {
  var exp;
  try {
    exp = this.get();
  } catch(err) {
    return cb(err);
  }

  console.log(JSON.stringify({ parameters: exp }));
  this._socket.expeditionCreation({ parameters: exp }, function(err, result, rawResponse, soapHeader, rawRequest) {
    if (err) {
      return cb(new Error(err.message));
    }
    if (result.Expedition && result.Expedition.PDFLabels) {
      result.Expedition.PDFLabels = Buffer.from(result.Expedition.PDFLabels, 'base64');
    }
    cb(err, result);
  });
};

expedition.prototype.hasPriorityOrGuarantee = function() {
  var priorityOrGuarantee = false;
  this.parcelsRequest.forEach(function(parcel) {
    if (parcel.priorityGuarantee) {
      priorityOrGuarantee = true;
    }
  });
  return priorityOrGuarantee;
};

expedition.prototype.validate = function() {
  if (this.sender.validate() !== true) {
    return this.sender.validate();
  }
  if (this.receiver.validate() !== true) {
    return this.receiver.validate();
  }
  if (this.paybackInfo && this.paybackInfo.validate() !== true) {
    return this.paybackInfo.validate();
  }
  if (this.pickUpRequest && this.pickUpRequest.validate() !== true) {
    return this.pickUpRequest.validate();
  }
  var required = [];
  if (!this.shippingDate) {
    required.push('shippingDate');
  }
  if (!this.accountNumber) {
    required.push('accountNumber');
  }
  if (!this.serviceCode) {
    required.push('serviceCode');
  }
  if (!this.labelFormat) {
    required.push('labelFormat');
  }
  if (required.length > 0) {
    return new Error('fields ' + required.join(', ') + 'are required in Expedition');
  }
  if (this.parcelsRequest.length < 1 || this.parcelsRequest.length > 30) {
    return new Error("Expedition require beetween 1 and 30 parcelRequests");
  }
  return true;
};

expedition.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var exp = {
    shippingDate: this.shippingDate,
    accountNumber: this.accountNumber,
    sender: this.sender.get(),
    receiver: this.receiver.get(),
    serviceCode: this.serviceCode,
    labelFormat: this.labelFormat,
    quantity: this.parcelsRequest.length,
    parcelsRequest: {
      parcelRequest: []
    }
  };
  this.parcelsRequest.forEach(function(parcelRequest) {
    exp.parcelsRequest.parcelRequest.push(parcelRequest.get());
  });
  if (this.pickUpRequest) {
    exp.pickUpRequest = this.pickUpRequest.get();
  }
  if (this.saturdayDelivery) {
    exp.saturdayDelivery = this.saturdayDelivery;
  }
  if (this.paybackInfo) {
    exp.paybackInfo = this.paybackInfo.get();
  }
  return exp;
};

expedition.prototype.addParcelRequest = function(weight) {
  var parcelRequest = new ParcelRequest(this);
  parcelRequest._setSequenceNumber(this.parcelsRequest.length + 1);
  parcelRequest.setWeight(weight);
  this.parcelsRequest.push(parcelRequest);
  return parcelRequest;
};

expedition.prototype.addPickUpRequest = function() {
  this.pickUpRequest = new PickUpRequest(this);
  return this.pickUpRequest;
};

expedition.prototype.setShippingDate = function(shippingDate) {
  // YYYY-MM-DD moins d'un mois
  var regexDate = /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
  if (!shippingDate.match(regexDate)) {
    throw new Error('Expedition shippingDate must be in YYYY-MM-DD format');
  }
  var sd = shippingDate.split("-");
  var jsShippingDate = new Date(sd[2], sd[1] - 1, sd[0]);
  var day = jsShippingDate.getDay();
  if (day === 6 || day === 0) {
    throw new Error('Expedition shippingDate musn\'t be a saturday or sunday');
  }
  var now = new Date();
  var nextMonth = null;
  if (now.getMonth() == 11) {
    nextMonth = new Date(now.getFullYear() + 1, 0, 1);
  } else {
    nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  if (jsShippingDate.getTime() > nextMonth.getTime()) {
    throw new Error('Expedition shippingDate musn\'t be more than one month later');
  }
  this.shippingDate = shippingDate;
};

expedition.prototype.setAccountNumber = function(accountNumber) {
  var regexNumber = /^\d+$/;
  if (!accountNumber.match(regexNumber)) {
    throw new Error('Expedition accountNumber must only contains numbers');
  }
  if (accountNumber.length !== 8) {
    throw new Error('Expedition accountNumber must be 8 digits long');
  }
  this.accountNumber = accountNumber;
};

expedition.prototype.setServiceCode = function(serviceCode) {
  if (serviceCode.length > 2) {
    throw new Error('Expedition serviceCode max length is 2');
  }
  this.serviceCode = serviceCode;
};

expedition.prototype.setSaturdayDelivery = function(saturdayDelivery) {
  if (saturdayDelivery) {
    this.saturdayDelivery = '1';
  } else {
    this.saturdayDelivery = '0';
  }
};

expedition.prototype.addPaybackInfo = function() {
  this.paybackInfo = new PaybackInfo(this);
  return this.paybackInfo;
};

expedition.prototype.setLabelFormat = function(labelFormat) {
  if (['STDA4', 'ZPL', 'ZPL,DPI_200', 'ZPL,DPI_300', 'EPL'].indexOf(labelFormat) === -1) {
    throw new Error("Expedition labelFormat must be in ['STDA4', 'ZPL', 'ZPL,DPI_200', 'ZPL,DPI_300', 'EPL']");
  }
  this.labelFormat = labelFormat;
};

expedition.prototype.setHazardousMaterial = function(hazardousMaterial) {
  if (['LQ', 'EQ', 'BB', 'LB', 'GM'].indexOf(hazardousMaterial) === -1) {
    throw new Error("Expedition hazardousMaterial must be in ['LQ', 'EQ', 'BB', 'LB', 'GM']");
  }
  this.hazardousMaterial = hazardousMaterial;
};

module.exports = expedition;
