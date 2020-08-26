class Support{
    static getTenHinhThuc(MaHinhThuc){
        let TenHinhThuc = "";
        switch (MaHinhThuc) {
            case 1:
                TenHinhThuc = "Gửi Tiết Kiệm Có Kì Hạn - Dùng Vốn Và Lời Để Đáo Hạn";
                break;
            case 2:
                TenHinhThuc = "Gửi Tiết Kiệm có Kì Hạn - Rút Lời Về Tài Khoản Chính Gửi Tiếp Vốn";
                break;
            case 3:
                TenHinhThuc = "Rút Cả Vốn Lẫn lời về tài khoản";
                break;
            default:
                TenHinhThuc = "Gửi Tiết Kiệm Không Kì Hạn"
                break;
        }
        return TenHinhThuc;
    }


    static getTenLoaiTaiKhoan(MaLoaiTaiKhoan){
        let TenLoaiTaiKhoan = "";
        switch (MaLoaiTaiKhoan) {
            case 0:
                TenLoaiTaiKhoan = "Tài Khoản Thanh Toán";
                break;
        
            case 1:
                TenLoaiTaiKhoan = "Tài Khoản Tiết Kiệm";
                break;
        }
        return TenLoaiTaiKhoan;
    }
    //0- Nhận Tiền , 1- Chuyển Tiền Nội Bộ , 2- Chuyển Tiền Liên Ngân Hàng , 3- 
    static getHinhThucChuyenTien(MaLoaiHinhThucChuyen){
        let TenHinhThucChuyenTien = "";
        switch (MaLoaiHinhThucChuyen) {
            case 0:
                TenHinhThucChuyenTien = "Nhận Tiền";
                break;
            case 1:
                TenHinhThucChuyenTien = "Chuyển Tiền Nội Bộ";
                break;
            case 2:
                TenHinhThucChuyenTien = "Chuyển Tiền Liên Ngân Hàng";
                break;
            case 3:
                TenHinhThucChuyenTien = "Tạo Tài Khoản";
                break;
            case 4: 
                TenHinhThucChuyenTien = "Rút Tiền Trước Kỳ Hạn";
                break;

            case 5:
                TenHinhThucChuyenTien = "Rút Tiền Đúng Kỳ Hạn";
                break;
            case 6:
                TenHinhThucChuyenTien = "Trừ Tiền";
                break;
                
        }
        return TenHinhThucChuyenTien;
    }

}
module.exports = Support;