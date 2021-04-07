const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();//create new express app
app.use(bodyParser.json() );  //associate bodyParser middaleware with this app

const portListener = 4005;
const TAG = "event-bus->";
const postUrl =     'http://localhost:4000/events';
const commentsUrl = 'http://localhost:4001/events';  
const queryUrl = 'http://localhost:4002/events';  


app.post("/events",(req, res) => {
    const event = req.body;
    
    axios.post(postUrl , event);
    axios.post(commentsUrl , event);
    axios.post(queryUrl , event);

    res.send({status: 'OK' });
});

app.listen(portListener, () =>{
    console.log(TAG," Listening On port ", portListener);
} )