var receiver = function(expedition) {
  this.expedition = expedition;
};

receiver.prototype.validate = function() {
  var invalid_fields = [];
  if (!this.typeId && this.type !== 'INDIVIDUAL' && !this.name) {
    invalid_fields.push('name');
  }
  if (!this.typeId && !this.address1) {
    invalid_fields.push('address1');
  }
  if (!this.typeId && !this.zipCode) {
    invalid_fields.push('zipCode');
  }
  if (this.typeId !== 'DEPOT' && !this.city) {
    invalid_fields.push('city');
  }
  if (this.type === 'DEPOT' && !this.contactLastName) {
    invalid_fields.push("contactLastName with type 'DEPOT'");
  }
  if (this.type === 'DEPOT' && !this.contactFirstName) {
    invalid_fields.push("contactFirstName with type 'DEPOT'");
  }
  if (this.expedition.hasPriorityOrGuarantee()) {
    if (!this.contactLastName) {
      invalid_fields.push('contactLastName with Priority or Guarantee set on a parcel');
    }
    if (!this.contactFirstName) {
      invalid_fields.push('contactFirstName with Priority or Guarantee set on a parcel');
    }
  }
  if (invalid_fields.length > 0) {
    return new Error('fields ' + invalid_fields.join(', ') + ' are required for this Receiver');
  }
  return true;
};

receiver.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var mreceiver = {};
  if (this.name) {
    mreceiver.name = this.name;
  }
  if (this.address1) {
    mreceiver.address1 = this.address1;
  }
  if (this.zipCode) {
    mreceiver.zipCode = this.zipCode;
  }
  if (this.city) {
    mreceiver.city = this.city;
  }
  if (this.address2) {
    mreceiver.address2 = this.address2;
  }
  if (this.type) {
    mreceiver.type = this.type;
  }
  if (this.typeId) {
    mreceiver.typeId = this.typeId;
  }
  if (this.instructions) {
    mreceiver.instructions = this.instructions
  }
  if (this.contactLastName) {
    mreceiver.contactLastName = this.contactLastName;
  }
  if (this.contactFirstName) {
    mreceiver.contactFirstName = this.contactFirstName;
  }
  if (this.emailAddress) {
    mreceiver.emailAddress = this.emailAddress;
  }
  if (this.phoneNumber) {
    mreceiver.phoneNumber = this.phoneNumber;
  }
  if (this.accessCode) {
    mreceiver.accessCode = this.accessCode;
  }
  if (this.floorNumber) {
    mreceiver.floorNumber = this.floorNumber;
  }
  if (this.buldingId) {
    mreceiver.buldingId = this.buldingId;
  }
  if (this.sendNotification) {
    mreceiver.sendNotification = this.sendNotification;
  }
  return mreceiver;
};

receiver.prototype.setType = function(type) {
  if (['ENTERPRISE', 'DEPOT', 'DROPOFFPOINT', 'INDIVIDUAL'].indexOf(type) === -1) {
    throw new Error("Invalid Reveiver type: type must be in ['ENTERPRISE', 'DEPOT', 'DROPOFFPOINT', 'INDIVIDUAL']");
  }
  this.type = type;
};

receiver.prototype.setTypeId = function(code) {
  if (['DEPOT', 'DROPOFFPOINT'].indexOf(this.type) === -1) {
    throw new Error("TypeId must be specified only when type in ['DEPOT', 'DROPOFFPOINT']");
  }
  this.typeId = code;
};

receiver.prototype.setName = function(name) {
  if (name.length > 32) {
    throw new Error('Receiver name max length is 32');
  }
  this.name = name;
};

receiver.prototype.setAddress1 = function(address1) {
  if (address1.length > 32) {
    throw new Error('Receiver address1 max length is 32');
  }
  this.address1 = address1;
};

receiver.prototype.setAddress2 = function(address2) {
  if (address2.length > 32) {
    throw new Error('Receiver address2 max length is 32');
  }
  this.address2 = address2;
};

receiver.prototype.setZipCode = function(zipCode) {
  if (zipCode.length !== 5) {
    throw new Error('Receiver zipCode must be 5 digits');
  }
  this.zipCode = zipCode;
};

receiver.prototype.setCity = function(city) {
  if (city.length > 27) {
    throw new Error('Receiver city max length is 27');
  }
  this.city = city;
};

receiver.prototype.setInstructions = function(instructions) {
  if (instructions.length > 60) {
    throw new Error('Receiver instructions max length is 60');
  }
  this.instructions = instructions;
};

receiver.prototype.setContactLastName = function(contactLastName) {
  if (contactLastName.length > 19) {
    throw new Error('Receiver contactLastName max length is 19');
  }
  this.contactLastName = contactLastName;
};

receiver.prototype.setContactFirstName = function(contactFirstName) {
  if (contactFirstName.length > 12) {
    throw new Error('Receiver contactFirstName max length is 12');
  }
  this.contactFirstName = contactFirstName;
};

receiver.prototype.setEmailAddress = function(emailAddress) {
  if (emailAddress.length > 80) {
    throw new Error('Receiver emailAddress max length is 80');
  }
  var regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailAddress.match(regexEmail)) {
    return new Error('Receiver emailAddress must comply with RFC 2822 norm');
  }
  this.emailAddress = emailAddress;
};

receiver.prototype.setPhoneNumber = function(phoneNumber) {
  if (phoneNumber.length > 15) {
    throw new Error('Receiver phoneNumber max length is 15');
  }
  var regexNumber = /^\d+$/;
  if (!phoneNumber.match(regexNumber)) {
    throw new Error('Receiver phoneNumber musn\'t have any separator');
  }
  this.phoneNumber = phoneNumber;
};

receiver.prototype.setAccessCode = function(accessCode) {
  if (accessCode.length > 7) {
    throw new Error('Receiver accessCode max length is 7');
  }
  this.accessCode = accessCode;
};

receiver.prototype.setFloorNumber = function(floorNumber) {
  if (floorNumber.length > 2) {
    throw new Error('Receiver floorNumber max length is 2');
  }
  this.floorNumber = floorNumber;
};

receiver.prototype.setBuldingId = function(buldingId) {
  if (buldingId.length > 3) {
    throw new Error('Receiver buldingId max length is 3');
  }
  this.buldingId = buldingId;
};

receiver.prototype.setSendNotification = function(sendNotification) {
  if (sendNotification) {
    this.sendNotification = '1';
  } else {
    this.sendNotification = '0';
  }
};

module.exports = receiver;
