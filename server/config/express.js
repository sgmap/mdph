/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var bunyan = require('bunyan');
var lusca = require('lusca');
var session = require('express-session');
var connectMongo = require('connect-mongo');
var mongoose = require('mongoose');

var MongoStore = connectMongo(session);

var logger = bunyan.createLogger({
  name: 'impact-dev',
  streams: [
    { stream: process.stdout }
  ],
  serializers: bunyan.stdSerializers
});

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(bodyParser.json({limit: '20mb'}));
  app.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

  var requestLogger = function(req, res, next) {
    var start = new Date();
    var end = res.end;
    res.end = function(chunk, encoding) {
      var responseTime = (new Date()).getTime() - start.getTime();
      end.call(res, chunk, encoding);
      var contentLength = parseInt(res.getHeader('Content-Length'), 10);
      var data = {
        res: res,
        req: req,
        responseTime: responseTime,
        contentLength: isNaN(contentLength) ? 0 : contentLength
      };
      if (env === 'production') {
        logger.info(data, '%s %s %d %dms - %d', data.req.method, data.req.originalUrl, data.res.statusCode, data.responseTime, data.contentLength);
      } else {
        logger.info('%s %s %d %dms - %d', data.req.method, data.req.originalUrl, data.res.statusCode, data.responseTime, data.contentLength);
      }
    };

    req.log = logger;
    next();
  };

  // Lusca depends on sessions
  app.use(session({
    secret: config.secrets.session,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      db: 'impact-session'
    })
  }));

  /**
   * Lusca - express server security
   * https://github.com/krakenjs/lusca
   */
  if (env !== 'test') {
    app.use(lusca({
      csrf: {
        angular: true
      },
      xframe: 'SAMEORIGIN',
      hsts: {
        maxAge: 31536000, //1 year, in seconds
        includeSubDomains: true,
        preload: true
      },
      xssProtection: true
    }));
  }

  var errorLogger = function(err, req, res, next) {
    logger.error({ req: req, res: res, error: err }, err.stack);
    next(err);
  };

  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'dist', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'dist')));
    app.set('appPath', config.root + '/dist');
  }

  if (env === 'development') {
    app.use(require('connect-livereload')());
  }

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(errorHandler()); // Error handler - has to be last
  }

  if (env === 'development' || env === 'production') {
    app.use(requestLogger);
  }
};
