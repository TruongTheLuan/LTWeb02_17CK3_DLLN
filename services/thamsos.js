const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const db = require('./db');


class ThamSo extends Model {
    static async getThamSo(){
        return ThamSo.findAll();
    }

    static async updateThamSo(LaiSuatCoKiHan,LaiSuatKhongCoKiHan, NgayDong, TiGiaUSD, HanMucUSD, HanMucVND ){
        return await ThamSo.update({
            LaiSuatCoKiHan,
            LaiSuatKhongCoKiHan,
            NgayDong,
            TiGiaUSD,
            HanMucUSD, 
            HanMucVND
        },{
            where: {
                id: 1
            }
        })
    }
}   


ThamSo.init({
  LaiSuatCoKiHan: {
      type: Sequelize.FLOAT,
      allowNull: false,
  },
  LaiSuatKhongCoKiHan:{
      type: Sequelize.FLOAT,
      allowNull: false,
  },
  NgayDong: {
      type: Sequelize.INTEGER,  // tính bằng năm
      allowNull: false
  }, TiGiaUSD :{
       type: Sequelize.FLOAT,
       allowNull: false
  }, HanMucUSD: {
    type: Sequelize.FLOAT,
    allowNull: false
  }, HanMucVND: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
  
},{ sequelize: db, modelName: 'thamsos' });

module.exports = ThamSo;