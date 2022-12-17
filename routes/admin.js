var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
    productHelpers.getAllProducts().then((products) =>{
        console.log(products);
        res.render('admin/view-products', {admin: true, products})
    })     
});

router.get('/add-product', function(req, res){
    res.render('admin/add-product');
})

router.post('/add-product', function(req, res){
    // console.log(req.body);
    // console.log(req.files.image);
    productHelper.addProduct(req.body,(id) =>{
        let image = req.files.image;
        image.mv('./public/product-images/'+ id +'.jpg', (err, done) =>{
            if(!err){
                res.render('admin/add-product');
            }
            else{
                console.log(err);
            }
        })
        res.render('admin/add-product')
    });
})

router.get('/delete-product/:id', (req, res) =>{
    let prodId = req.params.id;
    console.log(prodId);
    productHelpers.deleteProduct(prodId).then((response)=>{
        res.redirect('/admin/');
    })
})

module.exports = router;
