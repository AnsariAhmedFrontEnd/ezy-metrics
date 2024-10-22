const mongoose = require("mongoose");

const LeadSchema = require("../Schemas/LeadSchema");

const LeadModel = mongoose.model("lead", LeadSchema);

module.exports = LeadModel;
