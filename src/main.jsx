// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { msalInstance, initializeMsal } from './services/msalConfig.js'

// initializeMsal(); // Handle login redirect

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <MsalProvider instance={msalInstance}>
//     <App />
//     </MsalProvider>
//   </StrictMode>,
// )

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./services/AuthProvider";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
);