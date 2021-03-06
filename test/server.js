// Generated by CoffeeScript 1.3.1
var app, express, posts, protection;

express = require('express');

protection = function(req, res, next) {
  if (req.headers['x-authorization'] === '12345' && req.query['_csrf_token'] === '12345' && (req.method === 'GET' ? true : req.body['_csrf_token'] === '12345')) {
    return next();
  } else {
    return res.end();
  }
};

app = express.createServer(express["static"]("" + __dirname + "/browser"), express["static"](require('fs').realpathSync("" + __dirname + "/../dist")), express.bodyParser(), express.methodOverride(), protection);

posts = [];

app.get('/posts', function(req, res) {
  return res.send(JSON.stringify(posts));
});

app.get('/posts/:id', function(req, res) {
  var post, _i, _len;
  for (_i = 0, _len = posts.length; _i < _len; _i++) {
    post = posts[_i];
    if (parseInt(post.id) === parseInt(req.params.id)) {
      return res.send(JSON.stringify(post));
    }
  }
  return res.end();
});

app.put('/posts/:id', function(req, res) {
  var post;
  post = {
    title: req.body.title,
    body: req.body.body,
    id: req.params.id
  };
  posts[0] = post;
  return res.send(JSON.stringify(post));
});

app.post('/posts', function(req, res) {
  var post;
  post = {
    title: req.body.title,
    body: req.body.body,
    id: posts.length + 1
  };
  posts.push(post);
  return res.send(JSON.stringify(post));
});

app.del('/posts/:id', function(req, res) {
  var newPosts, post, _i, _len;
  newPosts = [];
  for (_i = 0, _len = posts.length; _i < _len; _i++) {
    post = posts[_i];
    if (parseInt(post.id) !== parseInt(req.params.id)) {
      newPosts.push(post);
    }
  }
  posts = newPosts;
  return res.end();
});

app.listen(8080);
