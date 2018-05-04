const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

const blogPostsRouter = require('./blogPostsRouter');

app.use(morgan('common'));

// Where is public?
app.use(express.static('public'));


// sends a response back to the client, which includes the HTML file needed to load the page. That index.html file also points to the static assets found in the public folder
app.get('/', (req, res)=> {
    // Where did this endpoint come from?
    res.sendFile(__dirname + '/views/index.html');
});


app.use('/blog-posts', blogPostsRouter);


app.listen(process.env.PORT || 8084, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8084}`);
});
