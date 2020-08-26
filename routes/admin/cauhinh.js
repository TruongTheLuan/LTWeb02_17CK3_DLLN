const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const ThamSo = require('../../services/thamsos');

var router = new Router();
router.use(require('../../middleware/auth_admin'));

router.get('/',asyncHandler(async (req, res)=>{
    let curr = req.session.user || req.cookies['user'];
    let thamso = await ThamSo.getThamSo();
    res.render('admin/cauhinh',{currentUser: curr, thamso : thamso[0]});
}));

router.post('/',asyncHandler(async (req, res)=>{
    await ThamSo.updateThamSo(req.body.cokihan,req.body.khongkihan, req.body.ngayhethan, req.body.tigiausd);
    res.redirect('/admin/cau-hinh');
}));
   

module.exports = router;