const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const port = 4001;
const TAG  = "Comments Service -> ";
const app = express();  // create my express aplication
const commentsByPostId = {};

app.use(bodyParser.json() );
app.use(cors());


app.get('/posts/:id/comments',(req , res) => { 
    res.send( commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments',async (req, res) => { 
    const commentId  = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [] ;
    comments.push( {id: commentId, content });
    commentsByPostId[req.params.id] = comments;

    const eventsUrl = 'http://localhost:4005/events';
    await axios.post(eventsUrl, {
        type: 'CommentCreated',
        data:{
          id: commentId, 
          content,
          postId: req.params.id
        }
    });
    res.status(201).send(comments);

});

app.post('/events', (req, res) =>{
    console.log(TAG, 'Received Event with type' , req.body.type );
    res.send({});
});

app.listen(port, () =>{
   console.log(TAG, 'lisenting on port ', port ) ;
});