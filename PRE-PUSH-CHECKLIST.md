# Pre-Push Checklist for TypeScript React Project

Trước khi push code lên repository, hãy đảm bảo bạn đã thực hiện đầy đủ các bước sau để hạn chế tối đa lỗi build, type, lint và đảm bảo chất lượng code:

---

## 1. Kiểm tra lỗi TypeScript
- [ ] Chạy lệnh `npm run type-check` hoặc `npx tsc --noEmit`
- [ ] Đảm bảo **KHÔNG có lỗi** (TSxxxx) nào xuất hiện
- [ ] Đã khai báo type cho tất cả các tham số trong map/filter/reduce (ví dụ: `(f: ImportField, idx: number) => ...`)
- [ ] Không dùng `any` trừ khi thực sự cần thiết
- [ ] Xóa các biến, hàm, import không dùng đến (TS6133, TS6192)

## 2. Kiểm tra linting
- [ ] Chạy lệnh `npm run lint`
- [ ] Đảm bảo không có warning/error về style, unused variable, unused import

## 3. Kiểm tra biến môi trường
- [ ] Đã cấu hình đầy đủ biến môi trường trên Vercel (Settings → Environment Variables)
- [ ] Không cần file `.env` trên server nếu đã cấu hình trên dashboard

## 4. Kiểm tra test (nếu có)
- [ ] Chạy `npm test` hoặc `npm run test` (nếu dự án có test)
- [ ] Đảm bảo tất cả các test đều pass

## 5. Kiểm tra UI/UX
- [ ] Đã kiểm tra các tính năng chính trên local (localhost)
- [ ] Đảm bảo không có lỗi console, warning React, lỗi type khi thao tác

## 6. Kiểm tra code review (nếu làm việc nhóm)
- [ ] Đã tự review lại code, xóa các đoạn code thử nghiệm, console.log, comment không cần thiết
- [ ] Đã cập nhật tài liệu nếu có thay đổi lớn

## 7. Kiểm tra script prepare đa nền tảng
- [ ] Đảm bảo script `prepare` trong `package.json` không gây lỗi trên Windows/Vercel (nên dùng node script thay vì shell if)

---

**Lưu ý:**
- Nếu có lỗi type/lint, hãy sửa hết trước khi push.
- Nếu có warning về key trong React, hãy thêm prop `key` cho các phần tử trong map.
- Nếu có lỗi về biến không dùng, hãy xóa hoặc comment lại lý do giữ biến đó.
- Khi bạn nhắn "chuẩn bị push code", mình sẽ tự động nhắc lại checklist này và kiểm tra lại toàn bộ các lỗi trước khi bạn push!

--- 