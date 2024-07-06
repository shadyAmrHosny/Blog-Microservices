const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  app = express();
const cors = require('cors');
const {randomBytes} = require("crypto");

app.use(bodyParser.json());
app.use(cors());

const post = {};
// app.get("/post" ,(req, res) => {
//     res.send(post);
// });

app.post("/post/create" ,async (req, res)=> {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    post[id] = {
        id , title
    };
    await axios.post('http://event-bus-srv:4005/event', {
        type: 'PostCreated',
        data : {
            id , title
        }
    }).catch((err) => {
        console.log(err.message);
    });
    res.status(201).send(post[id]);
});

app.post('/event' , (req, res) => {
    console.log(req.body.type);
    res.send({});
})

app.listen(4000,()=>{
    console.log("edite")
    console.log("app listening on port 4000")
    }
)