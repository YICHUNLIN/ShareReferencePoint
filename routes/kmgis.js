var express = require('express');
var api = express.Router();
const path = require('path');
const lib = require('../lib');
const points = require('./db_points.json');
let indexPage = path.join(__dirname + '/index.html');

/**
 * 製造 hash table
 */
var dictPoints = {};
points.forEach(point => {
  dictPoints[point.name] = point;
});

const distance = (p1, p2) => {
  const v1 = p1.x - p2.x;
  const v2 = p1.y - p2.y;
  return Math.sqrt(v1 * v1 + v2 * v2);
};

api.get('/',
  (req, res, next) => {
    if (!req.query.hasOwnProperty('name')) return res.status(404).json({code: 404, message: `not found point parameter 'name'`});
    if (!dictPoints.hasOwnProperty(req.query.name)) return res.status(404).json({code: 404, message: `not found point '${req.query.name}'`});
    next();
  },
(req, res) => {
  return res.status(200).json({code: 200, data: dictPoints[req.query.name]});
});

api.get('/all', (req, res) => {
  return res.status(200).json({code: 200, data: points});
});

api.get('/twd97_nearby', 
  (req, res, next) => {
    if (!req.query.hasOwnProperty('x') || !req.query.hasOwnProperty('y')) return res.status(400).json({code: 400, message: `?x=xx.xxx&y=oo.oo`})
    if (!req.query.hasOwnProperty('scope')) return res.status(400).json({code: 400, message: 'ex: &scope=5'})
    next();
  },
(req, res) => {
  const ori = {x: req.query.x, y: req.query.y};
  const scope = parseFloat(req.query.scope)
  const result = [];
  points.forEach(point => {
    if (distance(point.twd97, ori) - scope < 1) {
      result.push(point);
    }
  });
  return res.status(200).json({code: 200, count: result.length, ori, data: result})
})

/**
 * 
 */
api.get('/wgs84totwd97', 
  (req, res, next) => {
    if (!req.query.hasOwnProperty('lat') || !req.query.hasOwnProperty('lng')) return res.status(400).json({code: 400, message: `?lat=xx.xxx&lng=oo.oo`})
    next();
  },
(req, res) => {
  const result = lib.Proj4js.WGS84ToTwd97(parseFloat(req.query.lng), parseFloat(req.query.lat));
  return res.status(200).json({x: result.x, y: result.y});
});

/**
 * 
 */
api.get('/twd97towgs84', 
  (req, res, next) => {
    if (!req.query.hasOwnProperty('x') || !req.query.hasOwnProperty('y')) return res.status(400).json({code: 400, message: `?x=xx.xxx&y=oo.oo`})
    next();
  },
(req, res) => {
  return res.status(200).json(lib.Proj4js.Twd97ToWGS84(parseFloat(req.query.x), parseFloat(req.query.y)));
});
module.exports = api;
