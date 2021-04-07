const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); //crete our new express app
app.use(bodyParser.json()); //wire-up bodyParser middleware to our express app
app.use(cors());
app.use(express.json())

const TAG = 'Query-Service->';
const port = 4002;

const posts ={};   
/*
posts === {
    someId: {
        id: someId,
        title: someTitle,
        comments:[ 
            {id:someOtherId, content: someComment}
        ]
    },

}
 */
app.get('/posts', (req, res) =>{
    res.send(posts);
});

app.post('/events', (req, res) => {
    const {type , data} = req.body;
    if(type === 'PostCreated'){   // req.body.data = {id: '', title: '' }
        const {id , title } = data;
        posts[id] = {id, title , comments: []} ;
    }

    if(type === 'CommentCreated'){
        const {id , content,postId } = data;
        const post = posts[postId];
        post.comments.push( {id, content} );
    }

    console.log(posts);
    res.send({}); // Reply to client: received the event and processd it
});

app.listen(port, () => {
    console.log(TAG, 'Lisening on port', port);
});