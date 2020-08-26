const db = require('./services/db');
const CronJob = require('cron').CronJob;

const CRON_PATTERN =   process.env.CRON_PATTERN || '0 0 12 1 * *';  //Every month on the 1st, at noon   

const taikhoantietkiems = require('./services/taikhoantietkiems');

db.sync().then(async () => { 
    var job = new CronJob(CRON_PATTERN, async function() {
       
        //tìm tất cả tài khoản
        let accounts = await taikhoantietkiems.findAllNotLocked();
        if(accounts.length != 0) {
            for (var i = 0;i < accounts.length;i++) {
                //1,2,3,4
                if(accounts[i].LoaiHinhThuc != 4){
                    if(accounts[i].KyHan != 0) {
                        await taikhoantietkiems.giamKyHan(accounts[i].SoTaiKhoan);
                        await taikhoantietkiems.tinhLai(accounts[i].SoTaiKhoan);
                        await taikhoantietkiems.tinhTienLoi(accounts[i].SoTaiKhoan);
                    }
                //tài khoản không kỳ hạn
                } else {
                    await taikhoantietkiems.tinhLai(accounts[i].SoTaiKhoan);
                    await taikhoantietkiems.tinhTienLoi(accounts[i].SoTaiKhoan);
                }
            }
        }
    }, null, true, 'Asia/Ho_Chi_Minh');
    job.start();
}).catch((err) => {
    
});
