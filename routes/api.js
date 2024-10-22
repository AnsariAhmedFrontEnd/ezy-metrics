require("dotenv").config();
const express = require("express");
const router = express.Router();

const LeadModel = require("../Models/LeadModel");
const CampaignModel = require("../Models/CampaignModel");

const { Parser } = require("json2csv");
const fs = require("fs");

const PDFDocument = require("pdfkit");
const { Table } = require("pdfkit-table");

const nodemailer = require("nodemailer");

//Helper Functions

const transformLeads = (leads) => {
    return leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      company: lead.company,
      leadStatus: lead.leadStatus,
      dealValue: lead.dealValue.toFixed(2), // Formatting deal value to 2 decimal places
      followUpDate: lead.followUpDate, // Formatting date
      leadSource: lead.leadSource,
    }));
  };
  
  const transformCampaigns = (campaigns) => {
    return campaigns.map((campaign) => ({
      name: campaign.name,
      leadsGenerated: campaign.leadsGenerated,
    }));
  };

  const loadData = async (leads, campaigns) => {
    await LeadModel.bulkWrite(
      leads.map((lead) => ({
        updateOne: {
          filter: { email: lead.email }, // Assuming email is unique
          update: { $set: lead },
          upsert: true,
        },
      }))
    );
  
    await CampaignModel.bulkWrite(
      campaigns.map((campaign) => ({
        updateOne: {
          filter: { name: campaign.name }, // Assuming campaign name is unique
          update: { $set: campaign },
          upsert: true,
        },
      }))
    );
  };
  

  // ETL Process
  router.get("/etl", async (req, res) => {
    try {
      const leads = await LeadModel.find();
      const campaigns = await CampaignModel.find();
  
      // Check if leads or campaigns are empty
      if (!leads.length || !campaigns.length) {
        return res.status(404).send("No leads or campaigns found.");
      }
  
      const transformedLeads = transformLeads(leads);
      const transformedCampaigns = transformCampaigns(campaigns);
  
      await loadData(transformedLeads, transformedCampaigns);
  
      res.status(200).send("ETL process completed successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error during ETL process: " + error.message);
    }
  });
  

// Fetch leads
router.get("/leads", async (req, res) => {
  try {
    const leads = await LeadModel.find();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Fetch campaigns
router.get("/campaigns", async (req, res) => {
  try {
    const campaigns = await CampaignModel.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).send(error);
  }
});

//Genrate CSV Reports

router.get("/report/csv", async (req, res) => {
  try {
    // Fetch leads from the database
    const leads = await LeadModel.find();

    // Define the fields to include in the CSV
    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Phone Number", value: "phoneNumber" },
      { label: "Company", value: "company" },
      { label: "Lead Status", value: "leadStatus" },
      { label: "Deal Value", value: "dealValue" },
      { label: "Follow Up Date", value: "followUpDate" },
      { label: "Lead Source", value: "leadSource" },
    ];

    // Parse the data into CSV format
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    // Write the CSV to a file and send the download response
    fs.writeFileSync("leads-report.csv", csv);
    res.download("leads-report.csv");
  } catch (err) {
    res.status(500).send(err);
  }
});

//Generate PDF reports
router.get("/report/pdf", async (req, res) => {
  try {
    // Fetch leads from the database
    const leads = await LeadModel.find();

    // Set response headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leads-report.pdf"
    );

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to the response directly
    doc.pipe(res);

    // Add a title to the PDF
    doc.fontSize(25).text("Leads Report", { align: "center" }).moveDown(2);

    // Add each lead as a row in the PDF
    leads.forEach((lead) => {
      doc
        .fontSize(12)
        .text(`Name: ${lead.name}`)
        .text(`Email: ${lead.email}`)
        .text(`Phone Number: ${lead.phoneNumber}`)
        .text(`Company: ${lead.company}`)
        .text(`Deal Value: $${lead.dealValue}`)
        .moveDown();
    });

    // Finalize the PDF document
    doc.end();

    // Wait until the PDF document stream has fully ended before ending the response
    doc.on("finish", () => {
      res.end();
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

//Setup for Email Notificaiton

router.get("/alert", async (req, res) => {
  try {
    const campaigns = await CampaignModel.find();

    const thresholdCampaigns = campaigns.filter(
      (campaign) => campaign.leadsGenerated > 1
    );

    if (thresholdCampaigns.length > 0) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      });

      let mailOptions = {
        from: process.env.USER,
        to: process.env.USER,
        subject: "Alert: High Lead Generation",
        text: "Some campaigns have generated more than 0 leads!",
      };

      await transporter.sendMail(mailOptions);
      res.send("Alert email sent!");
    } else {
      res.send("No campaigns exceed lead threshold.");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
