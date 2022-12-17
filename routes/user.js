var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

// for checking user login 
const loginCheck = function(req, res, next){
    if(req.session.user){
        next();
    }else{
        res.redirect('/login');
    }
}
/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.session.user;
    productHelper.getAllProducts().then((products) =>{
        res.render('user/view-products', { products, admin:false, user });
    })
});

router.get('/login', function(req, res){
    if(req.session.loggedIn){
        res.redirect('/');
    }else{
        res.render('user/login', {'loginErr': req.session.loginErr});
        req.session.loginErr = false;
    }
})

router.get('/signup', function(req, res){
    res.render('user/signup');
})

router.post('/signup', (req, res) =>{
    userHelpers.doSignup(req.body).then((response)=>{
        
    })
})

// user login 
router.post('/login', (req, res)=>{
    userHelpers.doLogin(req.body).then((reponse) =>{
        if(reponse.status){
            req.session.loggedIn = true;
            req.session.user = reponse.user;
            res.redirect('/');
        }else{
            req.session.loginErr = "Invalid user name or password";
            res.redirect('/login');
        }
    })
})

// user logout
router.get('/logout', (req, res)=>{
    req.session.destroy();
    res.redirect('/');
})

// to cart 
router.get('/cart', loginCheck, (req, res) =>{
    res.render('user/cart');
})

module.exports = router;  
