# 🤖 AI Interviewer

A full-stack AI-powered interview practice platform that provides real-time voice interviews with instant AI-generated feedback. Practice job interviews with an intelligent AI interviewer that asks questions sequentially and provides comprehensive scoring across multiple categories.

## 🎯 Project Overview

This platform combines cutting-edge AI technologies to create an immersive interview experience that helps users practice and improve their interview skills through realistic voice conversations and detailed feedback analysis.

## 🎥 Demo

[![AI Interviewer Demo](https://img.youtube.com/vi/GXbgUTFeWxg/0.jpg)](https://youtu.be/GXbgUTFeWxg)

**Watch the full demo on YouTube:** [https://youtu.be/GXbgUTFeWxg](https://youtu.be/GXbgUTFeWxg)

## 🌐 Deployment

The project is deployed on **Vercel** and can be accessed here:  
👉 [Live App](https://interview-4wvnwhjt3-nathan-nguyens-projects-eaa2d459.vercel.app/)


## ✨ Features

### 🔐 Authentication System
- Secure user registration and login with Firebase Authentication
- Persistent user sessions and secure data management
- User profile management and preferences

### 📝 Smart Interview Creation  
- Interactive 5-question setup process for personalized interviews
- AI-powered question generation tailored to:
  - **Job Role**: Specific position requirements
  - **Experience Level**: Entry, Mid-level, Senior positions
  - **Tech Stack**: Relevant technologies and frameworks
  - **Interview Type**: Balance between behavioral and technical questions
  - **Question Count**: Customizable interview length

### 🎤 Real-Time Voice Interview
- Natural voice conversations powered by **Vapi.AI**
- Sequential question delivery with intelligent flow control
- Professional AI interviewer with contextual responses
- Advanced speech recognition and natural language processing
- Real-time feedback and clarification requests

### 📊 Comprehensive AI Feedback
- **Scoring System**: Detailed 100-point evaluation across multiple dimensions
- **Performance Categories**: 
  - Communication Skills
  - Technical Knowledge
  - Problem-Solving Approach
  - Behavioral Responses
  - Overall Presentation
- Powered by **Google Gemini 2.0** for nuanced analysis
- Actionable improvement recommendations
- Historical performance tracking

### 🎨 Modern User Interface
- Built with **shadcn/ui** component library
- Responsive design optimized for desktop and mobile
- Clean, professional aesthetics
- Intuitive navigation and user experience
- Dark/light theme support

### 📈 Personal Dashboard
- **Interview History**: Complete record of all practice sessions
- **Progress Tracking**: Performance trends and improvement metrics
- **Recommended Interviews**: AI-suggested practice topics
- **Analytics**: Detailed insights into strengths and areas for improvement

## 🛠️ Tech Stack

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) **Next.js 14** - Full-stack React framework
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18** - Component-based UI library  
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript** - Type-safe development
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first styling
- ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white) **shadcn/ui** - Modern React components

### Backend & Database
- ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white) **Firebase** - Backend-as-a-Service
  - Firestore for real-time database
  - Authentication service
  - Cloud functions for serverless operations

### AI & Voice Technologies
- ![Vapi.AI](https://img.shields.io/badge/Vapi.AI-FF6B6B?style=flat&logoColor=white) **Vapi.AI** - Voice AI platform for natural conversations
- ![Google](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white) **Google Gemini 2.0** - Advanced AI for question generation and feedback analysis

## 🚀 Quick Start

### Prerequisites
- Node.js
- Firebase account
- Google AI Studio access
- Vapi.AI account

### Installation

```bash
# Clone the repository
git clone https://github.com/Shipapa1/InterviewAi.git

# Navigate to project directory
cd InterviewAi

# Install dependencies
npm install

# Set up environment variables (see below)
# Then start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

## ⚙️ Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Firebase_Private_Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Google AI Configuration  
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key

# Vapi.AI Configuration
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_public_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_assistant_id
```

### 🔧 API Key Setup Guide

#### 1. Firebase Setup
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Authentication** and **Firestore Database**
4. Go to **Project Settings** → **Service Accounts**
5. Generate a new private key and download the JSON file
6. Extract the required fields for your `.env.local`

#### 2. Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key to your environment file

#### 3. Vapi.AI Configuration
1. Sign up at [Vapi.AI](https://vapi.ai/)
2. Create a new voice assistant/workflow
3. Copy your public token and assistant ID
4. Configure voice settings and AI model preferences

## 📱 Usage Guide

### Getting Started
1. **Account Setup**: Register with email/password or social login
2. **Profile Creation**: Complete your profile with interview preferences
3. **Interview Configuration**: Answer setup questions about your target role
4. **Practice Session**: Start your AI-powered voice interview
5. **Review Feedback**: Analyze your performance and improvement areas
6. **Track Progress**: Monitor your development over time

### Interview Flow
1. **Preparation**: Set interview parameters and preferences
2. **Voice Interaction**: Engage in natural conversation with AI interviewer
3. **Question Progression**: Answer questions sequentially with follow-ups
4. **Session Completion**: Receive immediate feedback and scoring
5. **Analysis**: Review detailed performance breakdown

## 🏗️ Project Structure

```
InterviewAi/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── interview/         # Interview components
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── firebase/              # Firebase configuration
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

## ⚠️ Important Notes

### Deployment Limitations
**Live Demo Availability**: The deployed version may be temporarily unavailable due to Vapi.AI's free tier limitations (10 credits). If the voice agent isn't responding, the credits have been exhausted. For uninterrupted access, please run the project locally with your own API credentials.



## 🐛 Known Issues & Roadmap

### Current Limitations
- Vapi.AI free tier credit restrictions
- Limited to English language interviews
- Voice recognition accuracy varies by accent

## 👨‍💻 Developer

**Built by:** [Shipapa1](https://github.com/Shipapa1)

Connect with me:
- GitHub: [@Shipapa1](https://github.com/Shipapa1)
- Email: [Contact](mailto:your-email@example.com)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vapi.AI** for voice AI capabilities
- **Google** for Gemini AI technology
- **Firebase** for backend infrastructure
- **shadcn** for beautiful UI components
- **Vercel** for deployment platform

---

