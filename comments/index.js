const express = require("express");
const bodyParser = require('body-parser');
const axios = require('axios');
const  app = express();
const cors = require('cors');
const {randomBytes} = require("crypto");

app.use(bodyParser.json());
app.use(cors());

const commentPost = {};
app.get('/posts/:id/comments' , (req ,res) =>{
    res.status(200).send(commentPost[req.params.id] || []);
})
app.post('/posts/:id/comments' ,async(req, res)=>{
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentPost[req.params.id] || [];
    comments.push({id: commentId , content : content , status : 'pending'});
    commentPost[req.params.id] = comments;

    await axios.post('http://event-bus-srv:4005/event',{
        type : "createComment" ,
        data : {
            id: commentId ,
            content : content,
            postId : req.params.id,
            status : 'pending'
        }
    })
    res.status(201).send(comments);
})

app.post('/event' , async (req, res) => {
    console.log(req.body.type);
    const {type , data} = req.body;
    if (type==='CommentModerated'){
        const {id , postId , status} = data;
        const comments = commentPost[postId];
        const comment = comments.find(comment => {
            return comment.id===id;
        })
        comment.status=status;
        await  axios.post('http://event-bus-srv:4005/event', {
            type:'CommentUpdated' ,
            data : {
                id,
                postId,
                content: comment.content,
                status
            }
        })
    }
    res.send({});
})

app.listen(4001, () =>{
    console.log("listening on port 4001");
})