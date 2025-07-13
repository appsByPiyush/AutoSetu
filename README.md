# 🚀 AutoSetu — Instant WhatsApp Lead Notifications

AutoSetu is a smart automation tool that connects Google Forms with WhatsApp to instantly send lead notifications to clients. Built for businesses that rely on fast customer engagement, AutoSetu ensures no lead goes unnoticed.

## 📌 Features

- 🔁 Auto-send WhatsApp messages when a form is submitted
- ⚙️ Custom message templates per client
- 🧾 Works with Google Apps Script and Node.js backend
- 🌐 Supports multiple clients with dynamic routing

---

## 🔧 Tech Stack

- **Frontend:** Google Apps Script (Google Sheets trigger)
- **Backend:** Node.js (Express / Firebase Functions)
- **Messaging:** WhatsApp Business API / Meta API
- **Database:** MongoDB / JSON-based config

---

## ⚙️ How It Works

1. User fills out a **Google Form**
2. A trigger from **Google Sheets** captures the submission
3. Data is sent to your **Backend**
4. A templated **WhatsApp message** is sent to the respective client
5. Client receives the lead details instantly!

---

## 🛠 Setup Instructions

### 1. Clone the Repo
git clone https://github.com/your-username/autosetu.git
cd autosetu

### 2. Install Dependencies
npm install

### 3. Add Environment Variables
Create a .env file

### 4. Deploy Backend
node index.js

### 5. Setup Google Apps Script
In the linked Google Sheet:
    1. Add the SendUpdateOnAddorEdit(e) function
    2. Deploy script as a web app or bind it to a trigger (onEdit / onFormSubmit)

## 📞 Support
If you're using AutoSetu for your local business or want to scale it, drop a message or open an issue. We're happy to help!

## 🧠 Inspired By
Small Indian businesses — coaching centers, real estate agents, tutors — who need quick follow-ups but lack automation tools.
