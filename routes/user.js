var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
    productHelper.getAllProducts().then((products) =>{
        res.render('user/view-products', { products, admin:false });
    })
});

router.get('/login', function(req, res){
    res.render('user/login');
})

router.get('/signup', function(req, res){
    res.render('user/signup');
})

router.post('/signup', (req, res) =>{
    userHelpers.doSignup(req.body).then((response)=>{
        
    })
})

router.post('/login', (req, res)=>{
    userHelpers.doLogin(req.body).then((reponse) =>{
        if(reponse.status){
            res.redirect('/');
        }else{
            res.redirect('/login');
        }
    })
})

module.exports = router;  
