var paybackInfo = function(expedition) {
  this.expedition = expedition;
};

paybackInfo.prototype.valide = function() {
  if (!this.paybackAmount) {
    return new Error('PaybackInfo paybackAmount is required');
  }
  if (this.useSenderAddress === "1") {
    return true;
  }
  var required = [];
  if (!this.name) {
    required.push('name');
  }
  if (!this.address1) {
    required.push('address1');
  }
  if (!this.zipCode) {
    required.push('zipCode');
  }
  if (!this.city) {
    required.push('city');
  }
  if (required.length > 0) {
    return new Error('fields ' + required.join(', ') + ' are required in PaybackInfo when sender address is not used');
  }
};

paybackInfo.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var pb = null;
  if (this.useSenderAddress === "1") {
    pb = {
      paybackAmount: this.paybackAmount,
      useSenderAddress: "1"
    };
  } else {
    pb = {
      paybackAmount: this.paybackAmount,
      name: this.name,
      address1: this.address1,
      zipCode: this.zipCode,
      city: this.city
    };
    if (this.address2) {
      pb.address2 = this.address2;
    }
  }
  return pb;
};

paybackInfo.prototype.setUseSenderAddress = function(useSenderAddress) {
  if (useSenderAddress) {
    this.useSenderAddress = "1";
  } else {
    this.useSenderAddress = "0";
  }
};

paybackInfo.prototype.setPaybackAmount = function(paybackAmount) {
  var regexDecimal = /^(\d+\.?\d*|\.\d+)$/;
  if (!paybackAmount.match(regexDecimal)) {
    throw new Error('PaybackInfo paybackAmount must be a decial with dot notation');
  }
  if (parseFloat(paybackAmount) > 10000) {
    throw new Error('PaybackInfo paybackAmount max value is 10000');
  }
  this.paybackAmount = paybackAmount;
};

paybackInfo.prototype.setName = function(name) {
  if (name.length > 32) {
    throw new Error('PaybackInfo name max length is 32');
  }
  this.name = name;
};

paybackInfo.prototype.setAddress1 = function(address1) {
  if (address1.length > 32) {
    throw new Error('PaybackInfo address1 max length is 32');
  }
  this.address1 = address1;
};

paybackInfo.prototype.setAddress2 = function(address2) {
  if (address2.length > 32) {
    throw new Error('PaybackInfo address2 max length is 32');
  }
  this.address2 = address2;
};

paybackInfo.prototype.setZipCode = function(zipCode) {
  if (zipCode.length !== 5) {
    throw new Error('PaybackInfo zipCode must be 5 digits');
  }
  this.zipCode = zipCode;
};

paybackInfo.prototype.setCity = function(city) {
  if (city.length > 27) {
    throw new Error('PaybackInfo city max length is 27');
  }
  this.city = city;
};

module.exports = paybackInfo;
