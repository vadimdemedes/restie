# Setting up test Express app

express = require 'express'
protection = (req, res, next) ->
	if req.headers['x-authorization'] is '12345' and req.query['_csrf_token'] is '12345' and (if req.method is 'GET' then yes else req.body['_csrf_token'] is '12345')
		do next
	else
		do res.end
app = express.createServer express.static("#{ __dirname }/browser"), express.static(require('fs').realpathSync("#{ __dirname }/../dist")), express.bodyParser(), express.methodOverride(), protection
posts = [] # data store

app.get '/posts', (req, res) ->
	res.send JSON.stringify posts

app.get '/posts/:id', (req, res) ->
	for post in posts
		if parseInt(post.id) is parseInt(req.params.id)
			return res.send JSON.stringify post
	
	do res.end

app.put '/posts/:id', (req, res) ->
	post=
		title: req.body.title
		body: req.body.body
		id: req.params.id
	
	posts[0] = post
	res.send JSON.stringify post

app.post '/posts', (req, res) ->
	post=
		title: req.body.title
		body: req.body.body
		id: posts.length + 1
	
	posts.push post
	res.send JSON.stringify post

app.del '/posts/:id', (req, res) ->
	newPosts = []
	for post in posts
		newPosts.push post if parseInt(post.id) != parseInt(req.params.id)
	
	posts = newPosts
	do res.end

app.listen 8080