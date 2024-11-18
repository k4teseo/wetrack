# Wetrack: Real-time Currency Conversion and Spending tracker 

### Overview:

WeTrack is tailored for international users who deal with the complexity of managing finances in both foreign and domestic currencies. 
Whether it's converting spending into home currency or understanding spending patterns, WeTrack provides all the necessary tools.
- Target Audience:
   - International individuals and students living abroad.
   - Users managing finances across fluctuating exchange rates and currencies.
- Core Value: Gain insights into spending trends, track daily finances, and navigate fluctuating exchange rates with ease.

## Features: 
- Currency Exchange Rate Scanning: 
  - Fetch live exchange rates using third-party APIs.
  - Convert between popular currencies.
  - Enable users to monitor specific currencies in real time.
- Spending Tracking:
  - Log daily, weekly, or monthly spending manually.
  - Categorize spending into key categories like food, transport, and entertainment.
  - Convert spending into different currencies using the latest exchange rates.
- Spending Analytics:
  - Visualize spending trends over time (daily, weekly, monthly).
  - Get detailed breakdowns by category and time period.
  - Gain personalized insights to make smarter financial decisions.
- User Authentication:
  - Secure authentication using email and password.
  - Provide account recovery options like password reset.
  - Save user preferences and spending history for personalized experiences.
- Data Management
  - Securely store spending data linked to user profiles.
  - Ensure privacy and encryption for all user information.
  - Retain and restore user preferences for easy access.
- Currency Conversion
  - Accurately convert spending across different currencies into a base currency.
  - Use real-time exchange rates to provide precise calculations for analysis.


## Tools and Technologies:

We leveraged modern tools and frameworks to create a seamless and efficient app experience:
- Backend: Django (Python), PostgreSQL.
- Frontend: React Native, JavaScript.
- Develovpemnt:  Git, Postman.
- Mobile App Development: Android Studio (JavaScript-based React Native)

## How we bulit it: 
- Backend (Django):
  - Set up APIs for live currency exchange data using third-party sources.
  - Manage user authentication, data storage, and preferences.
  - Enable secure handling of sensitive user data.
- Frontend (React Native):
  - Designed an intuitive UI for spending tracking and analytics.
  - Integrated backend APIs to fetch live exchange rates and sync user data.
  - Enabled seamless navigation between currency monitoring, spending logs, and analytics.
- Mobile Integration (Android Studio) :
  - Used Android Studio to fine-tune performance and compatibility for Android devices.
  - Built responsive interfaces optimized for mobile screens.


## Getting Started: 
1) Prerequisties:
  - Backend Requirments:
     - Python (Django)
     - PostgreSQL
  - Frontend Rerquirments:
     - Node.js (for React Native)
     - Android Studio (for testing)
       
2) Installation

Backend setup:
  - Clone the repository:
    - git clone <repository_url>
      cd wetrack_backend
  - Install dependicies: 
    - pip install -r requirements.txt
  - Run migrations:
    - python manage.py makemigrations
      python manage.py migrate
  - Start Server:
     - python manage.py runserver

Frontend Setup:
  - Navigate to the frontend Directory:
     - cd wetrack_mobile
  - Install dependicies:
    - npm install
  - Start the develocpment server:
     - npx react-native run-android  

## Final Comments and Acknowledgments

Special thanks to all our friends and family who gave us the motivation to overcome the many challenges
we faced while developing the app. Your encouragement and belief in our vision were the driving forces 
behind our perseverance during tough times.

We are also deeply grateful to the open-source community for providing the tools, libraries, and resources
that enabled us to bring this project to life. Your contributions have been invaluable.

Lastly, we want to acknowledge the constructive feedback and suggestions from our early testers and users,
whose insights helped us refine and improve WeTrack into the powerful tool it is today. Thank you for being part 
of our journey.

- Wetrack Team (Hong,Kate,Sally, and Talal) 
 






