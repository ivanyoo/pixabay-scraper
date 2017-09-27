const request = require('request');
const async = require('async');
const mysql = require('mysql');
const config = require('./config.json');
const perPage = 100;
const total = 10000;
let page = 1;
async.whilst(() => {
  // run for total amount of images
  return page * perPage <= total;
}, (callback) => {
  // api call
  let URL =  `https://pixabay.com/api/?key=${config.API_KEY}&page=${page}&per_page=${perPage}`;
  request(URL, (err, response, body) => {
    let values = [];
    async.series([
      (next) => {
        const hits = JSON.parse(body).hits;
        async.each(hits, (hit, nextHit) => {
          // for each image put their webformatURL and tags(keywords) in array
          values.push(`("${hit.webformatURL}","${hit.tags}")`);
          nextHit();
        }, next);
      },
      (next) => {
        // store in database
        const connection = mysql.createConnection(config.AWS_DB);
        connection.connect();
        connection.query(`INSERT INTO pixabay_images (webformatURL, tags) VALUES ${values.toString()}`, (err, results) => {
          connection.end();
          if (err) {
            console.log(err);
            return next(err);
          }
          next();
        });
      }
    ], (err) => {
      if (err) {
        return callback(err);
      }
      page++;
      console.log(`Done ${(page * perPage) - 100}`);
      callback();
    });
  });
}, (err) => {
  console.log(err);
  console.log('done');
});
