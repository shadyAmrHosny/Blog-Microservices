const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios');
const app = express();

app.use(bodyParser.json());

const events= [];

app.post('/event' , (req, res) =>{
    const event = req.body;
    events.push(event);
    axios.post('http://post-clusterip-srv:4000/event', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://comments-clusterip-srv:4001/event', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://query-clusterip-srv:4002/event', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://moderation-clusterip-srv:4003/event', event).catch((err) => {
        console.log(err.message);
    });

    res.send({status:'OK'});
})

app.get('/event' ,(req, res) => {
    res.send(events);
})

app.listen(4005,()=>{
    console.log("listen in port 4005");
})
