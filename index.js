// Backend for Bank App
// code to create server using express 


// 1. import express
const express = require('express');

// 4. import cors
const cors = require('cors')

//import logic
const logic = require('./services/logic')

// import jwt token
const jwt = require('jsonwebtoken')

// 2. create server using express
const server = express();

//5. use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

//6. Parse json data to js in server app
server.use(express.json());

// 3. setup port for server
server.listen(5000,()=>{
    console.log("server listening on the port :5000");
})



//7. Resolving client requests
// api call
// server.get('/',(req,res)=>{
//     res.send('client get request')
// })

//Bank app Requsts

    //Application Specific Middleware
    // const appMiddleware =(req,res,next)=>{
    //     console.log("Application Specific Middleware");
    //     next()
    // }
    // server.use (appMiddleware)

    //Router Specific middleware
    const routerMiddleware =(req,res,next)=>{
        console.log("Router Specific Middleware");
        try{
            const token =  req.headers['verify-token']; //token
            // console.log(token);
            const data = jwt.verify(token,'superkey2023');
            console.log(data);  //to get login acno   - { loginAcno: '123', iat: 1687338043 }
            req.currentAcno=data.loginAcno
            next()
        }
        catch{
            res.status(404).json({message:"Please login first"})
        }
    }

//register
server.post('/register',(req,res)=>{
    console.log('inside the register');
    console.log(req.body);
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{

        // res.send('register request received');
        res.status(result.statusCode).json(result); //send to the client
    })
})


//login
server.post('/login',(req,res)=>{
    console.log('inside the login');
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result); //send to the client
    })
})


//balance enqiry
server.get('/balance/:acno',routerMiddleware,(req,res)=>{
    console.log("inside the Balance");
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result); //send to the client
    })
})

//fund transfer
server.post('/fundtransfer',routerMiddleware,(req,res)=>{
    console.log('Inside the fund transfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result); //send to the client  
    })


})

//get transaction
server.get('/transactions',routerMiddleware,(req,res)=>{
    console.log("Inside the transaction history");
    logic.getTransaction(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result);
    })
})

//delete user account
server.delete('/deleteAccount',routerMiddleware,(req,res)=>{
    console.log('inside the delete function');
    logic.deleteUserAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result);
    })
})