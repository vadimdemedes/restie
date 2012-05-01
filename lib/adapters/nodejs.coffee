global.window = {}
require '../../vendor/inflection/inflection.js'
delete global.window

class RequestAdapter
	@request: require 'request'