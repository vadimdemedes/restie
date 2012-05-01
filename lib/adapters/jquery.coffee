class RequestAdapter
	@request: (options, callback) ->
		if options.method is 'GET'
			for key of options.form
				if options.qs[key] and options.qs[key] is options.form[key]
					delete options.qs[key]
		$.ajax
			url: "#{ options.url }?#{ $.param(options.qs) }"
			data: options.form
			type: options.method
			headers: options.headers
			complete: (xhr) ->
				callback no, { statusCode: xhr.status, body: xhr.responseText }, xhr.responseText