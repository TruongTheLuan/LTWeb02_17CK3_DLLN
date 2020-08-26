Đồ án môn học lập trình Web 2
Giáo viên hướng dẫn: Đỗ Nguyên Kha
Các thành viên trong nhóm
1760029-Trương Thành Đạt
1760129-Nguyễn Trọng Nhân
1760349-Cao Bảo Linh
1760359-Trương Thế Luân

1. tạo trang index
2. từ trang index -> khách hàng sẽ đăng kí 
3. tạo ra 1 mật khẩu mặc định có 8 chữ số được send mail để thay đôi mật khẩu
4. tạo trang signin
5. không cho phép thêm các giao dịch ở những tài khoản đã bik khóa
6. khi chạy cần cập nhật lại bảng tham số trong table Plus
7. làm về chuyển tiền nội bộ 
8. Update tìm kiếm cơ bản admin (-người dùng - tài khoản - lượt giao dịch)
9. Update top người dùng
10. Update thống kê cơ bản (-đếm số người dùng -đếm số người chưa xét duyệt -đếm số giao dịch)
11. Cập nhật cơ chế tiết kiệm
12. cập nhật trang lỗi
13. cập nhật 1 số tính năng phụ
14. sửa lỗi
15. 1 số tính năng khác ....

# GIT CƠ BẢN

# clone repo
    # => git clone repo-link

# khởi tạo git
    # => git init(cho project mới)

# remote
    # =>git remote add origin repo-link(mặc định là origin sau khi clone)

# push
    # => git add .
    # => git commit -m "first commit"
    # => git push remote-repo branch-name

# cập nhật 
    #=>chuyển nhánh
    #=>git pull

# tạo nhánh
    # => git branch branch-name
    # => (chuyển nhánh) git checkout branch-name
    # => (xóa nhánh) git branch -d branch-name

# kiểm tra commit tag-name
    # => git log
    # => git reset --hard tag-name


# clone 1 nhánh mới
    # => git clone --single-branch --branch branchname remote-repo

# lấy 1 file từ nhánh khác 
    # => git checkout linhcao -- views/transfer.ejs

# Merge Nhánh
    # => 
