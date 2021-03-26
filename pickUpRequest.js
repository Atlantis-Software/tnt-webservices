var pickUpRequest = function(expedition) {
  this.expedition = expedition;
  this.emailAddress = [];
};

pickUpRequest.prototype.validate = function() {
  if (this.emailAddress.length < 1) {
    return new Error('PickUpRequest require a least one email');
  }
  if (!this.phoneNumber) {
    return new Error('field phoneNumber is required in PickUpRequest');
  }
  if (!this.closingTime) {
    return new Error('field closingTime is required in PickUpRequest');
  }
  return true;
};

pickUpRequest.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var pkr = {
    media: 'EMAIL',
    emailAddress: this.emailAddress,
    phoneNumber: this.phoneNumber,
    closingTime: this.closingTime
  };

  if (this.notifySuccess) {
    pkr.notifySuccess = this.notifySuccess;
  }

  if (this.service) {
    pkr.service = this.service;
  }
  
  if (this.lastName) {
    pkr.lastName = this.lastName;
  }
  
  if (this.firstName) {
    pkr.firstName = this.firstName;
  }
  
  if (this.instructions) {
    pkr.instructions = this.instructions;
  }
  return pkr;
};

pickUpRequest.prototype.addEmailAddress = function(emailAddress) {
  if (emailAddress.length > 80) {
    throw new Error('PickUpRequest emailAddress max length is 80');
  }
  var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailAddress.match(regexEmail)) {
    return new Error('PickUpRequest emailAddress must comply with RFC 2822 norm');
  }
  this.emailAddress.push(emailAddress);
};

pickUpRequest.prototype.setNotifySuccess = function(notifySuccess) {
  if (notifySuccess) {
    this.notifySuccess = "1";
  } else {
    this.notifySuccess = "0";
  }
};

pickUpRequest.prototype.setService = function(service) {
  if (service.length > 20) {
    throw new Error('PickUpRequest service max length is 20');
  }
  this.service = service;
};

pickUpRequest.prototype.setLastName = function(lastName) {
  if (lastName.length > 20) {
    throw new Error('PickUpRequest lastName max length is 20');
  }
  this.lastName = lastName;
};

pickUpRequest.prototype.setFirstName = function(firstName) {
  if (firstName.length > 20) {
    throw new Error('PickUpRequest firstName max length is 20');
  }
  this.firstName = firstName;
};

pickUpRequest.prototype.setPhoneNumber = function(phoneNumber) {
  if (phoneNumber.length > 15) {
    throw new Error('PickUpRequest phoneNumber max length is 15');
  }
  var regexNumber = /^\d+$/;
  if (!phoneNumber.match(regexNumber)) {
    throw new Error('PickUpRequest phoneNumber musn\'t have any separator');
  }
  this.phoneNumber = phoneNumber;
};

pickUpRequest.prototype.setClosingTime = function(closingTime) {
  var regexTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!closingTime.match(regexTime)) {
    throw new Error('PickUpRequest closingTime musn\'t be in HH:MM format');
  }
  this.closingTime = closingTime;
};

pickUpRequest.prototype.setInstructions = function(instructions) {
  if (instructions.length > 40) {
    throw new Error('PickUpRequest instructions max length is 40');
  }
  this.instructions = instructions;
};

module.exports = pickUpRequest;
