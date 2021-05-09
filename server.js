import express from 'express';

import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const Ax = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
  auth: {
    username: 'shiruken1',
    password: process.env.GH_TOKEN
  }
});

const app = express();

app.listen(3333); // CRA's HMR uses 3000
app.use(cors());

app.get('/search', async function(req,res){
  const { query: { q } } = req;
  const response = await Ax('search/issues?q='+q+'%26repo%3Afacebook/react');

  res.send(response.data || null);
});

console.log('We\'re live!');