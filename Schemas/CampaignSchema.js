const mongoose = require("mongoose");

const CampaignSchema = new mongoose.Schema({
  name: String,
  startDate: String,
  endDate: String,
  budget: Number,
  spent: Number,
  leadsGenerated: Number,
  status: String,
  channel: String,
});

module.exports = CampaignSchema;
