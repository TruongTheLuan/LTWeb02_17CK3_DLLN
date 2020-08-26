const { Router } = require('express');
const user = require('../services/users');
var router = new Router();
const Email = require('../services/mail')
const asyncHandler = require('express-async-handler');
const upload = require('../middleware/upload');
const fs = require('fs');
var {check, validationResult} = require('express-validator');

//env variables
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

router.post('/checkout', asyncHandler( async (req, res)=>{
    //add user
    //send mail
    var sign_up_user = await user.add(req.body.username, req.body.email);
    await Email.send(sign_up_user.email, "Vui Lòng kích hoạt tài khoản",`${BASE_URL}/sign-in/active/${sign_up_user.id}/${sign_up_user.token}`);
    res.redirect('/checkout');
}));


router.get('/active/:id/:token', asyncHandler ( async (req, res)=>{
    const {id , token} = req.params;
    const active_user = await user.findUserById(id);
    if(active_user && await active_user.token == token) {
        //xóa token
        await user.updateToken(id);

        return res.render('change_info', { id : id, errors: "" });
    } else {
        //404
        return res.redirect('/404');
    }
}));



router.post('/change-info', upload.fields([
    { name: 'hinhMatTruoc' ,maxCount: 1 },
    { name: 'hinhMatSau' ,maxCount: 1 } 
]) ,asyncHandler(async(req, res)=>{
    //update password
    let password = req.body.password;
    console.log('123')
    let dest = req.files['hinhMatTruoc'][0].destination;

    await check('fullname','fullname required').trim().notEmpty().run(req);
    await check('cmnd','cmnd required').trim().notEmpty().run(req);
    await check('noicap','noi cap required').trim().notEmpty().run(req);

    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('change_info',{ id: req.body.id , errors: "Nhập Sai Quy Định" }); 
    } else {
         // static async updateInfo(id, password, sex, fullname, birth, IDCard, HinhMatTruoc, HinhMatSau,ngaycap, noicap, STK)
                                await user.updateInfo(req.body.id, password, 
                                                        Boolean(req.body.sex), 
                                                        req.body.fullname, 
                                                        req.body.ngaysinh, 
                                                        req.body.cmnd, 
                                                        "HinhMatTruoc-" + req.body.id + ".jpg",
                                                        "HinhMatSau-"+req.body.id +".jpg",
                                                        req.body.ngaycap,
                                                        req.body.noicap
                                                     );
    }
    await fs.renameSync(dest + "/" + req.files['hinhMatTruoc'][0].filename,
                        dest + "/" + "HinhMatTruoc-" + req.body.id + ".jpg" );
    await fs.renameSync(dest + "/" + req.files['hinhMatSau'][0].filename,
                        dest + "/" + "HinhMatSau-" + req.body.id +".jpg" );

    return res.render('notifications/authentication');
}));

//Test UI
// router.get('/test/ui',(req,res)=>{
//     return res.render('change_password',{ id:1 , errors: "" }); 
// });

//  router.post('/test/ui',   upload.fields([{
//      name: 'hinhMatTruoc' ,maxCount: 1
//  }]),asyncHandler(async (req, res) => {
    
//      let dest = req.files['hinhMatTruoc'][0].destination;
//     //authentication
//     await check('fullname','fullname required').notEmpty().run(req);
//     var errors = validationResult(req)

//     if (!errors.isEmpty()) {
//         return res.render('change_password',{ id:1 , errors: "Nhập Sai Quy Định" }); 
//     } 

//     await fs.renameSync(dest + "/" + req.files['hinhMatTruoc'][0].filename,
//               dest + "/" + "HinhMatTruoc.jpg" );
    
// }));

module.exports = router;