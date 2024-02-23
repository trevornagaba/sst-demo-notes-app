import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from "react-router-dom";
import { Amplify } from "aws-amplify";
import config from "./config.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'

// Configure AWS Amplify

// 1. Amplify refers to Cognito as Auth, S3 as Storage, and API Gateway as API.
// 2. The mandatorySignIn flag for Auth is set to true because we want our users to be signed in 
//    before they can interact with our app.
// 3. The name: "notes" is basically telling Amplify that we want to name our API. 
//    Amplify allows you to add multiple APIs that your app is going to work with. 
//    In our case our entire backend is just one single API.
// 4. The Amplify.configure() is just setting the various AWS resources that we want to interact with. 
//    It isn’t doing anything else special here beside configuration. 
//    So while this might look intimidating, just remember this is only setting things up.

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Router>
    <App />
  </Router>
</React.StrictMode>,
)