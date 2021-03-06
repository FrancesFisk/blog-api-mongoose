'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use(morgan('common'));
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true })); 
// app.use(bodyParser.json())
app.use('/blog-posts', blogPostsRouter);



let server;

// this function connects to our database then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. 
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = { runServer, app, closeServer };
