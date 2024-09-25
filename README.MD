# Chat Application

This is a real-time chat application built using React Native, Firebase, and Expo. It allows users to send messages, images, and their current location.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features
- Real-time messaging
- Send images and locations
- Anonymous user sign-in
- Caching of messages for offline usage
- User-friendly interface

## Technologies Used
- React Native
- Firebase (Firestore, Storage, Authentication)
- Expo
- React Navigation
- AsyncStorage
- Gifted Chat

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/chat-app.git

2. **Navigate into the project directory:
   ```bash
   cd chat-app

3. Install the required dependencies:
   ```bash
   npm install

## Setup
1. Create a Firebase Project:
- Go to the Firebase Console.
- Create a new project.
- Add a Web app to the project and copy the Firebase configuration settings.

2. Set up Firestore and Storage:
- In your Firebase console (console.firebase.google.com), navigate to Firestore Database and create a new database.
- Navigate to Storage and set up Firebase Storage.

3. Create the .env file:
- In the root of your project, create a file named .env.
- Add the following lines, replacing with your Firebase project settings:
   ```bash
   API_KEY=your_api_key
   AUTH_DOMAIN=your_project_id.firebaseapp.com
   PROJECT_ID=your_project_id
   STORAGE_BUCKET=your_project_id.appspot.com
   MESSAGING_SENDER_ID=your_messaging_sender_id
   APP_ID=your_app_id
- Make sure to replace the placeholders with your actual Firebase configuration values.

## Usage
1. Run the application
   ```bash
   npm run start

2. Open the Expo app on your mobile device or emulator:
- Scan the QR code displayed in your terminal or browser to run the app on your device.


##Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## Licensing
This project is licensed under the MIT License.