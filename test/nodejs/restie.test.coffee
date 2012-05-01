# Setting up Restie

if not window?
	Restie = require '../../'
	expect = require 'expect.js'

Restie.set
	urls:
		base: 'http://localhost:8080'
	defaults:
		headers:
			'X-Authorization': '12345'
		fields:
			'_csrf_token': '12345'
		params:
			'_csrf_token': '12345'

Post = Restie.define 'Post',
	wrapFields: no
	primaryKey: 'id'

# Tests

describe 'Restie', ->
	describe 'CRUD', ->
		it 'should fetch all posts', (done) ->
			Post.all (err, posts) ->
				expect(posts.length).to.be(0)
				do done
	
		it 'should create post, slow method', (done) ->
			post = new Post
			post.title = 'New post'
			post.body = 'Content'
			post.save ->
				Post.all (err, posts) ->
					expect(posts.length).to.be(1)
					do done
	
		it 'should create post, faster method', (done) ->
			post = new Post title: 'New post', body: 'Content'
			post.save ->
				Post.all (err, posts) ->
					expect(posts.length).to.be(2)
					do done
	
		it 'should create post, fastest method', (done) ->
			Post.create title: 'New post', body: 'Content', (err, post) ->
				Post.all (err, posts) ->
					expect(posts.length).to.be(3)
					do done
	
		it 'should find post', (done) ->
			Post.find_by_id 1, (err, post) ->
				expect(post.title).to.be('New post')
				do done
	
		it 'should update post', (done) ->
			Post.find_by_id 1, (err, post) ->
				post.title = 'New title'
				post.save ->
					Post.find_by_id 1, (err, post) ->
						expect(post.title).to.be('New title')
						do done
	
		it 'should remove post', (done) ->
			Post.find_by_id 1, (err, post) ->
				post.remove ->
					Post.all (err, posts) ->
						expect(posts.length).to.be(2)
						do done