var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const { USER_COLLECTION } = require('../config/collections');

module.exports =  {
    doSignup : (userData)=>{
        return new Promise(async(resolve, reject)=>{
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) =>{
                //console.log(data);
                resolve(data.insertedId);
            })
        })
    },
    emailCheck :(userData)=>{
        return new Promise(async(resolve, reject)=>{
            let email = await db.get().collection(collection.USER_COLLECTION).findOne({email: userData.email})
            resolve(email);
            
        })
    },
    doLogin : (userData) =>{
        return new Promise(async(resolve, reject)=>{
            let loginStatus = false;
            let response = {};
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email: userData.email})
            
            if(user){
                bcrypt.compare(userData.password, user.password).then((status) =>{
                    if(status){
                        console.log('successs');
                        response.user = user;
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
    },
    getAllUsers: ()=>{
        return new Promise((resolve, reject)=>{
            let users = db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users);
        })
    },
    deleteUser: (userId)=>{ 
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:ObjectID(userId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateUser: (userId, userData)=>{
        return new Promise((resolve, reject) =>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:ObjectID(userId)}, {
                $set:{
                    name: userData.name,
                    email: userData.email,
                    age : userData.age
                }
            }).then((response)=>{
                resolve(response);
            })
        })
    },
    getUserDetail: (userId)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(userId)}).then((user)=>{
                resolve(user);
            })
        })
    },

}