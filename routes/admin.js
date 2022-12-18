var express = require('express');
const { response } = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers');
const { route } = require('./user');

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

router.get('/edit-product/:id', async(req, res)=>{
    let product = await productHelpers.getProductDetail(req.params.id)
    res.render('admin/edit-product', {product})
})

router.post('/edit-product/:id', (req, res)=>{
    let id = req.params.id
    productHelpers.updateProduct(req.params, req.body).then(()=>{
        res.redirect('/admin');
        if(req.files.image){
        let image = req.files.image;
        image.mv('./public/product-images/'+ id +'.jpg')
        }
    })
})
module.exports = router;
