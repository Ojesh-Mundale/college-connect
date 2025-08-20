# College Connect 🎓

A modern MERN stack platform that connects college students to share knowledge, ask questions, and build a collaborative learning community.

![College Connect Banner](./screenshots/banner.png)

## 🌟 Overview

College Connect is a comprehensive Q&A platform designed specifically for college students to facilitate peer-to-peer learning, knowledge sharing, and academic collaboration. Built with cutting-edge technologies, it provides an intuitive and engaging experience for students to connect and learn together.

## 🚀 Features

### 📚 Core Features
- **Smart Q&A System**: Ask questions and get answers from your college peers
- **Rich Text Editor**: Beautiful markdown support with syntax highlighting
- **AI-Powered Assistance**: Intelligent answer suggestions using OpenAI GPT
- **Real-time Notifications**: Stay updated with instant notifications
- **Advanced Search**: Find questions by tags, categories, or users

### 👥 Community Features
- **User Profiles**: Customizable profiles with achievements and reputation
- **Follow System**: Follow favorite contributors and topics
- **Leaderboards**: Compete with top contributors in your college
- **Comments & Discussions**: Engage in meaningful academic conversations
- **Bookmark System**: Save important questions for later reference

### 🏆 Gamification
- **Reputation Points**: Earn points for quality contributions
- **Achievement Badges**: Unlock badges for milestones
- **User Levels**: Progress from beginner to expert
- **College Leaderboards**: See top contributors from your institution

### 🔒 Security & Privacy
- **JWT Authentication**: Secure login and session management
- **Role-based Access**: Different permissions for different user types
- **Content Moderation**: AI-powered content filtering
- **Privacy Controls**: Control who can see your content

## 📸 Screenshots

### 🏠 Landing Page
![Home Page](./screenshots/home-page.png)
*Welcome screen with featured questions and trending topics*

### 🔍 Question Feed
![Question Feed](./screenshots/question-feed.png)
*Browse all questions with advanced filtering and sorting*

### ❓ Ask Question
![Ask Question](./screenshots/ask-question.png)
*Rich text editor for creating detailed questions with markdown support*

### 💬 Question Detail
![Question Detail](./screenshots/question-detail.png)
*View full question with answers, comments, and voting*

### 👤 User Profile
![User Profile](./screenshots/user-profile.png)
*Personalized profile with reputation, badges, and activity history*

### 🏆 Leaderboard
![Leaderboard](./screenshots/leaderboard.png)
*See top contributors from your college with rankings*

### 📱 Mobile Responsive
![Mobile View](./screenshots/mobile-responsive.png)
*Fully responsive design for all devices*

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive design
- **React Router** for seamless navigation
- **Axios** for API communication
- **React Context** for state management
- **Framer Motion** for smooth animations

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure access
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Socket.io** for real-time features

### AI Integration
- **OpenAI GPT-4** for intelligent answer suggestions
- **Content moderation** for quality control
- **Smart recommendations** based on user behavior

### Development Tools
- **ESLint** for code quality
- **Prettier** for code formatting
- **Git** for version control
- **Vercel** for frontend deployment
- **Railway** for backend deployment

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/college-connect.git
cd college-connect
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
college-connect/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── config/         # Configuration files
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context providers
│   │   ├── config/     # Configuration
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
└── screenshots/        # App screenshots
```

## 🔧 Environment Variables

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/collegeconnect

# JWT
JWT_SECRET=your-super-secret-jwt-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## 🎯 Usage Guide

### For Students
1. **Sign Up**: Create an account with your college email
2. **Ask Questions**: Post your academic doubts with proper formatting
3. **Answer Questions**: Help your peers by providing quality answers
4. **Earn Points**: Gain reputation for valuable contributions
5. **Track Progress**: Monitor your learning journey

### For Moderators
1. **Review Content**: Ensure quality and appropriateness
2. **Manage Users**: Handle user reports and violations
3. **Curate Content**: Feature important questions and answers

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get specific question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Answers
- `GET /api/questions/:id/answers` - Get answers for a question
- `POST /api/questions/:id/answers` - Add answer to question
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user profile
- `GET /api/users/leaderboard` - Get leaderboard data

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway)
```bash
cd backend
railway login
railway up
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Ojesh Jung Thakuri** - Project Lead & Full Stack Developer
- **College Connect Team** - Contributors and maintainers

## 📞 Support

For support, email support@collegeconnect.com or join our [Discord community](https://discord.gg/collegeconnect).

## 🙏 Acknowledgments

- Thanks to all the students who provided feedback
- Inspired by Stack Overflow and other Q&A platforms
- Built with love for the student community

---

**Made with ❤️ for students, by students** 

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/)
