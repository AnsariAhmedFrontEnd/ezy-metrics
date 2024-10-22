const mongoose = require("mongoose");

const CampaignSchema = require("../Schemas/CampaignSchema");

const CampaignModel = mongoose.model("campaign", CampaignSchema);

module.exports = CampaignModel;
