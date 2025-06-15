# Software Requirements Specification (SRS) for Wally – AI-Powered Personalized Shopping Assistant

## 1. Introduction

### 1.1 Purpose
This SRS outlines the requirements for "Wally," an AI-powered shopping assistant for a Flipkart hackathon. Wally enhances the online shopping experience by providing a conversational interface (text and voice), personalized product recommendations, AI-generated review summaries, fake review detection, and a Wally Score for product suitability. The system is designed as a Progressive Web App (PWA) to demonstrate a 3–4 minute shopping journey, leveraging Azure services within a $100 credit.

### 1.2 Scope
Wally is a PWA integrated into Flipkart’s ecosystem, offering:
- Text and voice-based interaction (e.g., "Find a gift under ₹1500 for my sister").
- Product recommendations based on budget and preferences.
- AI-summarized product reviews.
- A personalized Wally Score (0–100) for products.
- Fake review detection with trust scores.
- Comparison of top 3 recommended products.
The system uses a mock dataset, Node.js/Express backend, MongoDB, and Azure services (AI Speech, AI Language, Machine Learning). Accessibility and gamification features are excluded to simplify development.

### 1.3 Definitions
- **LLM**: Large Language Model
- **PWA**: Progressive Web App
- **Wally Score**: A personalized product rating (0–100) based on user preferences, budget, and reviews.
- **API**: Application Programming Interface
- **Azure AI Speech**: Azure service for voice-to-text conversion.
- **Azure AI Language**: Azure service for text summarization and sentiment analysis.

### 1.4 References
- Vite Documentation: https://vitejs.dev/
- React Documentation: https://react.dev/
- Azure AI Speech: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/
- Azure AI Language: https://learn.microsoft.com/en-us/azure/ai-services/language/
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Surprise Library: http://surpriselib.com/

## 2. Overall Description

### 2.1 User Needs
- **Customers**: Seek personalized recommendations, trustworthy reviews, and an intuitive interface to reduce choice overload and returns.
- **Flipkart**: Aims to enhance user engagement and reduce return rates with AI-driven personalization.
- **Judges**: Expect a demo showcasing AI, NLP, and voice capabilities with clear customer impact.

### 2.2 Assumptions
- Mock product dataset (100 products, 500 reviews) available.
- Azure for Students ($100 credit) provides access to Azure AI Speech, AI Language, and Machine Learning.
- Stable internet for PWA and API calls.
- Students have basic skills in JavaScript, Python, and web development.

## 3. System Features

### 3.1 Conversational Interface
- **Description**: Users interact via text or voice to express shopping needs (e.g., "Find running shoes under ₹2000").
- **Input**: Text query or audio input.
- **Output**: Natural language response with product recommendations and Wally Scores.
- **Tech**: Azure AI Speech for voice-to-text, Azure AI Language for intent detection.
- **Priority**: High

### 3.2 Personalized Product Recommendations
- **Description**: Suggests top 3 products based on user budget and preferences.
- **Input**: User query, budget, mock preferences (e.g., "sports", "electronics").
- **Output**: Product list with Wally Scores and comparison table.
- **Tech**: Azure Machine Learning with Surprise library for collaborative filtering, MongoDB for user data.
- **Priority**: High

### 3.3 Review Summarization
- **Description**: Generates concise summaries of product reviews.
- **Input**: Product ID, review text.
- **Output**: 2–3 sentence summary of pros and cons.
- **Tech**: Azure AI Language (summarization API).
- **Priority**: Medium

### 3.4 Wally Score
- **Description**: A personalized score (0–100) for each product based on budget fit, user preferences, and review quality.
- **Input**: User preferences, product data, reviews.
- **Output**: Numeric score displayed with products.
- **Tech**: Python (NumPy) script integrated with Node.js.
- **Priority**: High

### 3.5 Fake Review Detection
- **Description**: Identifies fake reviews and assigns a trust score (0–100%).
- **Input**: Review text.
- **Output**: Trust score and flagged suspicious reviews.
- **Tech**: Azure AI Language (sentiment analysis API).
- **Priority**: Medium

### 3.6 Product Comparison
- **Description**: Compares top 3 recommended products by price, features, and reviews.
- **Input**: Product data, user preferences.
- **Output**: Side-by-side comparison table.
- **Tech**: React for frontend rendering, Node.js for data processing.
- **Priority**: Medium

## 4. External Interface Requirements

### 4.1 User Interfaces
- **PWA**: Responsive UI built with Vite + React, optimized for mobile/desktop.
- **Chat Interface**: Minimal chatbox with voice input toggle.
- **Product Display**: Cards with Wally Scores, summaries, and trust scores.
- **Comparison Table**: Dynamic table for top 3 products.

### 4.2 Hardware Interfaces
- Microphone for voice input.
- Web browser (Chrome/Edge) for PWA access.

### 4.3 Software Interfaces
- **Frontend**: Vite + React, Tailwind CSS, Axios, React Router, React Toastify.
- **Backend**: Node.js + Express, Mongoose, JSON Web Token, Winston (logging), Joi (validation), Express Rate Limit.
- **Database**: MongoDB Atlas (free tier, 500 MB).
- **Azure Services**:
  - Azure AI Speech (Speech-to-Text).
  - Azure AI Language (summarization, sentiment analysis).
  - Azure Machine Learning (Surprise for recommendations).
- **Python**: Surprise, NumPy for recommendations and Wally Score.

### 4.4 Communication Interfaces
- HTTPS for secure API communication.
- RESTful APIs for frontend-backend data exchange.
- MongoDB Atlas for cloud database access.

## 5. Non-Functional Requirements

### 5.1 Performance
- Query response time: <2 seconds.
- Recommendation generation: <1 second.
- PWA load time: <3 seconds on 4G networks.

### 5.2 Scalability
- Support 100 concurrent users for demo.
- Modular backend for future feature additions.

### 5.3 Security
- Encrypt user data in MongoDB (Atlas encryption at rest).
- Secure APIs with JWT authentication.
- Rate limiting to prevent abuse (100 requests/minute).

### 5.4 Usability
- Intuitive UI with <3 clicks to recommendations.
- Voice query accuracy: 90%+ for intent detection.

## 6. Tech Stack and Libraries

### 6.1 Frontend
- **Vite + React**: Fast build tool and component-based UI.
- **Libraries**:
  - **React Router**: Navigation.
  - **Axios**: API requests.
  - **Tailwind CSS**: Responsive styling.
  - **React Toastify**: Notifications.
- **Why Chosen**: Vite offers fast builds; Tailwind speeds up UI development.

### 6.2 Backend
- **Node.js + Express**: Scalable API framework.
- **Libraries**:
  - **Mongoose**: MongoDB ORM.
  - **JSON Web Token**: Authentication.
  - **Axios**: Azure API calls.
  - **Winston**: Logging.
  - **Joi**: Input validation.
  - **Express Rate Limit**: API protection.
  - **Python-shell**: Run Python scripts.
- **Why Chosen**: Express is lightweight; libraries enhance security and debugging.

### 6.3 Database
- **MongoDB Atlas**: NoSQL database (free tier, 500 MB).
- **Why Chosen**: Flexible for mock user/product data.

### 6.4 AI and NLP
- **Azure AI Language**:
  - Summarization: Review summaries.
  - Sentiment Analysis: Fake review detection.
- **Azure Machine Learning**:
  - Deploys Surprise for recommendations.
- **Python Scripts**:
  - **Surprise**: Collaborative filtering.
  - **NumPy**: Wally Score calculations.
- **Why Chosen**: Azure services simplify NLP; Surprise is lightweight for recommendations.

### 6.5 Voice Processing
- **Azure AI Speech**: Speech-to-Text for voice queries.
- **Why Chosen**: Free tier (5 hours/month) suits hackathon needs.

### 6.6 DevOps
- **Vite**: Fast frontend builds.
- **ESLint + Prettier**: Code consistency.
- **Vercel**: PWA deployment (free tier).
- **Jest + Supertest**: Unit testing.
- **Swagger**: API documentation.
- **Why Chosen**: Vercel simplifies deployment; Jest ensures reliability.

## 7. Backend Structure

```
wally-backend/
├── config/
│   ├── db.js                # MongoDB connection
│   ├── azure.js             # Azure service credentials
│   ├── app.js               # App-wide settings
├── controllers/
│   ├── chatController.js    # Text/voice query processing
│   ├── productController.js # Product search/recommendations
│   ├── reviewController.js  # Review summarization/fake detection
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   ├── validate.js          # Input validation (Joi)
│   ├── rateLimiter.js       # Rate limiting
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   ├── Review.js            # Review schema
├── routes/
│   ├── chat.js              # Chat/voice routes
│   ├── products.js          # Product/recommendation routes
│   ├── reviews.js           # Review-related routes
│   ├── health.js            # Health check endpoint
├── scripts/
│   ├── recommender.py       # Surprise recommendations
│   ├── wallyScore.py        # Wally Score calculation
│   ├── seed.js              # Mock data seeding
├── tests/
│   ├── chat.test.js         # Chat endpoint tests
│   ├── product.test.js      # Product endpoint tests
│   ├── review.test.js       # Review endpoint tests
├── utils/
│   ├── azureSpeech.js       # Azure AI Speech integration
│   ├── azureLanguage.js     # Azure AI Language integration
│   ├── azureML.js           # Azure Machine Learning integration
│   ├── logger.js            # Winston logging
│   ├── constants.js         # Error codes/messages
├── docs/
│   ├── swagger.yaml         # API documentation
├── .env                     # Environment variables
├── .eslintrc.js             # ESLint config
├── .prettierrc              # Prettier config
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies/scripts
├── README.md                # Setup instructions
├── server.js                # Express server
```

## 8. API Endpoints

### 8.1 Chat Routes (`/api/chat`)
- **POST /query**: Process text/voice query, return recommendations.
- **GET /history**: Retrieve user query history (JWT-protected).

### 8.2 Product Routes (`/api/products`)
- **GET /search**: Search products by query, budget, category.
- **POST /recommend**: Get personalized recommendations with Wally Scores and comparison.
- **GET /:id**: Get product details with Wally Score.

### 8.3 Review Routes (`/api/reviews`)
- **POST /summarize**: Generate review summary for a product.
- **POST /trust**: Calculate trust score and flag fake reviews.

### 8.4 Health Route (`/api/health`)
- **GET /**: Verify backend status.

## 9. Demo Plan

### 9.1 Objective
Showcase Wally’s features in a 3–4 minute video simulating a shopping journey.

### 9.2 Flow
1. **User Query**: "Find a gift under ₹1500 for my sister."
2. **Wally Response**:
   - Suggests 3 products with Wally Scores.
   - Displays comparison table (price, features, reviews).
   - Shows review summaries and trust scores.
3. **User Action**: Adds product to mock cart.

### 9.3 Tools
- **Figma**: UI mockups.
- **OBS Studio**: Screen recording.
- **DaVinci Resolve**: Video editing.

## 10. Constraints
- Hackathon duration: ~48 hours.
- Mock dataset if Flipkart API unavailable.
- Azure credit: $100 (covers Speech, Language, ML).

## 11. Deliverables
- **PWA**: Deployed on Vercel.
- **Source Code**: GitHub repository.
- **Demo Video**: 3–4 minutes.
- **Documentation**: This SRS, Swagger API docs.

## 12. Risks and Mitigation
- **Risk**: Azure setup delays.
  - **Mitigation**: Use Azure quickstart guides, test APIs early.
- **Risk**: Voice accuracy issues.
  - **Mitigation**: Fallback to text input, pre-record demo queries.
- **Risk**: Dataset quality.
  - **Mitigation**: Curate small, realistic mock dataset (100 products, 500 reviews).
- **Risk**: API quota limits.
  - **Mitigation**: Pre-compute summaries/trust scores, use free tiers.

## 13. Cost Management ($100 Azure Credit)
- **Azure AI Speech**: $0–$1 (1 hour, free tier).
- **Azure AI Language**: $0 (500 reviews in free tier).
- **Azure Machine Learning**: $10–$15 (20 hours compute).
- **Total**: ~$10–$16, leaving ~$84 buffer.
- **Optimization**: Shut down ML instances, cache results.

## 14. Development Plan (48 Hours)
- **Team**: 4–6 students (2 frontend, 1–2 backend, 1–2 AI/recommendations).
- **Phase 1: Setup (0–4 hours)**:
  - Initialize Vite + React, Node.js + Express.
  - Configure MongoDB Atlas, Azure services.
  - Seed mock data (10 users, 100 products, 500 reviews).
- **Phase 2: Core Development (4–28 hours)**:
  - Frontend: Build chat UI, product cards, comparison table (12 hours).
  - Backend: Develop APIs, integrate Azure (10 hours).
  - AI: Deploy Surprise on Azure ML, use Azure AI Language (12 hours).
- **Phase 3: Integration/Testing (28–40 hours)**:
  - Connect frontend-backend, test APIs, optimize performance.
- **Phase 4: Demo/Deployment (40–48 hours)**:
  - Deploy to Vercel, record demo, prepare submission.

## 15. Future Enhancements
- Integrate Flipkart API for real-time product data.
- Add accessibility mode for visually impaired users.
- Introduce gamification with style points.