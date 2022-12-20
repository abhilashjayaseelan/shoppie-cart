var express = require('express');
const { response } = require('../app');
const admin_helpers = require('../helpers/admin_helpers');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const { route } = require('./user');

// checking for admin login 
const adminCheck = function(req, res, next){
    if(req.session.admin){
        next();
    }else{
        res.render('admin/login');
    }   
}

router.get('/', adminCheck, function(req, res, next) {
    let admin = req.session.admin;
    productHelpers.getAllProducts().then((products) =>{
        res.render('admin/view-products', {admin: true, products, admin})
    })    
})

// Admin login
router.post('/admin-login', (req, res)=>{
    admin_helpers.adminLogin(req.body).then((response) =>{
        if(response.status){
            req.session.admin = response.admin;
            req.session.admin.loggedIn = true;
            res.redirect('/admin');
        }else{
            req.session.adminloginErr = "Invalid user name or password";
            res.render('admin/login', {"adminErr": req.session.adminloginErr});
            req.session.adminloginErr = false;
        }
    })
})

// admin logout
router.get('/admin-logout', (req, res)=>{
    req.session.admin = null;
    res.redirect('/admin');
})

router.get('/add-product', function(req, res){
    res.render('admin/add-product');
})  

// adding product dettails
router.post('/add-product', function(req, res){
    // console.log(req.body);
    // console.log(req.files.image);
    productHelper.addProduct(req.body,(id) =>{
        let image = req.files.image;
        image.mv('./public/product-images/'+ id +'.jpg', (err, done) =>{
            if(!err){
                res.render('admin/add-products');
            }
            else{
                console.log(err);
            }
        })
        res.render('admin/add-product')
    });
})

// deleting product
router.get('/delete-product/:id', (req, res) =>{
    let prodId = req.params.id;
    // console.log(prodId);
    productHelpers.deleteProduct(prodId).then((response)=>{
        res.redirect('/admin/');
    })
})

// edit products
router.get('/edit-product/:id', async(req, res)=>{
    let product = await productHelpers.getProductDetail(req.params.id)
    res.render('admin/edit-product', {product})
})
  
router.post('/edit-product/:id', (req, res)=>{

    productHelpers.updateProduct(req.params, req.body).then(()=>{
        let id = req.params.id
        res.redirect('/admin');
        if(req.files){
        let image = req.files.image;
        image.mv('./public/product-images/'+ id +'.jpg')
        }
    }) 
})

// All users..
router.get('/view-users', (req, res)=>{
    userHelpers.getAllUsers().then((users)=>{
        res.render('admin/view-users', {users});
    })
})

// Deleting user
router.get('/delete-user/:id', (req, res)=>{
    let userId = req.params.id;
    console.log(userId);
    userHelpers.deleteUser(userId).then((response)=>{
        res.redirect('/admin/view-users');
    })
})

// Edit user
router.get('/edit-user/:id', (req, res)=>{
    userHelpers.getUserDetail(req.params.id).then((user)=>{
        console.log(user);
        res.render('admin/edit-user', {user});
    })
})


router.post('/edit-user/:id', (req, res)=>{
    userHelpers.updateUser(req.params, req.body).then(()=>{
        res.redirect('/admin/view-users');
    })
}) 




module.exports = router;  
 