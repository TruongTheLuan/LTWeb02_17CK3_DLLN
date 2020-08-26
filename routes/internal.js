const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const user = require('../services/users');

const taikhoanthanhtoan = require('../services/taikhoanthanhtoans');
const giaodich = require('../services/giaodichs');
const Email = require('../services/mail')
const thamsos = require('../services/thamsos');
var router = new Router();
router.get('/', (req, res)=>{
    let currAccount = req.session.user || req.cookies['user'];
    res.render('internal',{currAccount : currAccount});
});
//tìm tên theo tài khoản
router.post('/tim-ten',asyncHandler( async (req,res)=>{
    let fullName = await user.findHoTenBySTK(req.body.STK);
    res.send(JSON.stringify(fullName));
}));

function DongBoHoaTienTe(SoTien, DonViGui, DonViTaiKhoan, TiGiaUSD){
    let money = SoTien;
    if( DonViGui != DonViTaiKhoan ){
        if (DonViGui == "USD") {
            money = money * TiGiaUSD;
        } else {
            money = money / TiGiaUSD;
        }
    }
    return money;
}

router.post('/',asyncHandler( async (req,res)=>{ 
    //business
    /*
        trừ tiền người gửi(tktt) (đồng bộ hóa số tiền theo tài khoản gửi)
        ==> cập nhật lịch sử -ht1
        ==> email

        cộng tiền người nhận(tktt) (đồng bộ hóa số tiền theo tài khoản nhận)
        ==> cập nhật lịch sử -ht0
        ==> email
    */
    //phần 1 xử lí tài khoản gửi
    //hàm trừ - trừ tiền người gửi
    let currAccount = req.session.user || req.cookies['user'];
    let thamso = await thamsos.getThamSo();

    let tktt_gui = await taikhoanthanhtoan.findAccountBySoTaiKhoan(req.body.sotaikhoannguoigui); 
    await taikhoanthanhtoan.updateSoTien(req.body.sotaikhoannguoigui,Number( DongBoHoaTienTe(req.body.sotien,req.body.donvi,tktt_gui.DonViTienTe, thamso[0].TiGiaUSD)));
    
    //không cần đồng bộ hóa tiền tệ trong giao dịch
    let giaodichchuyen = await giaodich.add(req.body.sotaikhoannguoigui, req.body.sotien, 0,1,new Date(),req.body.donvi);

    //gửi mail
    // await Email.send(currAccount.email, "Chuyển tiền thành công",`Bạn đã chuyển thành công với mã giao dịch là : ${giaodichchuyen.id}
    //                     với số tiền là ${req.body.sotien} cho tài khoản ${req.body.sotaikhoannguoinhan} \n 
    //                     =====> không phải tài khoản này thực hiện ? !!! Liên hệ 0123456789 để biết thêm chi tiết`);

    //tài khoản nhận
    let tktt_nhan = await taikhoanthanhtoan.findAccountBySoTaiKhoan(req.body.sotaikhoannguoinhan);
    //tài khoản nhận
    let user_nhan = await user.findUserBySTK(req.body.sotaikhoannguoinhan);
    //cộng tiên, đừng để ý hàm
    let tienmoi = tktt_nhan.SoDu + Number(DongBoHoaTienTe(req.body.sotien,req.body.donvi,tktt_nhan.DonViTienTe, thamso[0].TiGiaUSD));
    console.log(tienmoi);
    await taikhoanthanhtoan.CongLai(req.body.sotaikhoannguoinhan, tienmoi);
    //giao dịch
    let giaodichnhan = await giaodich.add(req.body.sotaikhoannguoinhan, req.body.sotien, 0, 0, new Date(), req.body.donvi);
    //gửi mail
    // await Email.send(user_nhan.email, "Thông Báo Nhận Tiền",`1 Giao dịch mới mã giao dịch là : ${giaodichnhan.id}
    //                     với số tiền là ${req.body.sotien} từ tài khoản ${req.body.sotaikhoannguoigui} \n 
    //                     với nội dung : ${req.body.noidung}`);
    res.redirect('back');
}));

module.exports = router;