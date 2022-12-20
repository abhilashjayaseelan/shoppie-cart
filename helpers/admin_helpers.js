var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const { USER_COLLECTION } = require('../config/collections');

  
module.exports={
   // Admin helper
   adminLogin : (userData) =>{
    return new Promise(async(resolve, reject)=>{
        let loginStatus = false;
        let response = {};
        let [admin] = await db.get().collection(collection.ADMIN_COLLECTION).find({email: userData.email}).toArray()
        if(admin){
            bcrypt.compare(userData.password, admin.password).then((status) =>{
                if(status){
                    console.log('successs');
                    response.admin = admin;
                    response.status = true;
                    resolve(response)
                }else{
                    console.log('failed');
                    resolve({status:false});
                }
            })
        }else{
            console.log('login failed');
            resolve({status:false});
        }
    })
}

}