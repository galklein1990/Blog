const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express(); // create new express application
app.use(bodyParser.json());  // for req.body to be shown a properly
app.use(cors());  // wire it up to our express application as middleware


const TAG = "Posts Service->";
const port = 4000;
const posts = {};


//set out get    route handler(callback is the route handler)
//Retrieve All posts
app.get('/posts', (req, res) => {
    res.send(posts);
});
 
// handle Post Req to source(path) /posts/'. Goal: to Create a new post 
app.post('/posts/',async (req, res) => {
    const id = randomBytes(4).toString('hex');  // 4 Bytes in hex
    const { title }  = req.body;
    //console.log("title = ", title["title"] );
    posts[id] = {
        id , title
    };
    
    const eventsUrl =     'http://localhost:4005/events';
    await axios.post(eventsUrl,{
        type: 'PostCreated',
        data:{
            id, title
        }
    });

    res.status(201).send(posts[id]);  //201 status: indicate we just created a resource
});

app.post('/events', (req, res) =>{
    console.log(TAG, 'Received Event with type' , req.body.type );
    res.send({});
});
app.listen(port,() => {
    console.log(TAG, 'Listening on port ', port);
});
//