# Validation App

A beautiful and modern authentication system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- ✨ Beautiful login page with modern UI design
- 🔐 Two-factor authentication with OTP verification
- 📱 Responsive design that works on all devices
- 🖼️ Image upload functionality with preview
- 🎨 Gradient backgrounds and smooth animations
- 📝 Form fields for name, phone number, password, and profile image
- 🆔 PAN card verification with image upload and validation
- ✅ Complete verification flow with success confirmation
- �️ MongoDB integration for data persistence
- 🔒 Secure password hashing with bcryptjs
- 📡 RESTful API endpoints for all operations
- �🚀 Built with Next.js App Router and TypeScript

## Getting Started

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/validation-app
# For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/validation-app

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Environment
NODE_ENV=development
```

3. Start MongoDB (if using local installation):

```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/` - App Router pages and layouts
- `src/components/` - Reusable React components
- `public/` - Static assets
- `.github/` - GitHub configuration and Copilot instructions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and complete phone verification

### PAN Verification
- `POST /api/pan/verify` - Upload and verify PAN card

### User Management
- `GET /api/user/profile?phone={phone}` - Get user profile data

## Database Schema

### User Model
```typescript
{
  name: String (required)
  phone: String (required, unique)
  password: String (required, hashed)
  profileImage: String (base64)
  panNumber: String (unique, uppercase)
  panCardImage: String (base64)
  isPhoneVerified: Boolean
  isPanVerified: Boolean
  otpToken: String
  otpExpiry: Date
  createdAt: Date
  updatedAt: Date
}
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database for data persistence
- **Mongoose** - MongoDB object modeling for Node.js
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **bcryptjs** - Password hashing library
- **ESLint** - Code linting and formatting

## Pages

- `/` - Home page with navigation to login and PAN verification
- `/login` - Beautiful login form with OTP verification
- `/pan-verification` - PAN card verification with image upload
- `/success` - Completion confirmation page

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
