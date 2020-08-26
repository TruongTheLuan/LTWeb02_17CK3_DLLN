const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const user = require('../../services/users');
const taikhoantietkiems = require('../../services/taikhoantietkiems');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/',asyncHandler( async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let taikhoantietkiem = await taikhoantietkiems.findAllAccount();

    res.render('admin/taikhoantietkiem',{currentUser: curr, taikhoans : taikhoantietkiem});
}));

router.post('/tim-kiem',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let taikhoans = await taikhoantietkiems.findAllAccountBySTK(req.body.sotaikhoan);

    res.render('admin/taikhoantietkiem',{currentUser: curr, taikhoans: taikhoans});
}));


module.exports = router;