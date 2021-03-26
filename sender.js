var sender = function(expedition) {
  this.expedition = expedition;
};

sender.prototype.validate = function() {
  if (this.expedition.hasPriorityOrGuarantee()) {
    var required = [];
    if (!this.contactLastName) {
      required.push('contactLastName');
    }
    if (!this.contactFirstName) {
      required.push('contactFirstName');
    }
    if (!this.emailAddress) {
      required.push('emailAddress');
    }
    if (!this.phoneNumber) {
      required.push('phoneNumber');
    }
    if (required.length > 0) {
      return new Error('fields ' + invalid_fields.join(', ') + ' are required for this Sender if expedition has priority or guarantee');
    }
  }
  if (this.typeId) {
    return true;
  }
  var invalid_fields = [];
  if (!this.name) {
    invalid_fields.push('name');
  }
  if (!this.address1) {
    invalid_fields.push('address1');
  }
  if (!this.zipCode) {
    invalid_fields.push('zipCode');
  }
  if (!this.city) {
    invalid_fields.push('city');
  }
  if (invalid_fields.length > 0) {
    return new Error('fields ' + invalid_fields.join(', ') + ' are required for this Sender if typeId is not set')
  }
  return true;
};

sender.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var msender = {};
  if (this.type) {
    msender.type = this.type;
  }
  if (this.typeId) {
    msender.typeId = this.typeId;
  }
  if (this.name) {
    msender.name = this.name;
  }
  if (this.address1)  {
    msender.address1 = this.address1;
  }
  if (this.address2) {
    msender.address2 = this.address2;
  }
  if (this.zipCode) {
    msender.zipCode = this.zipCode;
  }
  if (this.city) {
    msender.city = this.city;
  }
  if (this.contactLastName) {
    msender.contactLastName = this.contactLastName;
  }
  if (this.contactFirstName) {
    msender.contactFirstName = this.contactFirstName;
  }
  if (this.emailAddress) {
    msender.emailAddress = this.emailAddress;
  }
  if (this.phoneNumber) {
    msender.phoneNumber = this.phoneNumber;
  }
  if (this.faxNumber) {
    msender.faxNumber = this.faxNumber;
  }
  return msender;
};

sender.prototype.setType = function(type) {
  if (['ENTERPRISE', 'DEPOT'].indexOf(type) === -1) {
    throw new Error("Invalid Sender type: type must be in ['ENTERPRISE', 'DEPOT']");
  }
  this.type = type;
};

sender.prototype.setTypeId = function(code) {
  if (this.type !== 'DEPOT') {
    throw new Error("Sender TypeId must be specified only when type 'DEPOT'");
  }
  this.typeId = code;
};

sender.prototype.setName = function(name) {
 if (name.length > 32) {
  throw new Error('Sender name max length is 32');
 }
 this.name = name;
};

sender.prototype.setAddress1 = function(address1) {
  if (address1.length > 32) {
    throw new Error('Sender address1 max length is 32');
   }
   this.address1 = address1;
};

sender.prototype.setAddress2 = function(address2) {
  if (address2.length > 32) {
    throw new Error('Sender address2 max length is 32');
   }
   this.address2 = address2;
};

sender.prototype.setZipCode = function(zipCode) {
  if (zipCode.length !== 5) {
    throw new Error('Sender zipCode must be 5 digits');
  }
  this.zipCode = zipCode;
};

sender.prototype.setCity = function(city) {
  if (city.length > 27) {
    throw new Error('Sender city max length is 27');
  }
  this.city = city;
};

sender.prototype.setContactLastName = function(contactLastName) {
  if (contactLastName.length > 20) {
    throw new Error('Sender contactLastName max length is 20');
  }
  this.contactLastName = contactLastName;
};

sender.prototype.setContactFirstName = function(contactFirstName) {
  if (contactFirstName.length > 20) {
    throw new Error('Sender contactfirstName max length is 20');
  }
  this.contactFirstName = contactFirstName;
};

sender.prototype.setEmailAddress = function(emailAddress) {
  if (emailAddress.length > 80) {
    throw new Error('Sender emailAddress max length is 80');
  }
  var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailAddress.match(regexEmail)) {
    return new Error('Sender emailAddress must comply with RFC 2822 norm');
  }
  this.emailAddress = emailAddress;
};

sender.prototype.setPhoneNumber = function(phoneNumber) {
  if (phoneNumber.length > 15) {
    throw new Error('Sender phoneNumber max length is 15');
  }
  var regexNumber = /^\d+$/;
  if (!phoneNumber.match(regexNumber)) {
    throw new Error('Sender phoneNumber musn\'t have any separator');
  }
  this.phoneNumber = phoneNumber;
};

sender.prototype.setFaxNumber = function(faxNumber) {
  if (faxNumber.length > 15) {
    throw new Error('Sender faxNumber max length is 15');
  }
  var regexNumber = /^\d+$/;
  if (!faxNumber.match(regexNumber)) {
    throw new Error('Sender faxNumber musn\'t have any separator');
  }
  this.faxNumber = faxNumber;
};

module.exports = sender;
