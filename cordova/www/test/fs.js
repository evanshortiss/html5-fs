(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":1}],3:[function(require,module,exports){
'use strict';

var utils = require('./utils')
  , pathm = require('path')
  , fs = require('./fileSystem');

var wrapSuccess = utils.wrapSuccess
  , wrapFail = utils.wrapFail;

exports.getFsInstance = fs.getInstance;

exports.appendFile = function(path, data, callback) {
  fs.writeFile(path, data, callback, true);
};


exports.writeFile = function(path, data, callback) {
  fs.writeFile(path, data, callback, false);
};


exports.readFile = function(path, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {
      encoding: 'utf8'
    };
  }

  var success = wrapSuccess(callback)
    , fail = wrapFail(callback);

  fs.getFile(path, function(err, fileEntry) {
    fileEntry.file(function(file) {
      var reader = new FileReader();

      reader.onloadend = function(evt) {
        success(evt.target.result);
      };

      reader.onerror = function(err) {
        fail(err);
      };

      if (opts.encoding === 'utf8') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }, fail);
  });
};


exports.unlink = function(path, callback) {
  var success = wrapSuccess(callback)
    , fail = wrapFail(callback);

  fs.getFile(path, function(err, file) {
    if (err) {
      fail(err);
    } else {
      file.remove(success, fail);
    }
  });
};


exports.readdir = function(path, callback) {
  var success = wrapSuccess(callback)
    , fail = wrapFail(callback);

  fs.getDirectory(path, function(err, dirEntry) {
    if (err) {
      fail(err);
    } else {
      var directoryReader = dirEntry.createReader();
      directoryReader.readEntries(success, fail);
    }
  });
};


exports.mkdir = function(path, callback) {
  var newFolderName = pathm.basename(path)
    , basePath = pathm.dirname(path)
    , success = utils.wrapSuccess(callback)
    , fail = utils.wrapFail(callback)
    , opts = {
      create: true,
      exclusive: true
    };

  if (basePath === '.') {
    fs.getDirectory(newFolderName, opts, callback);
  } else {
    fs.getDirectory(basePath, function (err, dir) {
      if (err) {
        callback(err, null);
      } else {
        dir.getDirectory(newFolderName, opts, success, fail);
      }
    });
  }
};


/**
 * Remove a directory.
 * The FileSystem API expects directories to be empty but returns a
 * non-informative error on Android and possibly iOS so we check here
 * to ensure users know why directory deletes might fail.
 * @param  {String}   path
 * @param  {Function} callback
 */
exports.rmdir = function(path, callback) {
  var success = wrapSuccess(callback)
    , fail = wrapFail(callback);

  this.readdir(path, function(err, list) {
    if (err) {
      fail(err);
    } else if (list && list.length > 0) {
      fail('ENOTEMPTY: Directory must be empty');
    } else {
      fs.getDirectory(path, function(err, dirEntry) {
        if (err) {
          fail(err);
        } else {
          dirEntry.remove(success, fail);
        }
      });
    }
  });
};


exports.exists = function(path, callback) {
  var fail = wrapFail(callback);

  fs.getFile(path, {
    // Don't create the file, just look for it
    create: false
  }, function(err) {
    // See https://www.chromestatus.com/features/6687420359639040.
    if (err &&
      ((window.FileError && err.code === 1) ||
      (err.name === 'NotFoundError'))) { // NOT FOUND
      // If the file isn't found we don't want an error, pass false!
      callback(false);
    } else if (err) {
      // An actual error occured, pass it along
      fail(err);
    } else {
      callback(true);
    }
  });
};


exports.stat = function(path, callback) {
  var success = wrapSuccess(callback)
    , fail = wrapFail(callback)
    , fn = fs.getFile;

  // TODO: Perhaps check for folder AND file instead, use whichever exists
  if (utils.isDirectory(path)) {
    fn = fs.getDirectory;
  }

  fn(path, function(err, res) {
    if (err) {
      fail(err);
    } else {
      res.getMetadata(success, fail);
    }
  });
};


/**
 * Initialise the file system component for use.
 * @param {Number}     [quota]
 * @param {Function}   callback
 */
exports.init = function(bytes, callback) {
  fs.init(bytes, function(err) {
    if (err) {
      callback(err, null);
    } else {
      fs.getInstance(function(err /*, instance */) {
        callback(err, null);
      });
    }
  });
};

},{"./fileSystem":4,"./utils":5,"path":2}],4:[function(require,module,exports){
'use strict';

var utils = require('./utils')
  , pathm = require('path');

var DEFAULT_QUOTA = (10 * 1024 * 1024); // 10MB

var fileSystem = null;

/**
 * Get a FileSystem instance.
 * @param {Function} callback
 */
exports.getInstance = function(callback) {
  if (fileSystem) {
    callback(null, fileSystem);
  } else {
    init(null, callback);
  }
};


/**
 * Initialises access to browser File System
 * @param {Number}      bytes
 * @param {Function}    callback
 */
var init = exports.init = function(bytes, callback) {
  requestQuota(bytes, function(err, grantedBytes) {
    if (err) {
      return callback(err, null);
    } else {
      requestFileSystem(grantedBytes, function(instance) {
        fileSystem = instance;
        callback(null, grantedBytes);
      }, function(err) {
        callback(err, null);
      });
    }
  });
};


/**
 * Write data to a file optionally appending it.
 * @param {String}      path
 * @param {Mixed}       data
 * @param {Function}    callback
 * @param {Boolean}     append
 */
exports.writeFile = function(path, data, callback, append) {
  var fail = utils.wrapFail(callback)
    , success = utils.wrapSuccess(callback);

  this.getFile(path, {
    create: true,
    exclusive: false
  }, function(err, file) {
    if (err) {
      return callback(err, null);
    } else {
      file.createWriter(function(writer) {
        writer.onwrite = function(/*evt*/) {
          success(file.toURL());
        };

        writer.onerror = function(evt) {
          fail(evt.target.error);
        };

        if (append === true) {
          writer.seek(writer.length);
        }

        if (utils.isMobile()) {
          writer.write(data);
        } else {
          writer.write(new Blob([data]));
        }
      }, fail);
    }
  });
};


/**
 * Get a directory specified by path.
 * By default if the dir does not exist it is not created.
 * @param {String}      path
 * @param {Object}      [opts]
 * @param {Function}    callback
 */
exports.getDirectory = function(path, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {
      create: false
    };
  }

  var success = utils.wrapSuccess(callback)
    , fail = utils.wrapFail(callback);

  fileSystem.root.getDirectory(path, opts, success, fail);
};


/**
 * Get a file at a specified path.
 * By default if the file does not exist it is not created.
 * @param {String}      path
 * @param {Object}      [opts]
 * @param {Function}    callback
 */
exports.getFile = function(path, opts, callback) {
  if (!callback) {
    callback = opts;
    opts = {
      create: false
    };
  }

  var fileName = pathm.basename(path)
    , basePath = pathm.dirname(path)
    , success = utils.wrapSuccess(callback)
    , fail = utils.wrapFail(callback);

  function doGet (dirRef) {
    dirRef.getFile(fileName, opts, success, fail);
  }

  if (basePath === '.') {
    // File is in root directory
    doGet(fileSystem.root);
  } else {
    // Need to get container directory ref for the requested file
    this.getDirectory(basePath, opts, function (err, dir) {
      if (err) {
        callback(err, null);
      } else {
        doGet(dir);
      }
    });
  }
};


/**
 * Request access to the file system.
 * This is called only after quota is granted.
 * @param {Number}       bytes
 * @param {Function}     success
 * @param {Function}     fail
 */
function requestFileSystem(bytes, success, fail) {
  // These are in order of preference due to some being deprecated
  if (window.navigator.webkitRequestFileSystem) {
    window.navigator.webkitRequestFileSystem(bytes, success, fail);
  } else if (window.requestFileSystem) {
    window.requestFileSystem(
      window.LocalFileSystem.PERSISTENT,
      bytes,
      success,
      fail
    );
  } else if (window.webkitRequestFileSystem) {
    window.webkitRequestFileSystem(
      window.PERSISTENT,
      bytes,
      success,
      fail
    );
  } else {
    fail('NO_SUPPORT');
  }
}


/**
 * Request a quota from the FileSystem.
 * @param {Number}     bytes
 * @param {Function}   callback
 */
function requestQuota(quota, callback) {
  // Allow user overide the default quota
  quota = quota || DEFAULT_QUOTA;

  function success(bytes) {
    callback(null, bytes);
  }

  function fail(err) {
    callback(err, null);
  }

  // These are in order of preference due to some being deprecated
  if (navigator.webkitPersistentStorage &&
      navigator.webkitPersistentStorage.requestQuota) {
    navigator.webkitPersistentStorage.requestQuota(quota, success, fail);
  } else if (window.webkitStorageInfo &&
      window.webkitStorageInfo.requestQuota) {
    window.webkitStorageInfo.requestQuota(
      window.PERSISTENT,
      quota,
      success,
      fail
    );
  } else if (window.requestFileSystem) {
    // PhoneGap apps should request a 0 quota
    if (utils.isPhoneGap() === true) {
      quota = 0;
    }

    success(quota);
  } else {
    fail('NO_SUPPORT');
  }
}

},{"./utils":5,"path":2}],5:[function(require,module,exports){
'use strict';

/**
 * Detect is the device a mobile device.
 * @return {Boolean}
 */
exports.isMobile = function() {
  var ua = window.navigator.userAgent;
  return (ua.match(/Android|iPad|iPhone|iPod|Windows Phone/) !== null);
};


/**
 * Determine if this is a PhoneGap application.
 * @return {Boolean}
 */
exports.isPhoneGap = function() {
  // TODO: Improve this...
  var proto = window.location.protocol;
  return (this.isMobile() && proto.indexOf('file') !== -1);
};


/**
 * Determine if FileSystem is supported.
 * @return {Boolean}
 */
exports.supportsFileSystem = function() {
  if (this.isPhoneGap() === true) {
    return true;
  }

  // TODO: Test this works, Opera (WebKit) and Chrome
  return window.navigator.userAgent.match(/Chrome|Opera/);
};


/**
 * Wrap a callback for use as a success callback.
 * @param    {Function} callback
 * @return   {Function}
 */
exports.wrapSuccess = function(callback) {
  return function() {
    var args = [null].concat(Array.prototype.slice.call(arguments));

    callback.apply(callback, args);
  };
};


/**
 * Wrap a callback for use as a failure callback.
 * @param    {Function} callback
 * @return   {Function}
 */
exports.wrapFail = function(callback) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
      , e = args[0];

    callback.apply(callback, [e, null]);
  };
};


/**
 * Check is provided path a directory.
 * @param  {String} path
 * @return {Boolean}
 */
exports.isDirectory = function(path) {
  return (path.lastIndexOf('/') === (path.length - 1));
};

},{}]},{},[3])(3)
});