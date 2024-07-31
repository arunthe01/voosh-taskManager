import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')).render(
  //storing here for time being as facing .env file issues on production
    <GoogleOAuthProvider clientId='1080363256091-cl7lm4hbpn126qm17sni31gilp9d7j0v.apps.googleusercontent.com'>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </GoogleOAuthProvider>

)
