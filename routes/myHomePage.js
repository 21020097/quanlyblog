const express = require('express');
const { verify } = require('jsonwebtoken');
const router = express.Router();

router.get('/myHomePage',(req,res)=>{
    const tokenKey = req.session.tokenKey;
    console.log(tokenKey);
    if(tokenKey)
    {
        const {email,isAdmin} = verify(tokenKey,'secret');
        if(!isAdmin) res.redirect('http://localhost:8080/homepage/user');
        else         res.redirect('http://localhost:8080/homepage/admin');
    }
    else res.redirect('http://localhost:8080/login');
});

router.get('/logout',(req,res)=>
{
    req.session.destroy();
    res.redirect('http://localhost:8080/login');
});
module.exports = router;