// Based on https://www.youtube.com/watch?v=L72fhGm1tfE&t=827s
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const handlebars = require('express-handlebars');

const config = require('./../../../../project.config.json');
const Router = require('./routes');

// Private methods and properties in javascript
// https://medium.com/@davidrhyswhite/private-members-in-es6-db1ccd6128a5
const _serverSettings = Symbol('_serverSettings');
const _application = Symbol('_application');
const _config = Symbol('_config');
const _routes = Symbol('routes');


class WebServer {
  constructor() {
    this[_application] = express();
    this[_config] = config;
    this[_config].publicPath = path.join(__dirname, './../../../', this[_config].publicPath);
    this[_config].viewPath = path.join(__dirname, './../', this[_config].viewPath);
    // this[_frontEndLibrariesCDN] = this[_config].frontEndLibrariesCDN;
    this[_routes] = new Router(this[_config].frontEndLibrariesCDN);
  }

  [_serverSettings] () {
    this[_application].use(express.static(this[_config].publicPath));
    this[_application].use(favicon(path.resolve(__dirname, './../favicon.ico')));
    // setting view engine
    this[_application].engine('hbs', handlebars({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutsDir: path.resolve(this[_config].viewPath, 'layouts')
    }));
    this[_application].set('views', this[_config].viewPath);
    this[_application].set('view engine', 'hbs');
    // loading routes
    this[_application].use('/', this[_routes].router);
    // 404 - page not found
    this[_application].use((request, response, next) => {
      response.render('page-not-found', {
        pageTitle: 'Page not found...'
      });
    });
  }
  initialize() {
    this[_serverSettings]();
    this[_application]
      .listen(this[_config].port, () => console.log(`Server is listening on port ${ this[_config].port }...`))
      .on('error', (error) =>  {
        console.error(error.message);
        process.exit(0);
      });
  }
}


module.exports = new WebServer();