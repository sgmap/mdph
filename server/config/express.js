/**
 * Express configuration
 */
'use strict';

import express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import lusca from 'lusca';
import config from './environment';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import bunyan from 'bunyan';

var MongoStore = connectMongo(session);

var requestLogger = require('bunyan-request')({
  logger: bunyan.createLogger({name: 'impact'}),
});

var fakeLogger = function(req, res, next) {
  req.log = {
    info: console.log,
    error: console.error
  };

  next();
};

export default function(app) {
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

  app.set('appPath', path.join(config.root, 'client'));

  if (env === 'production') {
    app.use(require('express-bunyan-logger')());
    app.use(favicon(path.join(config.root, 'dist', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'dist')));
    app.set('appPath', config.root + '/dist');
  }

  if (env === 'development') {
    app.use(requestLogger);
    app.use(require('connect-livereload')());
  }

  if (env === 'test') {
    app.use(fakeLogger);
  }

  if (env === 'development' || env === 'test') {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(app.get('appPath')));
    app.use(errorHandler()); // Error handler - has to be last
  }
}
