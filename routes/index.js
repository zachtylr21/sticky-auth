var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var expressSession = require('express-session');
var Sticky = mongoose.model('Sticky');
var users = require('../controllers/users_controller');

router.get('/sticky', function(req, res, next) {
  console.log("in get");
  Sticky.find(function(err, sticky) {
    console.log("in get again");
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.post('/sticky', function(req, res, next) {
  var sticky = new Sticky(req.body);
  sticky.save(function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.param('sticky', function(req, res, next, id) {
  var query = Sticky.findById(id);
  query.exec(function(err, sticky) {
    if (err) { return next(err); }
    if (!sticky) { return next(new Error("can't find sticky")); }
    req.sticky = sticky;
    return next();
  });
});

router.put('/sticky/:sticky/color', function(req, res, next) {
  req.sticky.changeColor(req.color, function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.put('/sticky/:sticky/size', function(req, res, next) {
  req.sticky.changeSize(req.body.height, req.body.width, function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.put('/sticky/:sticky/loc', function(req, res, next) {
  req.sticky.changeLoc(req.body.top, req.body.left, function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.put('/sticky/:sticky/text', function(req, res, next) {
  req.sticky.changeText(req.body.text, function(err, sticky) {
    if (err) { return next(err); }
    res.json(sticky);
  });
});

router.delete('/sticky/:sticky', function(req, res) {
  req.sticky.remove();
  res.sendStatus(200);
});

router.delete('/sticky', function(req, res, next) {
  Sticky.remove(function(err){
    if(err) {return next(err)}
    res.sendStatus(200);
  });
  
});

console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
      console.log("/ Route if user");
      res.render('index', {username: req.session.username,
                           msg:req.session.msg,
                           color:req.session.color});
    } else {
      console.log("/ Route else user");
      req.session.msg = 'Access denied!';
      res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
      res.redirect('/');
    }
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
      res.redirect('/');
    }
    res.sendFile('auth.html');
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });
router.post('/signup', users.signup);
router.post('/login', users.login);

module.exports = router;
