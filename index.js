
//web functions
var express = require("express");
var exphbs = require("express-handlebars");

const request = require('request');

const app = express();


const PORT = process.env.PORT || 5000;

//function for posts
let posts;

function getPosts(url){
  request({url: url, json: true}, (r, body, e) => {
    posts = e;
    countUsers(posts);
  });
}

//function for users
let totalUsers;
function countUsers(list){
  var unique = [];
  for (var i=0; i<posts.length;i++){
    if (!unique.includes(posts[i].userId)){
      unique.push(posts[i].userId);
    }
  }
  totalUsers = unique.length;
}

getPosts("https://jsonplaceholder.typicode.com/posts");

// handler for web
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
// for users
app.get('/', function (req, res){
  res.render('list');
});
//for api functions
app.get('/api/users', (req, res) => {
  res.json(posts);
});

app.get('/api/users/count', (req, res) => {
  res.json({users: totalUsers});
});

app.get('/api/users/:id', (req, res) => {
  const found = posts.some(user => user.userId === parseInt(req.params.id));
    if (found){
      res.json(posts.filter(user => user.userId === parseInt(req.params.id)));
    } else {
      res.status(400).json({message: `no user(s) with the ID og ${req.params.id}`});
    }
});
//for posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
  
});

app.get('/api/posts/count', (req, res) => {
  res.json({posts: posts.length});
});

app.get('/api/posts/:id', (req, res) => {
  const found = posts.some(post => post.id === parseInt(req.params.id));
  if (found) {
    res.json(posts.filter(post => post.id === parseInt(req.params.id)));
  }else{
    res.status(400).json({message: `No posts with the ID of ${req.params.id}`});
  }
});
//app listen on port.
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
