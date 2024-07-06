const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const  app = express();
app.use(bodyParser.json());

app.post('/event' ,async (req, res) => {
    const {type , data} = req.body;
    if (type==='createComment'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved'
        await axios.post('http://event-bus-srv:4005/event' , {
            type : 'CommentModerated' ,
            data : {
                id : data.id ,
                postId: data.postId,
                content : data.content,
                status : status
            }
        })
    }
    res.send({});
} )

app.listen(4003,() => {
    console.log('listen on port 4003');
})