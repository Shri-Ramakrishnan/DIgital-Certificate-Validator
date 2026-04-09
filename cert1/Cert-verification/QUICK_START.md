# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB installed locally OR MongoDB Atlas account (cloud)

## Step 1: Setup MongoDB

### Option A: MongoDB Atlas (Cloud - Easiest)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `.env` in Server folder:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate-validator
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

### Option B: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and run
3. `.env` already configured for localhost

## Step 2: Start Backend Server

```bash
cd Server
npm install  # if not already done
node index.js
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

## Step 3: Start Frontend (in another terminal)

```bash
cd client
npm run dev
```

The app will open at http://localhost:5173/auth

## Step 4: Test the App

1. **Sign Up**: Create a new account with email/password
2. **Login**: Use the credentials you just created
3. **Validate Certificates**: Upload .pem, .crt, or .cer files

## Troubleshooting

### "next is not a function" Error
- This means backend is not running
- Make sure MongoDB is running
- Start the backend server with: `cd Server && node index.js`

### MongoDB Connection Failed
- Check if MongoDB is installed and running
- Check MONGODB_URI in .env file
- Use MongoDB Atlas if local installation fails

### Port Already in Use
- Change PORT in Server/.env to 5001
- Change vite port in client
