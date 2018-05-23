const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// are these necessary?
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {BlogPost} = require('./models');

// Send back all posts in the database
router.get('/', (req, res) => {
    BlogPost
        .find() 
        .then(posts => {
            res.status(200).send(posts);
        })
        .catch(err => {
            res.status(500).send("there was an error");
        })
});

// Send back a single post
router.get('/:id', (req, res) => {
    BlogPost   
        .findById(req.params.id)
        .then(post => res.json(post.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'something went horribly awry'});
        });
});

// Create new blog posts
router.post('/', (req, res) => {
    console.log(req.body);
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    BlogPost
        .create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        })
        .then(blogPost => res.status(201).json(blogPost.serialize()))
        .catch (err => {
            console.error(err);
            res.status(500).json({error: 'Something went wrong'});
        });
});

// Update the title, content and author fields
router.put('/:id', (req, res) => {
    // if id and body don't match
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }
    
    const updated = {};
    const updateableFields = ['title', 'content', 'author'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    BlogPost
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedPost => res.status(204).end())
        .catch(err => res.status(500).json({message: 'Something went wrong'}));
});

// Delete a post with a given id
router.delete('/:id', (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
        res.status(204).json({message: 'Delete was successful'})
        })
        .catch(err => {
            res.status(500).json({message: 'ID not found'})
        });
});


module.exports = router;