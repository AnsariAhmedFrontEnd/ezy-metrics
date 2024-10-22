# Ezymetrics Backend

Ezymetrics is a backend service designed to manage leads and campaigns. It provides APIs for creating, retrieving, and reporting on leads and campaigns, as well as sending email alerts.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [ETL Process](#etl-process)
  - [Fetch Leads](#fetch-leads)
  - [Fetch Campaigns](#fetch-campaigns)
  - [Generate CSV Reports](#generate-csv-reports)
  - [Generate PDF Reports](#generate-pdf-reports)
  - [Email Notifications](#email-notifications)
- [License](#license)

## Features

- Bulk upload and transformation of leads and campaigns.
- Generate CSV and PDF reports for leads.
- Send email notifications based on lead generation metrics.

## Technologies

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for handling HTTP requests.
- **Mongoose**: ODM for MongoDB to manage data models.
- **Nodemailer**: Module for sending emails.
- **PDFKit**: Library for creating PDF documents.
- **JSON2CSV**: Library to convert JSON data to CSV format.
- **dotenv**: Module for managing environment variables.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ezymetrics-backend

2. Install the dependencies:

npm install

3. Create a .env file in the root directory of the project and add the following variables:
USER=your-email@example.com
PASS=your-email-password
MONGODB_URI=your-mongodb-connection-string
PORT=5000

To start the application, run:

npm start

The application will be available at http://localhost:5000.

API Endpoints
ETL Process
GET /api/etl

Description: Initiates the ETL (Extract, Transform, Load) process to load leads and campaigns from the database.
Response: Success message if the process completes successfully.
Fetch Leads
GET /api/leads

Description: Retrieves all leads from the database.
Response: JSON array of lead objects.
Fetch Campaigns
GET /api/campaigns

Description: Retrieves all campaigns from the database.
Response: JSON array of campaign objects.
Generate CSV Reports
GET /api/report/csv

Description: Generates a CSV report of all leads and sends it as a downloadable file.
Response: Downloads a CSV file named leads-report.csv.
Generate PDF Reports
GET /api/report/pdf

Description: Generates a PDF report of all leads and sends it as a downloadable file.
Response: Downloads a PDF file named leads-report.pdf.
Email Notifications
GET /api/alert

Description: Sends an email notification if any campaigns exceed a lead generation threshold.
Response: Confirmation message of whether an alert was sent or if no campaigns met the threshold.
License
This project is licensed under the ISC License. See the LICENSE file for more details.

