const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const user = require('../services/users');

var router = new Router();

router.get('/', (req, res)=>{
    res.render('index');
});
//trang checkout
router.get('/checkout',(req,res)=>{
    res.render('notifications/checkout');
});
//trang 404
router.get('/404.html',(req,res)=>{
    res.render('notifications/404');
});

router.get('/503.html',(req, res)=>{
    res.render('notifications/503');
});

router.post('/change-password',asyncHandler(async(req,res)=>{
    let _user = await user.updatePassword(req.body.id, req.body.password);

    //xóa session
    req.session.destroy();

    //update token if have
    if(_user.token != null){
        await user.updateToken(_user.id);
    }
    res.redirect('/');
}));

module.exports = router;