# NutriMate — Tổng quan hệ thống

## Mục tiêu
NutriMate là một backend REST API (NestJS) nhằm hỗ trợ quản lý dinh dưỡng, bài tập và theo dõi hoạt động người dùng. Hệ thống cung cấp: quản lý người dùng, xác thực (JWT + OAuth Google), quản lý thực phẩm, nhật ký bữa ăn, bài tập và gợi ý sức khỏe.

## Kiến trúc tổng quan
- Ngôn ngữ & framework: TypeScript, NestJS
- ORM: Prisma (schema tại `prisma/schema.prisma`)
- Package manager: pnpm
- Các mô-đun chính: `auth`, `user`, `user-profile`, `food`, `meal-log`, `calculator`, `recommendation`, `exercise`, `workout-log`, `dashboard`, `prisma`.

## Mô-đun chính (tóm tắt)
- `auth`: xử lý đăng ký/đăng nhập, JWT, social login (Google). (thư mục: `src/auth`)
- `user` / `user-profile`: quản lý tài khoản và hồ sơ người dùng. (thư mục: `src/user`, `src/user-profile`)
- `food`: CRUD dữ liệu thực phẩm, có dữ liệu mẫu `prisma/foods_vn.csv`.
- `meal-log`: lưu nhật ký bữa ăn, tính calories từ thực phẩm.
- `exercise` / `workout-log`: quản lý bài tập và nhật ký luyện tập.
- `calculator` / `recommendation`: các dịch vụ tính toán sức khỏe và gợi ý dinh dưỡng.
- `dashboard`: tổng hợp số liệu và thống kê cho người dùng.
- `prisma`: cấu hình schema, migration và seed (thư mục: `prisma/`).

## Database & Seed
- Prisma quản lý schema và migration (xem `prisma/schema.prisma` và thư mục `prisma/migrations`).
- Có file seed / script seed trong `prisma/seed.ts` và file dữ liệu `prisma/foods_vn.csv`.

## Xác thực
- Hệ thống dùng JWT cho API bảo mật; có guard `jwt-auth.guard.ts` và `jwt.strategy.ts`.
- Hỗ trợ social login qua Google (strategy: `src/auth/strategies/google.strategy.ts`).

## Cấu hình môi trường (tóm tắt)
- Các biến môi trường quan trọng: `DATABASE_URL`/`PRISMA_DATABASE_URL`, `JWT_SECRET`, Google OAuth keys (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), và các biến upload/paths nếu có.

## Chạy ứng dụng cục bộ (gợi ý)
1. Cài đặt phụ thuộc:

```bash
pnpm install
```

2. Tạo/kiểm tra biến môi trường (tạo file `.env` từ mẫu nếu có).

3. Chạy migration và seed (Prisma):

```bash
npx prisma migrate dev
# hoặc chạy script seed: pnpm run seed  # kiểm tra scripts trong package.json
```

4. Chạy ứng dụng ở chế độ dev:

```bash
pnpm run start:dev
```

Lưu ý: tên script có thể khác, kiểm tra `package.json` để biết chính xác các lệnh sẵn có.

## Kiểm thử
- Repo có cấu hình test end-to-end (xem `test/` và `jest-e2e.json`). Chạy lệnh test theo script trong `package.json`.

## Uploads & Lưu trữ file
- Thư mục upload tĩnh: `uploads/profile-pictures/` (ảnh đại diện người dùng).

## Điểm cần lưu ý cho developer
- Kiểm tra các migration mới trước khi deploy.
- Khi thay đổi schema Prisma, luôn chạy `npx prisma generate` và thực hiện migration thích hợp.
- Bảo mật: giữ `JWT_SECRET` và Google credentials an toàn.

## Tài liệu code & nơi tham khảo
- Entry point: `src/main.ts`
- Module gốc: `src/app.module.ts`
- Controller chính: `src/app.controller.ts` và các controller theo module (ví dụ `src/food/food.controller.ts`).

## Muốn tôi mở rộng?
Nếu bạn muốn, tôi có thể:
- Thêm hướng dẫn cài đặt chi tiết (biến môi trường cụ thể).
- Sinh file `README.md` / `CONTRIBUTING.md` dựa trên nội dung này.
- Tạo sơ đồ kiến trúc ngắn.

---
File này do GitHub Copilot tạo nhanh; báo mình nếu cần sửa nội dung, dịch sang tiếng Anh, hoặc mở rộng phần nào cụ thể.
