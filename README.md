# Restie

Restie is a ORM that talks to RESTful interface, rather than database. For Node.js and browsers.

# Installation

Browser (requires jQuery, 2.9kb minified and gzipped):

```html
<!-- jQuery must be included before -->
<script src="restie.min.js"></script>
```

Node.js:

```
npm install restie
```

# Usage

The cute thing about Restie is that you can use it the same way on Node.js and in browsers, without any code changes.

**Initialization**

```javascript
Restie.set({
	urls: {
		base: 'http://localhost:8080' // base URL for all models, can be over-written for each of them
	},
	wrapFields: yes, // post[title] instead of just title field in POST body
	primaryKey: 'id', // primary key
	defaults: { // default headers, fields and querystring params for all requests
		headers: {
			'X-Authorization': '12345'
		},
		fields: {
			'_csrf_token': '12345'
		},
		params: {
			'_csrf_token': '12345'
		}
	}
});
```

**Model Declaration**

```javascript
var Post = Restie.define('Post'); // short way, requests will go to http://localhost:8080/posts

var Post = Restie.define('Post', { // long way
	wrapFields: no // override params for that model
});
```

**Finding all items**

```javascript
Post.all(function(err, posts){ // GET /posts/
	// posts is an array of Post models, so you can manipulate them via ORM-like methods
});
```

**Finding one item**

```javascript
Post.find_by_id(1, function(err, post){ // GET /posts/1
	post.title; // access post's fields just like that
});
```

*Warning*. When you declare primaryKey, Restie looks for it and declares two methods:

- find_by_[primary key] - for underscore lovers
- findBy[primary key] - for underscore haters

So, if you will set 'title' as your primary key, Post model will have these methods available:

- find_by_title
- findByTitle

Support for parameters in find operation will be implemented soon.

**Creating items**

```javascript
// Slow (speed of code writing)

var post = new Post;
post.title = 'New Post';
post.body = 'Content of the post';
post.save(function(err){ // POST /posts
	post.id; // post now has an id field
});

// Faster

var post = new Post({ title: 'New Post', body: 'Content of the post' });
post.save(function(err){ // POST /posts
	post.id;
});

// Fastest

Post.create({ title: 'New Post', body: 'Content of the post' }, function(err, post){ // POST /posts
	post.id;
});
```

**Updating items**

```javascript
Post.find_by_id(1, function(err, post){ // PUT /posts/1
	post.title = 'New title';
	post.save(function(err){
		// post updated
	});
});
```

**Removing items**

```javascript
Post.find_by_id(1, function(err, post){ // DELETE /posts/1
	post.remove(function(err){
		// post removed
	});
});
```

# Tests

Before you run each batch of tests, you should start/restart test application:

```node test/server.js```

Run tests for browser:

```open http://localhost:8080/test.html```

Run tests for Node.js:

```mocha test/nodejs/*```

# Contributing

- Fork
- Write code, build using ```grunt```
- Write tests for that code
- Commit & push
- Send pull request

# License

(The MIT License)

Copyright (c) 2011 Vadim Demedes sbioko@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.