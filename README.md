# 🍽️ MFC Online Shop – QR Based Order & Pickup Verification System

A full-stack web application designed to manage online food orders with **QR code–based pickup verification**, **admin analytics**, and **secure backend validation**.  
This system helps prevent order fraud, duplicate pickups, and unauthorized access.

---

## 🚀 Project Overview

**MFC Online Shop** allows users to place orders online and receive a **unique QR code** for each order.  
At the pickup counter, staff scan the QR code using a web-based scanner, and the backend verifies the order **securely** before allowing pickup.

The project also includes an **Analytics Dashboard** and **Monthly PDF Export** to handle limited database storage efficiently.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- html5-qrcode
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas Cluster)
- Mongoose
- JWT Authentication

### Tools
- QR Code Generator
- MongoDB Aggregation Framework
- PDF Export (Analytics Reports)

---

## 📸 Screenshots

### 🏠 Home Page
![Home Page](screenshots/home.png)

### 🧾 Order Confirmation with QR Code
![Order QR](screenshots/order-qr.png)

### 📷 QR Scan Page (Camera Permission)
![Scan Page](screenshots/scan.png)

### 📊 Analytics Dashboard
![Analytics](screenshots/analytics.png)

### 📄 Monthly PDF Report
![PDF Report](screenshots/pdf-report.png)

> 📌 *Add your screenshots inside a `screenshots/` folder and update image names if needed.*

---

## ✨ Key Features

### 👤 User Features
- Place online orders
- View order summary
- Receive QR code for pickup
- Secure order confirmation

### 🧑‍💼 Admin / Counter Features
- Scan QR using mobile or webcam
- Backend order verification
- Prevent duplicate or fake pickups
- View analytics dashboard

### 📊 Analytics & Reports
- Total orders per month
- Revenue analytics
- Payment status tracking
- Pickup verification status
- Export monthly data as PDF
- Reduce MongoDB storage usage

---

## 🔐 Security Measures

- QR data is **validated in backend**
- QR reuse prevention
- Pickup allowed only once
- Invalid or tampered QR rejected
- Order ID verified using database lookup

---

## 🧠 Problem Statement

Traditional food pickup systems are prone to:
- Fake screenshots
- QR reuse
- Manual verification errors
- No centralized analytics

---

## 💡 Proposed Solution

A **QR-based order verification system** with:
- Secure backend validation
- Real-time scanning
- Analytics using MongoDB aggregation
- Monthly PDF export to save database space

---

## 📈 Analytics System (MongoDB Aggregation)

The analytics module uses:
- `$match` – filter by date
- `$group` – calculate totals
- `$sum` – revenue calculation
- `$count` – total orders

Monthly data is:
1. Aggregated
2. Converted to PDF
3. Optionally removed from database

---

## 🗂️ Project Folder Structure
