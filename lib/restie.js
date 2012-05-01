// Generated by CoffeeScript 1.3.1
var Model, Restie, setRequestOptions;

Function.prototype.clone = function() {
  var clone, property;
  clone = function() {};
  for (property in this) {
    if (this.hasOwnProperty(property)) {
      clone[property] = this[property];
    }
  }
  clone.prototype = this.prototype;
  return clone;
};

Restie = (function() {

  Restie.name = 'Restie';

  function Restie() {}

  Restie.set = function(options) {
    var key, _results;
    if (options == null) {
      options = {};
    }
    if (!this.options) {
      this.options = {};
    }
    _results = [];
    for (key in options) {
      _results.push(this.options[key] = options[key]);
    }
    return _results;
  };

  Restie.define = function(name, options) {
    var key, model, primaryKey;
    model = Model.clone();
    model.prototype.resourceName = model.resourceName = name.pluralize().toLowerCase();
    model.prototype.options = model.options = {};
    primaryKey = options.primaryKey || 'id';
    model["find_by_" + (options.primaryKey.underscore())] = model["findBy" + (options.primaryKey.camelize())] = model.findByPrimaryKey;
    for (key in this.options) {
      model.prototype.options[key] = model.options[key] = this.options[key];
    }
    model.prototype.model = model.model = model;
    return model;
  };

  return Restie;

})();

setRequestOptions = function(options, request) {
  var field, header, param;
  if (!request.headers) {
    request.headers = {};
  }
  if (!request.form) {
    request.form = {};
  }
  request.qs = !request.params ? {} : request.params;
  if (options.defaults) {
    if (options.defaults.headers) {
      for (header in options.defaults.headers) {
        request.headers[header] = options.defaults.headers[header];
      }
    }
    if (options.defaults.fields) {
      for (field in options.defaults.fields) {
        request.form[field] = options.defaults.fields[field];
      }
    }
    if (options.defaults.params) {
      for (param in options.defaults.params) {
        request.qs[param] = options.defaults.params[param];
      }
    }
  }
  return request;
};

Model = (function() {

  Model.name = 'Model';

  function Model(fields) {
    var key;
    for (key in fields) {
      this[key] = fields[key];
    }
  }

  Model.set = function(options) {
    var key, _results;
    if (options == null) {
      options = {};
    }
    if (!this.options) {
      this.options = {};
    }
    _results = [];
    for (key in options) {
      _results.push(this.options[key] = options[key]);
    }
    return _results;
  };

  Model.bakeModels = function(items) {
    var item, key, model, models, _i, _len;
    models = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      model = new this.model;
      for (key in item) {
        model[key] = item[key];
      }
      models.push(model);
    }
    return models;
  };

  Model.prototype.setRequestOptions = function(request) {
    return setRequestOptions(this.options, request);
  };

  Model.setRequestOptions = function(request) {
    return setRequestOptions(this.options, request);
  };

  Model.all = function(callback) {
    var request, that;
    request = {
      url: "" + this.options.urls.base + "/" + this.resourceName,
      method: 'GET'
    };
    request = this.setRequestOptions(request);
    that = this;
    return Restie.adapter.request(request, function(err, res, body) {
      if (res.statusCode === 200) {
        return callback(false, that.bakeModels(JSON.parse(body)));
      } else {
        return callback(res, []);
      }
    });
  };

  Model.findByPrimaryKey = function(value, callback) {
    var primaryKey, request, that;
    primaryKey = this.options.primaryKey || 'id';
    request = {
      url: "" + this.options.urls.base + "/" + this.resourceName + "/" + value,
      method: 'GET'
    };
    request = this.setRequestOptions(request);
    that = this;
    return Restie.adapter.request(request, function(err, res, body) {
      if (res.statusCode === 200) {
        return callback(false, that.bakeModels([JSON.parse(body)])[0]);
      } else {
        return callback(res, {});
      }
    });
  };

  Model.create = function(fields, callback) {
    var key, model;
    model = new this.model;
    for (key in fields) {
      model[key] = fields[key];
    }
    return model.save(callback);
  };

  Model.prototype.save = function(callback) {
    var fields, key, primaryKey, request, that;
    fields = {};
    for (key in this) {
      if (this.hasOwnProperty(key)) {
        fields[key] = this[key];
      }
    }
    request = {
      url: "" + this.options.urls.base + "/" + this.resourceName,
      method: 'POST'
    };
    if (this.options.wrapFields) {
      key = this.resourceName.singularize();
      request.form = {
        key: fields
      };
    } else {
      request.form = fields;
    }
    primaryKey = this.options.primaryKey || 'id';
    if (fields[primaryKey]) {
      request.url += "/" + fields[primaryKey];
      request.method = 'POST';
      request.form._method = 'PUT';
    }
    request = this.setRequestOptions(request);
    that = this;
    return Restie.adapter.request(request, function(err, res, body) {
      if (res.statusCode === 201 || res.statusCode === 200) {
        body = JSON.parse(body);
        that[primaryKey] = body[primaryKey];
        return callback(false, body);
      } else {
        return callback(res);
      }
    });
  };

  Model.prototype.remove = function(callback) {
    var primaryKey, request;
    primaryKey = this.options.primaryKey || 'id';
    request = {
      url: "" + this.options.urls.base + "/" + this.resourceName + "/" + this[primaryKey],
      method: 'POST',
      form: {
        _method: 'DELETE'
      }
    };
    request = this.setRequestOptions(request);
    return Restie.adapter.request(request, function(err, res) {
      if (res.statusCode === 200) {
        return callback(false);
      } else {
        return callback(res);
      }
    });
  };

  return Model;

})();

Restie.env = typeof window !== "undefined" && window !== null ? 'browser' : 'nodejs';

Restie.adapter = RequestAdapter;

if (Restie.env === 'nodejs') {
  module.exports = Restie;
} else {
  Restie.set({
    urls: {
      base: window.location.host
    }
  });
}