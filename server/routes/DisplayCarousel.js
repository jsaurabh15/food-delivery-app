const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const getRandomImageUrl = async (query) => {
  const width = 900;
  const height = 700;
  const apiKey = process.env.UNSPLASH_API;

  const response = await fetch(`https://api.unsplash.com/search/photos?client_id=${apiKey}&query=${query}&orientation=landscape&w=${width}&h=${height}`);
  const data = await response.json();
  const randomIndex = Math.floor(Math.random() * data.results.length);
  return data.results[randomIndex].urls.regular;
};

app.get('/random-images', async (req, res) => {
  try {
    const images = await Promise.all([
      getRandomImageUrl('burger'),
      getRandomImageUrl('pizza'),
      getRandomImageUrl('french fries')
    ]);
    res.json(images);
  } catch (error) {
    console.error('Error fetching random images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

module.exports = getRandomImageUrl;

