'use strict';

var ERRORS = require('./errors');

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
      , e = args[0]
      , msg = '';

    // Modified version of html5 rocks error handler
    switch (e.code) {
      case window.FileError.QUOTA_EXCEEDED_ERR:
        msg = ERRORS.QUOTA_EXCEEDED_ERR;
        break;
      case window.FileError.NOT_FOUND_ERR:
        msg = ERRORS.NOT_FOUND_ERR;
        break;
      case window.FileError.SECURITY_ERR:
        msg = ERRORS.SECURITY_ERR;
        break;
      case window.FileError.INVALID_MODIFICATION_ERR:
        msg = ERRORS.INVALID_MODIFICATION_ERR;
        break;
      case window.FileError.INVALID_STATE_ERR:
        msg = ERRORS.INVALID_STATE_ERR;
        break;
      default:
        msg = ERRORS.UNKNOWN_ERROR;
        break;
    }

    callback.apply(callback, [msg, null]);
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
