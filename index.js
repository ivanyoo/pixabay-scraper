const request = require('request');
const API_KEY =  '6523804-fb3da2d38e12b9dc997710e32';
const URL =  `https://pixabay.com/api/?key=${API_KEY}`;

request(URL, (err, response, body) => {
   const hits = JSON.parse(body).hits;
   hits.forEach(hit => {
      console.log(`Webformat URL: ${hit.webformatURL}`);
      console.log(`Tags: ${hit.tags}`)
   });
});