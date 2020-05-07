var express = require('express');
var router = express.Router();

// Require controller modules.
var book_controller = require('../controllers/bookController');


// GET catalog home page.
router.get('/', book_controller.index);

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});      */

module.exports = router;
