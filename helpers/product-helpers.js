var db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require('mongodb').ObjectId;

module.exports = {

    addProduct:(product, callback)=>{
        //console.log(product);
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) =>{
           // console.log(data);
            callback(data.insertedId);
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve, reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetail:(prodId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((prduct)=>{
                resolve(prduct);
            })
        })
    },
    updateProduct:(prodId, prodDetail)=>{
       // console.log(prodDetail);
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(prodId)},{
                $set:{
                    name: prodDetail.name,
                    category: prodDetail.category,
                    price: prodDetail.price,
                    description: prodDetail.description
                }
            }).then((response)=>{
                resolve()
            })
        })
    },

}