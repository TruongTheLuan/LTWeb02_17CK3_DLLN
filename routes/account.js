const { Router } = require('express');
var router = new Router();
const asyncHandler = require('express-async-handler');
const taikhoanthanhtoan = require('../services/taikhoanthanhtoans');
const taikhoantietkiem = require('../services/taikhoantietkiems');

router.get('/', asyncHandler(async (req, res)=>{
   let account_thanhtoan = null, account_tietkiem =null;
   if (req.query.thanhtoan)
        account_thanhtoan = await taikhoanthanhtoan.findAllAccountForKH(currentUser.id);
        
   if (req.query.tietkiem)
        account_tietkiem = await taikhoantietkiem.findAllAccountForKH(currentUser.id);
   return res.render('account_bank',{
        thanhtoans : account_thanhtoan,
        tietkiems : account_tietkiem
   });
}));

module.exports = router;