//Create logic for api call

// Import DB
// const { response } = require('express');
const db = require('./db')

// import jwt token
const jwt = require('jsonwebtoken')

//Register logic
const register =(acno,username,password)=>{
    console.log("inside the register object");

    return db.User.findOne({acno}).then((response)=>{
        console.log(response);
        if(response){
            return{
                statusCode:401,
                message:"User already exists"
            }
        }
        else{
            //if acno not present in mongodb then create a new one
            const newUser= new db.User({
                acno,
                username,
                password,
                balance:2000,
                transaction:[]
            })
            //to store thr new user in mongodb
            newUser.save()
            //send response to the client
            return{
                statusCode:200,
                message:"User registered successfully"
            }
        }
    })
}


//login logic
const login=(acno,password)=>{
    console.log("inside login function")
    return db.User.findOne({acno,password}).then((result)=>{
        if(result){ //acno is present in mongodb
            // generation of token
            const token=jwt.sign({
                loginAcno:acno
            },'superkey2023')
            return{ //response sends to the client
                statusCode:200,
                message:"Login Successful",
                currentUser:result.username,
                token,
                currentAcno:acno
            }
        }
        else{
            //acno is not in mongodb
            return{
                statusCode:401,
                message:"Invalid Data"
            }
        }
    })
}

//get balance
const getBalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return {
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{                
                statusCode:401,
                message:"Invalid Account Number"
            }
        }
        
    })
}

//fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
        //convert amt into number
        let amount = parseInt(amt)
        //check fromAcno in Mongodb
        return db.User.findOne({acno:fromAcno,password:fromAcnoPswd}).then((debit)=>{
            if(debit){    //acno is present in mongodb
                //to check ToAcno in mongodb
                return db.User.findOne({acno:toAcno}).then((credit)=>{
                    if(credit){
                        // if(fromAcno==toAcno){
                        //     alert('Both are same account')
                        // }
                        if(debit.balance>=amount){
                            debit.balance-=amount
                            //to update transaction details in transaction[]
                            debit.transaction.push({
                                type:'Debit',
                                amount,
                                fromAcno,
                                toAcno
                            })
                            //save changes in mongodb
                            debit.save()
                            //update in toAcno in transaction
                            credit.balance+=amount
                            credit.transaction.push({
                                type:'Credit',
                                amount,
                                fromAcno,
                                toAcno
                            })
                            //save changes in mongodb
                            credit.save()


                            //send response back to client
                            return{
                                statusCode:200,
                                message:"Successfully completed the transaction"
                            }
                        }
                        else{
                            return{
                                statusCode:401,
                                message:"insufficient balance"
                            }
                        }
                    }
                    else{
                        return{
                            statusCode:401,
                            message:"Invalid Credit Account Number"
                        }
                    }
                });

            }
            else{
                return{
                    statusCode:401,
                    message:"Invalid Debit Account Number"
                }
            }
        })

}

//get transaction details
const getTransaction=(acno)=>{
    //to check acno in mongo db
    return db.User.findOne({acno}).then((result)=>{
        if(result){     //complete details of particular acno
            return {    //send transaction details to the client
            statusCode:200,
            transaction:result.transaction
            }
        }
        else{   //acno not found in mongodb
            return{
                statusCode:401,
                message:"Invalid Account number"
            }
        }
    })
}

//delete user account
const deleteUserAccount = (acno)=>{
    //delete uder account from mongo db
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:'Your account has benn deleted'
        }
    })
}

module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransaction,
    deleteUserAccount

}



//fund transfer
// const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
//     //convert amt into number
//     let amount = parseInt(amt)
//     //check fromAcno in Mongodb
//     return db.User.findOne({acno:fromAcno,password:fromAcnoPswd}).then((debit)=>{
//         if(debit){    //acno is present in mongodb
//             //to check ToAcno in mongodb
//             return db.User.findOne({acno:toAcno}).then((credit)=>{
//                 if(credit){
//                     if(debit.balance>=amount){
//                         debit.balance-=amount
//                         //to update transaction details in transaction[]
//                         debit.transaction.push({
//                             type:'Debit',
//                             amount,
//                             fromAcno,
//                             toAcno
//                         })
//                         //save changes in mongodb
//                         debit.save()
//                         //update in toAcno in transaction
//                         credit.balance+=amount
//                         credit.transaction.push({
//                             type:'Credit',
//                             amount,
//                             fromAcno,
//                             toAcno
//                         })
//                         //save changes in mongodb
//                         credit.save()


//                         //send response back to client
//                         return{
//                             statusCode:200,
//                             message:"Successfully completed the transaction"
//                         }
//                     }
//                     else{
//                         return{
//                             statusCode:401,
//                             message:"insufficient balance"
//                         }
//                     }
//                 }
//                 else{
//                     return{
//                         statusCode:401,
//                         message:"Invalid Credit Account Number"
//                     }
//                 }
//             });

//         }
//         else{
//             return{
//                 statusCode:401,
//                 message:"Invalid Debit Account Number"
//             }
//         }
//     })

// }