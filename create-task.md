# Kinh nghiệm khi tạo task phát triển TypeScript React

## Checklist khi tạo task:
- Định nghĩa rõ ràng type/interface cho mọi object/mảng
- Khai báo type cho tham số trong map/filter/reduce
- Xóa biến/const không dùng
- Chạy `npm run type-check` trước khi push
- Kiểm tra script prepare đa nền tảng (node script, không dùng shell if)
- Xem lại file `PRE-PUSH-CHECKLIST.md` trước khi push code

## Lưu ý:
- Khi chuẩn bị push code, luôn kiểm tra lại checklist để đảm bảo không còn lỗi type/lint/build. 