import express from 'express';
import { loginUser, createUser } from '../controllers/authController.js';
import { OAuth2Client } from 'google-auth-library';

import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import createToken from '../utils/createToken.js';
dotenv.config();

const server_host = process.env.SERVER_HOST;
const client_host = process.env.CLIENT_HOST;
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;

const authRouter = express.Router();

// normal login, signup routes
authRouter.route('/login').post(loginUser);
authRouter.route('/signup').post(createUser);

// google oAuth2Client
const redirectURL = `${server_host}/api/auth/callback/google`;
const oAuth2Client = new OAuth2Client(google_client_id, google_client_secret, redirectURL);
// get user credential
async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);

  //console.log('response',response);
  const data = await response.json();
  return data;
}

// google auth route
authRouter.post('/google', (req, res) => {
  // consent url
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile email',
    prompt: 'consent',
  });
  res.json({ url: authUrl });
});
authRouter.get('/callback/google', async (req, res) => {
  try {
    const code = req.query.code;

    if (code) {
      const r = await oAuth2Client.getToken(code);
      // Make sure to set the credentials on the OAuth2 client.
      await oAuth2Client.setCredentials(r.tokens);
      const session = oAuth2Client.credentials;

      const userData = await getUserData(session.access_token);

      let currentUser = await User.findOne({ email: userData.email });
      if (!currentUser) {
        currentUser = new User({
          email: userData.email,
          username: userData.given_name,
          password: crypto.randomBytes(32).toString('hex'),
          google_id: userData.sub,
        });
        await currentUser.save();
      }
      if (!currentUser.google_id) {
        currentUser.google_id = userData.sub;
        await currentUser.save();
      }
      await createToken(res, currentUser._id.toString());
    }
  } catch (err) {
    console.log('Error logging in with OAuth2 user');
    console.log(err);
  }

  res.redirect(303, client_host);
});

export default authRouter;
