const {
    Router
} = require('express');
const asyncHandler = require('express-async-handler');

//enity
const giaodich = require('../services/giaodichs');
const support = require('../services/support_');
const taikhoantietkiem = require('../services/taikhoantietkiems');
const thamsos = require('../services/thamsos');
const taikhoanthanhtoan = require('../services/taikhoanthanhtoans');

var router = new Router();
router.get('/', (req, res) => {
    res.render('savings');
});



router.post('/', asyncHandler(async (req, res) => {
    let thamso = await thamsos.findAll();
    let currAccount = req.session.user || req.cookies['user'];

    //kiểm tra xem accout đã tồn tại hay chưa
    let account_savings = await taikhoantietkiem.findAccountForKH(currAccount.id);
    let account_thanhtoan = await taikhoanthanhtoan.findAccountBySoTaiKhoan(currAccount.STK);

    let money = req.body.money;
    //chuyển đổi tỉ giá
    if (req.body.donvi != account_thanhtoan.DonViTienTe) {
        //cập nhật hình thức, kì hạn, số tiền
        //donvi = USD => account = VND
        if (req.body.donvi == "USD") {
            money = money * thamso[0].TiGiaUSD;
        } else {
            money = money / thamso[0].TiGiaUSD;
        }
    }

    if (account_savings) {
        //TienGuiVao, DonViTienTe, KyHan, LoaiHinhThuc, SoTaiKhoan
        await taikhoantietkiem.updateTaiKhoanTK(account_thanhtoan.DonViTienTe,
            req.body.hinhthuc, currAccount.STK);
        try {
            if (Number(account_savings.KyHan) == 0) {
                //xử lí các loại hình thức gửi tiết kiệm
                switch (account_savings.LoaiHinhThuc) {
                    //HT1: Gửi Tiết Kiệm Có Kì Hạn - Dùng Vốn Và Lời Để Đáo Hạn - tích lãi vào tài khoản gốc
                    case 1:
                        await taikhoantietkiem.guiTietKiemHT1(currAccount.STK, req.body.kihan, money);
                        await giaodich.add(currAccount.STK, money, 1, 5, tktk.NgayMo, account_thanhtoan.DonViTienTe);

                        break;

                        //HT2: Gửi Tiết Kiệm có Kì Hạn - Rút Lời Về Tài Khoản Chính Gửi Tiếp Vốn (vốn + tiền vừa gửi vào)
                    case 2:
                        //cộng lời vào tài khoản chính
                        await taikhoanthanhtoan.CongLai(currAccount.STK, account_savings.TienLaiToanBo);
                        await giaodich.add(currAccount.STK, account_savings.TienLaiToanBo, 0, 0, tktk.NgayMo, account_thanhtoan.DonViTienTe);

                        await taikhoantietkiem.guiTietKiemHT2(currAccount.STK, req.body.kihan, money);
                        await giaodich.add(currAccount.STK, money, 1, 5, tktk.NgayMo, account_thanhtoan.DonViTienTe);

                        break;
                        //HT3: Rút Cả Vốn Lẫn lời về tài khoản - gửi bằng tiền mới
                    case 3:
                        await taikhoanthanhtoan.CongLai(currAccount.STK, (account_savings.TienLaiToanBo + account_savings.TienGuiVao));
                        await giaodich.add(currAccount.STK, (account_savings.TienLaiToanBo + account_savings.TienGuiVao), 0, 0, tktk.NgayMo, account_thanhtoan.DonViTienTe);

                        await taikhoantietkiem.guiTietKiemHT3(currAccount.STK, req.body.kihan, money);
                        await giaodich.add(currAccount.STK, money, 1, 5, tktk.NgayMo, account_thanhtoan.DonViTienTe);
                        break;
                        //không kì hạn 
                    default:

                        //giống th1
                        await taikhoantietkiem.guiTietKiemHT1(currAccount.STK, req.body.kihan, money);
                        await giaodich.add(currAccount.STK, money, 1, 5, tktk.NgayMo, account_thanhtoan.DonViTienTe);
                        break;
                }
            } else {
                //  kì hạn khác 0 ==> không phải hết kì hạn (rút trươc) + cũng không phải không kì hạn
                //giống th3 nhưng không cộng lãi
                await taikhoanthanhtoan.CongLai(currAccount.STK, account_savings.TienGuiVao);
                await taikhoantietkiem.guiTietKiemHT3(currAccount.STK, req.body.kihan, money);

                //cập nhật lại giao dịch 
                //nhận tiền
                await giaodich.add(currAccount.STK, account_savings.TienGuiVao, 0, 0, tktk.NgayMo, account_thanhtoan.DonViTienTe);
                //rút tiền trước kì hạn
                await giaodich.add(currAccount.STK, money, 1, 4, tktk.NgayMo, account_thanhtoan.DonViTienTe);
            }
        } catch (err) {
            throw err;
        }

    } else {
        //insert
        let tktk = await taikhoantietkiem.add(currAccount.STK, money, account_thanhtoan.DonViTienTe,
            new Date(), req.body.kihan, req.body.hinhthuc, support.getTenHinhThuc(req.body.hinhthuc),
            currAccount.id);
        //thêm lịch sử
        await giaodich.add(currAccount.STK, money, 1, 3, tktk.NgayMo, account_thanhtoan.DonViTienTe);
    }
    //update lãi suất
    if (req.body.hinhthuc == 4) {
        await taikhoantietkiem.updateLaiSuat(currAccount.id, thamso[0].LaiSuatKhongCoKiHan);
    } else {
        await taikhoantietkiem.updateLaiSuat(currAccount.id, thamso[0].LaiSuatCoKiHan);
    }
    //cập nhật số tiền bị lấy đem qua tu tài khoản thanh toán
    await taikhoanthanhtoan.updateSoTien(currAccount.STK, money);
    //trừ tiền tài khoản thanh toány
    await giaodich.add(currAccount.STK, money, 0, 6,new Date(), account_thanhtoan.DonViTienTe);

    res.redirect('back');
}));
module.exports = router;