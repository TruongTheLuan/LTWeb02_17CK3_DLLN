const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const user = require('../../services/users');

const GiaoDich = require('../../services/giaodichs');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let giaodichs = await GiaoDich.findAllGiaoDich();

    res.render('admin/giaodich',{currentUser: curr, giaodichs: giaodichs});
}));

router.post('/tim-kiem',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let giaodichs = await GiaoDich.findGiaoDichBySTK(req.body.sotaikhoan);

    res.render('admin/giaodich',{currentUser: curr, giaodichs: giaodichs});
}));

module.exports = router;