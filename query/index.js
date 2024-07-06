const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts= {};

app.get('/post/all' , (req, res) => {
    res.send(posts);
})
const handelEvent=(type , data) => {
    if (type==='PostCreated') {
        const {id , title} = data;
        posts[id] = {id,title, comments:[]}
    }
    if (type==='createComment'){
        const {id , content , postId , status} = data;
        const post = posts[postId];
        post.comments.push({id,content,status});
    }
    if (type==='CommentUpdated') {
        const {id , content , postId , status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment =>{
            return comment.id ===id;
        })
        comment.content = content;
        comment.status =status;
    }
}
app.post('/event' , (req, res) => {
    const {type , data} = req.body;
    handelEvent(type,data);
    res.send({});
})
app.listen(4002,async () => {
    console.log('listen on port 4002')
    const res = await axios.get('http://event-bus-srv:4005/event')
    for (let event of res.data){
        console.log('Processing event:' , event.type)
        handelEvent(event.type , event.data);
    }
})