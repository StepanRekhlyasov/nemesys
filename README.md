# Nemesys Front

Quasar2 / Vue3 / Firebase Authentication (web9)


This app usages
* Quasar2
* Vue3
* Firebase Auth
* Firestore
* Firebase Storage

## Getting started
This project was tested with node v16.16.0
To get started:
1. Clone the repo
2. Install all dependencies
    ```bash
    npm install
    ```
3. Copy `firebaseConfig` json that looks like this to `helpers/firebaseConfig.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "xxxxxxxxxxx",
     authDomain: "xxxxxxxxxx",
     projectId: "xxxxxxxxxx",
     storageBucket: "xxxxxxxx",
     messagingSenderId: "xxxxxxxxx",
     appId: "xxxxxxx"
   };
   ```
4. Start the app
    ```bash
    npm run serve
    ```
