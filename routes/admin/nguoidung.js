const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const User = require('../../services/users');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let users = await User.findAll();
    res.render('admin/nguoidung',{currentUser: curr, users : users});
}));

router.get('/xem-them/:id', asyncHandler(async (req, res)=>{
    let id = req.params.id;
    let curr = req.session.user || req.cookies['user'];
    let user = await User.findAllUserById(id);
    res.render('admin/nguoidung',{currentUser: curr, users : user});
}));

router.post('/tim-kiem',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let user = await User.findAllUserByUsername(req.body.username);
    res.render('admin/nguoidung',{currentUser: curr, users : user});
}));

module.exports = router;