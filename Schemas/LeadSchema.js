const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  company: String,
  leadStatus: String,
  dealValue: Number,
  followUpDate: String,
  leadSource: String,
});

module.exports = LeadSchema;
