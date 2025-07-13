const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());
// Load environment variables
const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, MONGODB_URI } = process.env;
// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// autoSetuSchema Schema
const autoSetuSchema = new mongoose.Schema({
  statusCode: { type: Number, required: true },
  statusText: { type: String, required: true },
  from: { type: String, required: true },
  requestReceived: { type: Object, required: true },
  responseReceived: { type: Object, required: true },
  receivedAt: { type: Date, default: Date.now },
});

const AutoSetu = mongoose.model('AutoSetu', autoSetuSchema, 'whatsapp_leads_ts');

const clientSchema = new mongoose.Schema({
  cName: String,
  cId: String,
  templates: {
    type: Map,
    of: String,
    default: {}
  },
});

const Client = mongoose.model("Client", clientSchema, "clients_records");

// Utility to save to MongoDB
const SaveLeadToMongoDB = async (from, requestReceived, responseReceived = {}, statusCode = '00', statusText = 'new') => {
  try {
    if (!from || !requestReceived || !responseReceived) {
      throw new Error("Missing required fields: 'from', 'data', or 'responseReceived'");
    }

    const newEntry = new AutoSetu({ from, requestReceived, responseReceived, statusCode, statusText});
    await newEntry.save();

    return { success: true, entry: newEntry };
  } catch (error) {
    console.error("Error storing lead:", error);
    return { success: false, error: error.message };
  }
};

const getHumanReadableTime = () => {
  const now = new Date(); // Get current system date and time
  // Format parts
  const day = now.getDate().toString().padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'long' });
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 24h to 12h

  // Final formatted string
  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  return formattedDate;
}
// Health Check
app.get("/", (req, res) => res.send("AutoSetu WhatsApp API is running."));

// test Status Call
app.post("/send-status-call", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Missing recipient number: 'to'" });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: "hello_world",
          language: { code: "en_US" },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
console.error("Response from WhatsApp API:");
    console.error(response);
    await SaveLeadToMongoDB("testCall-Dev", req.body, response.data, response.status, response.statusText);

    res.json({ success: true, message: "Message sent and lead saved", data: response.data });
  } catch (error) {
    console.error("TTATa");
    console.error(error);
    const ErrorData =  error.response?.data || error.message;
    await SaveLeadToMongoDB("testCall-Dev", req.body, ErrorData, error.response.status, error.response.statusText);
    res.status(500).json({
      error: "Failed to send message",
      details: ErrorData,
    });
    
  }
});


// client call
app.post("/send-whatsapp", async (req, res) => {
  const { to = '919782970701', from, tempName, data } = req.body;

  if (!from || !tempName || !data) {
    return res.status(400).json({ error: "Data Missing!" });
  }
  if (!from || from.length === 0 || from === null || from === undefined) {
    return res.status(400).json({ error: "Client Not Found!" });
  }
  if (!tempName || tempName.length === 0 || tempName === null || tempName === undefined) {
    return res.status(400).json({ error: "Template Not Found!" });
  }
  if (!data[0] || data[0].length === 0 || data[0] === null || data[0] === undefined) {
    return res.status(400).json({ error: "Data Missing!" });
  }
  try {
    // Find client by ID
    const clientData = await Client.findOne({ cId: from });
    if (!clientData) {
      return res.status(404).json({ error: "Client not found!" });
    }

    // Look up template name from tempNames map
    const templateName = clientData.templates.get(tempName);
    if (!templateName) {
      return res.status(404).json({ error: "Template ID not found for this client"});
    }
    const requestData = data[0];
    const response = await axios.post(
       `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
       {
         messaging_product: "whatsapp",
         to: to,
         type: "template",
         "template": {
            "name": tempName,
            "language": {
              "code": "en",
              "policy": "deterministic"
            },
            "components": [
              {
                "type": "header",
                "parameters": [
                  {
                    "type": "text",
                    "parameter_name" : "form_name",
                    "text": templateName
                  }
                ]
              },
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "text",
                    "parameter_name" : "lead_name",
                    "text": requestData.name || "n/A"
                  },
                  {
                    "type": "text",
                    "parameter_name" : "lead_phone",
                    "text": requestData.phone || "n/A"
                  },
                  {
                    "type": "text",
                    "parameter_name" : "lead_mail",
                    "text": requestData.email || "n/A"
                  },
                  {
                    "type": "text",
                    "parameter_name" : "lead_time",
                    "text": getHumanReadableTime()
                  }
                ]
              }
            ]
          }
       },
       {
         headers: {
           Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
         },
       }
    );

    await SaveLeadToMongoDB(`CC_${clientData.cId}`, req.body, response?.data, response?.status, response?.statusText);
    res.json({ success: true, message: "Message sent and lead saved", data:  response.data });
  } catch (error) {
    const ErrorData =  error.response?.data || error.message;
    //await SaveLeadToMongoDB("testCall-Dev", req.body, ErrorData, error.response.status, error.response.statusText);
    res.status(500).json({
      error: "Failed to send message",
      details: ErrorData,
    });
    
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
