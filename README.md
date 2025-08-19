# collegeconnect AI – AI-Powered Peer-to-Peer Doubt Solving Platform

## 🎯 Problem Statement
Many students in India, especially in Tier 2/3 cities, face challenges in getting timely and accurate answers to their academic doubts. Traditional tutoring is expensive, and online communities are often slow or unreliable.

## 🚀 Our Solution
collegeconnect AI is a web-based platform that allows students to:
- Ask academic questions
- Receive instant AI-generated answers using GPT-4o or Gemini
- Interact with peer answers for collaborative learning

## ✨ Unique Features
- AI + peer collaboration in one platform
- Interactive, animated, and mobile-friendly UI
- Tracks questions and answers for personalized learning
- 20-word AI answer limit for quick consumption

## 🛠️ Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, JWT authentication
- **Database:** MongoDB (Atlas or local)
- **AI:** OpenAI GPT-4o / Google Gemini

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- OpenAI API key or Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd edu-mitra
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Access the app**
Open http://localhost:3000

## 📁 Project Structure
```
edu-mitra/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🔧 Environment Variables
Create `.env` in backend folder:
```
MONGO_URI=mongodb://localhost:27017/collegeconnect
OPENAI_API_KEY=your-openai-key
JWT_SECRET=your-jwt-secret
PORT=5000
```

## 🎨 Features
- **Responsive Design:** Works on all devices
- **Animations:** Smooth transitions with Framer Motion
- **Theme:** Pink + Light Blue color scheme
- **Real-time:** Instant AI responses
- **Collaborative:** Peer answers and interactions

## 🔮 Future Enhancements
- Chat history and notifications
- Points & gamification system
- Multi-language support
- Mobile app with React Native
