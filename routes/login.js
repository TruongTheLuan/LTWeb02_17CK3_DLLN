const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const user = require('../services/users');
const Email = require('../services/mail')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'


var router = new Router();
router.get('/', (req, res)=>{
    res.render('login');
});

router.post('/',  asyncHandler( async(req, res)=>{
    let info = req.body.info;
    var user_login = await user.findUserByUsername(info);
    if(!user_login){
        user_login = await user.findUserByEmail(info)
    }
    if(!user_login || user.verifyPassword(req.body.password,user_login.password) == false){
        return res.render('login');
    }
    req.session.user = user_login;
    
    if(req.body.remember_me == "true"){
        var expiryDate = new Date(Number(new Date()) + 315360000000); 
       res.cookie('user',user_login,{expires: expiryDate});
    }
    req.currentUser = user;
    res.locals.currentUser = user;
    if (user_login.role == 1) {
       return res.redirect('/admin/index');
    } else {
       return res.redirect('/');
    } 
}));

router.get('/forgot-password', (req,res)=>{
    res.render('forgotPassword',{error : ""} );
});

router.post('/forgot-password',asyncHandler( async(req, res)=>{
    let user_forgot = await user.findUserByEmail(req.body.email);
    if(!user_forgot) {

      return res.render('forgotPassword',{error : "Không Tồn Tại User"});
    } else {
        if(user_forgot.isLocked){
            return res.render('forgotPassword',{error : "User chưa được xác nhận"});
        }else {
            //active lại token 
        await user.createToken(user_forgot.id);

        //sau lúc này user đã có token 
        await Email.send(user_forgot.email, "Truy Cập Đường Dẫn Sau để Thay Đổi Mật Khẩu Mới",`${BASE_URL}/login/forgot-password/${user_forgot.id}/${user_forgot.token}`);
        //thông báo
        }
    }
    //chuyen den login
    return res.redirect("/login");
}));

router.get("/forgot-password/:id/:token",asyncHandler(async(req, res)=>{
    const {id , token} = req.params;
    
    const active_user = await user.findUserById(id);

    if(active_user) {
        return res.render("change_password",{ id });
    } else {
        return res.redirect('/404.html'); 
    }
}));


module.exports = router;