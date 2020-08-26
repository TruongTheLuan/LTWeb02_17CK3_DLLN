const { Router } = require('express');
const user = require('../services/users');
const asyncHandler = require('express-async-handler');

var router = new Router();
router.get('/',asyncHandler(async(req, res)=>{
    let user_me = await user.findUserById(req.session.user.id || req.cookies['user'].id);
    res.render('aboutMe',{user : user_me});
}));

router.post('/',asyncHandler(async(req, res)=>{
    await user.updateFullName(req.body.id, req.body.fullname);
    return res.redirect('back');
}));

router.get('/change-password/:id',(req, res)=>{
    return res.render('change_password',{id : req.param.id});
});



module.exports = router;