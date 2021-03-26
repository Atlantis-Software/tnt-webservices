var parcelRequest = function(expedition) {
  this.expedition = expedition;
};

parcelRequest.prototype.validate = function() {
  if (!this.sequenceNumber) {
    return new Error('parcelRequest require a sequenceNumber');
  }
  if (!this.weight) {
    return new Error('parcelRequest require a weight');
  }
  return true;
};

parcelRequest.prototype.get = function() {
  var validate = this.validate();
  if (validate !== true) {
    throw validate;
  }
  var parcel = {
    sequenceNumber: this.sequenceNumber,
    weight: this.weight
  };
  if (this.customerReference) {
    parcel.customerReference = this.customerReference;
  }
  if (this.insuranceAmount) {
    parcel.insuranceAmount = this.insuranceAmount;
  }
  if (this.priorityGuarantee) {
    parcel.priorityGuarantee = this.priorityGuarantee;
  }
  if (this.comment) {
    parcel.comment = this.comment;
  }
  return parcel;
};

parcelRequest.prototype._setSequenceNumber = function(sequenceNumber) {
  this.sequenceNumber = sequenceNumber;
};

parcelRequest.prototype.setCustomerReference = function(customerReference) {
  if (customerReference.length > 10) {
    throw new Error('parcelRequest customerReference max length is 10');
  }
  this.customerReference = customerReference;
};

parcelRequest.prototype.setWeight = function(weight) {
  var regexDecimal = /^(\d+\.?\d*|\.\d+)$/;
  if (!weight.match(regexDecimal)) {
    throw new Error('parcelRequest weight must be a decimal with dot notation');
  }
  this.weight = weight;
};

parcelRequest.prototype.setInsuranceAmount = function(insuranceAmount) {
  var regexDecimal = /^(\d+\.?\d*|\.\d+)$/;
  if (!weight.match(regexDecimal)) {
    throw new Error('parcelRequest insuranceAmount must be a decimal with dot notation');
  }
  var val = parseFloat(insuranceAmount);
  if (val < 1 || val > 25000) {
    throw new Error('parcelRequest insuranceAmount must be a between 1 and 25000');
  }
  this.insuranceAmount = insuranceAmount;
};

parcelRequest.prototype.setPriorityGuarantee = function(priorityGuarantee) {
  if (['', 'PTY', 'GUE'].indexOf(priorityGuarantee) === -1) {
    throw new Error("parcelRequest priorityGuarantee must be in ['', 'PTY', 'GUE']");
  }
  this.priorityGuarantee = priorityGuarantee;
};

parcelRequest.prototype.setComment = function(comment) {
  if (comment.length > 30) {
    throw new Error('parcelRequest comment max length is 30');
  }
  this.comment = comment;
};

module.exports = parcelRequest;
