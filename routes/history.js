const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const GiaoDich = require('../services/giaodichs');

var router = new Router();
router.get('/',asyncHandler(async (req, res)=>{
    let currAccount = req.session.user || req.cookies['user'];
    let giaodichs =await GiaoDich.findGiaoDichBySTK(currAccount.STK);
    res.render('history',{ giaodichs: giaodichs });
}));

module.exports = router;