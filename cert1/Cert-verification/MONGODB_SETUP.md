# MongoDB Setup Guide for Windows

## Option 1: Use MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get the connection URI
5. Update `.env` file in the Server folder with your MongoDB URI:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/certificate-validator
   ```

## Option 2: Install MongoDB Locally

1. Download MongoDB Community Edition from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. MongoDB will run on `localhost:27017` by default
4. The `.env` already has the correct URI: `mongodb://localhost:27017/certificate-validator`

## Verify MongoDB Connection

Once MongoDB is running, start your backend server:

```bash
cd Server
node index.js
```

You should see: ✅ MongoDB Connected

## Default Test Credentials (After First Signup)

Email: test@example.com
Password: password123

The authentication system will now save all users to MongoDB with encrypted passwords.
