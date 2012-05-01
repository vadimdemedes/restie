fs = require 'fs'
async = require 'async'
uglify = require 'uglify-js'
{exec} = require 'child_process'

compileAllCode = (done) ->
	exec "coffee -cb #{ __dirname }/lib", (err, stdout, stderr) ->
		do done

buildSource = (filenames, callback) ->
	compileAllCode ->
		source=
			original: ''
			compressed: ''
		async.forEachSeries filenames, (filename, nextFilename) ->
			fs.readFile "#{ __dirname }/lib/#{ filename }", 'utf8', (err, code) ->
				source.original += "#{ code }\n\n"
				do nextFilename
		, ->
			ast = uglify.parser.parse source.original
			ast = uglify.uglify.ast_mangle(ast)
			ast = uglify.uglify.ast_squeeze(ast)
			source.compressed = uglify.uglify.gen_code(ast)
			callback source

compileForBrowser = (done) ->
	buildSource ['../vendor/inflection/inflection.js', 'adapters/jquery.js', 'restie.js'], (source) ->
		fs.writeFile "#{ __dirname }/build/browser/restie.js", source.original, 'utf8', ->
			fs.writeFile "#{ __dirname }/build/browser/restie.min.js", source.compressed, 'utf8', ->
				do done

compileForNodejs = (done) ->
	buildSource ['adapters/nodejs.js', 'restie.js'], (source) ->
		fs.writeFile "#{ __dirname }/build/nodejs/restie.js", source.original, 'utf8', ->
			do done

desc 'Compiles all source code'
task 'build:all', ->
	async.parallel [compileForBrowser, compileForNodejs], ->
		do complete
, { async: yes }

desc 'Compiles for browser'
task 'build:browser', ->
	compileForBrowser complete
, { async : yes }

desc 'Compiles for Node.js'
task 'build:nodejs', ->
	compileForNodejs complete
, { async: yes }

desc 'Cleans all builds'
task 'build:clean', ->
	exec "rm #{ __dirname }/build/browser/* && rm #{ __dirname }/build/nodejs/*", ->
		do complete
, { async: yes }

desc 'Run Node.js tests'
task 'test:nodejs', ->
	server = exec "node #{ __dirname }/test/server.js", ->
		compileForNodejs ->
			exec "mocha #{ __dirname }/test/nodejs/*", (err, stdout) ->
				console.log stdout
				do server.kill
				do complete
, { async: yes }

desc 'Run browser tests'
task 'test:browser', ->
	exec "open http://localhost:8080/test.html", ->
		do complete
, { async: yes }