# 🚀 AutoSetu Backend API

AutoSetu is a backend automation API that connects **Google Sheets → MongoDB → WhatsApp Notifications**.

Whenever a new row is added in a Google Sheet, AutoSetu automatically:

✅ Receives the row data via API  
✅ Stores the entry securely in MongoDB  
✅ Sends an instant WhatsApp message to the Sheet owner with the submitted details  

---

## ✨ Features

- 📌 Google Sheets row trigger integration  
- ⚡ REST API to receive new sheet entries  
- 🗄️ Automatically saves records into MongoDB  
- 📲 WhatsApp notifications sent instantly to the sheet owner  
- 🔒 Secure backend architecture (keys & configs protected)  
- 🧩 Scalable design for future integrations  

---

## 🛠 Tech Stack

- **Backend:** Node.js / Express  
- **Database:** MongoDB  
- **Messaging:** Twilio WhatsApp API  
- **Integration:** Google Sheets Webhook / Apps Script Trigger  
- **Deployment Ready:** Docker + Cloud Support  

---

## 📌 How It Works

1. Owner creates a Google Sheet  
2. A Google Apps Script trigger runs when a new row is added  
3. Script sends row data to AutoSetu API endpoint  
4. AutoSetu backend:
   - Validates the payload  
   - Saves it in MongoDB  
   - Sends WhatsApp notification to owner  

---

## ⚙️ API Workflow

### 📌 Endpoint: Add Sheet Entry

**POST** `/api/sheet-entry`

---

### 🧾 Request Body Example

```json
{
  "sheetId": "xyz123",
  "ownerPhone": "+91XXXXXXXXXX",
  "entry": {
    "name": "Rahul Sharma",
    "amount": 500,
    "category": "Payment Received",
    "date": "2026-02-05"
  }
}
```

### ✅ Response Example

```json
{
  "success": true,
  "message": "Entry saved and WhatsApp notification sent."
}
```
### 📲 WhatsApp Notification Example
```
✅ New Entry Added in Your Sheet

Name: Rahul Sharma  
Amount: ₹500  
Category: Payment Received  
Date: 05-Feb-2026  
```
