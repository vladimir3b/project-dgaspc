const express = require('express');
const config = require('./../../../../../project.config.json');

const _router = Symbol('_router');
const _getRoutes = Symbol('_getRoutes');
const _parseFrontEndLibraries = Symbol('_parseFrontEndLibraries');
const _frontEndLibraries = Symbol('_frontEndLibraries');

const PAGES = config.pages;


class Router {
  constructor(frontEndLibrariesCDN) {
    this[_router] = express.Router();
    this[_getRoutes]();
    this[_frontEndLibraries] = {
      scriptsTop: this[_parseFrontEndLibraries](frontEndLibrariesCDN, 'script', 'top'),
      scriptsBottom: this[_parseFrontEndLibraries](frontEndLibrariesCDN, 'script', 'bottom'),
      stylesTop: this[_parseFrontEndLibraries](frontEndLibrariesCDN, 'style', 'top'),
      stylesBottom: this[_parseFrontEndLibraries](frontEndLibrariesCDN, 'style', 'bottom')
    }
  }
  get router() {
    return this[_router];
  }

  [_parseFrontEndLibraries](frontEndLibrariesCDN, type, position) {
    type = (type.toLowerCase() === 'script') ? '.js' : 'css';
    return frontEndLibrariesCDN
      .filter(library => {
        return library.positionInHTML === position.toLowerCase() && library.link.slice(-3) === type;
      })
      .map(library => library.link);
  }
  [_getRoutes]() {
    this[_router].get('/', (request, response) => {
      response.render('root.hbs', {
        pageTitle: 'Main menu',
        pages: PAGES,
        ...this[_frontEndLibraries]
      });
    });
    for(let i = 0; i <= PAGES.length - 1; i++) {
      this[_router].get(`/${PAGES[i].route}`, (request, response) => {
        response.render(`pages/${PAGES[i].pageFileName}.hbs`, {
          pageTitle: `${PAGES[i].title}`,
          pageStyle: `${PAGES[i].pageStyle}`,
          pageScript: `${PAGES[i].pageScript}`,
          ...this[_frontEndLibraries]
        });
      });
    }
  }
}


module.exports = Router;