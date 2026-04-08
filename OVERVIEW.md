# NutriMate - Tổng quan hệ thống đầy đủ chức năng

## 🎯 Mục tiêu hệ thống
NutriMate là backend REST API (NestJS + TypeScript) hỗ trợ theo dõi dinh dưỡng, tập luyện và sức khỏe. Tính năng chính: quản lý user, auth (JWT + Google), tracking bữa ăn/nước/tập, calculator BMI/recommendation, AI nhận diện ảnh món ăn từ VN foods.

## 🏗️ Kiến trúc
- **Framework**: NestJS (modular)
- **DB**: PostgreSQL + Prisma ORM (`src/prisma/schema.prisma`)
- **Auth**: JWT Guard + Google OAuth Strategy
- **Upload**: Profile pics (`uploads/profile-pictures/`), meal photos
- **AI/ML**: Meal photo recognition (`meal-photo.service.ts`, queue)
- **Package**: pnpm (workspace), seeds (`prisma/seed.ts`, foods_vn.csv)
- **Modules chính**: auth, user*, food, meal-log, workout-log*, calculator*, dashboard, water, exercise*, meal-photo

(*: Có DTOs cho CRUD)

## 📋 Danh sách đầy đủ chức năng - APIs (Controllers)

| Module | Method + Endpoint | Mô tả |
|--------|-------------------|-------|
| **Auth** (`/auth`) | POST `/register` | Đăng ký user (RegisterDto) |
| | POST `/login` | Đăng nhập (LoginDto) → JWT |
| | GET `/google`, `/google/callback` | Google OAuth flow |
| | POST `/google/verify` | Verify Google token |
| | POST `/link-social` | Link social (JWT protected) |
| | GET `/status` | Check auth status (JWT) |
| **Dashboard** (`/dashboard`) | GET `/summary?date=...` (GetSummaryDto) | Tổng hợp stats user |
| **Food** (`/food`) | GET `/search?q=...` (SearchFoodDto) | Hybrid search thực phẩm VN |
| **WorkoutLog** (`/workout-log`) | GET `/today` | Nhật ký tập hôm nay |
| | CRUD via DTOs (CreateWorkoutLogDto, etc.) | Tạo/cập nhật log tập |
| **Calculator/Health** (`/calculator/health`) | GET `/bmi` | Tính BMI từ profile |
| **Calculator/Recommendation** (`/calculator/recommendation`) | GET `/generate` | Tạo gợi ý dinh dưỡng |
| | GET `/latest` | Lấy recommend gần nhất |
| **Water** (`/water`) | POST `/logs` (CreateWaterLogDto) | Log nước uống |
| | GET `/logs?date=...` | Lấy logs nước |
| | PUT `/goal` (UpdateWaterGoalDto) | Set mục tiêu nước/ngày |
| | GET `/summary?date=...` | Tóm tắt nước |
| **UserProfile** (`/user-profile`) | POST `/picture` (FileInterceptor) | Upload ảnh profile |
| | CRUD profile (UpdateUserProfileDto) | Cập nhật height/weight/BMI |
| **MealPhoto** (`/meal-photo`) | POST `/upload` (FileInterceptor) | Upload ảnh bữa ăn → AI recognize |
| | GET `/list` | List tất cả meal photos |
| **User** (`/user`) | CRUD (CreateUserDto, UpdateUserDto) | Quản lý user cơ bản |
| **Exercise** (`/exercise`) | CRUD (CreateExerciseDto) | Quản lý bài tập |
| **MealLog** (`/meal-log`) | CRUD (CreateMealLogDto) | Log bữa ăn + calories |

**Lưu ý APIs**: Hầu hết protected bằng JWT. DTOs validate input.

## 🗄️ Database Schema (Prisma Models)

| Model | Fields chính | Relations |
|-------|--------------|-----------|
| **User** | id, email(unique), passwordHash, fullName, gender, DOB, googleId, profilePictureUrl | 1:1 Profile, 1:N Logs/Photos/Recommendations |
| **UserProfile** | userId(unique), heightCm, weightKg, targetWeightKg, activityLevel(enum), bmi | User |
| **Food** | id, name, unit(100g), externalId, **Macros**: calories/protein/fat/carbs/fiber/sugar/satFat/cholesterol, **Minerals**: Na/K/Ca/Fe/Mg, **Vitamins**: A/C/D/E/K/B6/B12 | 1:N MealLogs |
| **MealLog** | userId, foodId, quantity, mealType, loggedAt, totalCalories | User, Food, 1:N MealPhotos |
| **WorkoutLog** | userId, exerciseId, durationMin, caloriesBurned, loggedAt | User, Exercise |
| **Exercise** | id, name(unique), caloriesBurnedPerHour, type | 1:N WorkoutLogs |
| **Recommendation** | userId(unique), recCalories/Protein/Fat/Carbs/Exercise, generatedAt | User |
| **MealPhoto** | userId/mealLogId, filename/path, status(QUEUED/PROCESSING/...), recognitionResult(Json), suggestedCalories/confidence | User/MealLog |
| **WaterLog** | userId, amountMl, loggedAt | User |
| **WaterGoal** | userId(unique), dailyGoalMl, reminderEnabled/hour/min | User |

**Enums**: MealPhotoStatus, ActivityLevel (SEDENTARY→VERY_ACTIVE).

## ✨ Tính năng nổi bật
- **Auth Social**: Google login/link (strategies/google.strategy.ts).
- **AI Photo Recognition**: Upload ảnh → queue → recognize món ăn/calories (`recognition.service.ts`).
- **Calculators**: BMI (`health.service.ts`), dinh dưỡng recommend dựa profile.
- **Tracking realtime**: Meal/workout/water logs w/ timestamps.
- **VN Data**: Foods CSV seed, hybrid search.
- **Seeds**: users.seed.ts, foods.seed.ts (VN), exercises.seed.ts.

## 🚀 Hướng dẫn Setup & Run
1. **Cài deps**: `pnpm install`
2. **Env vars** (.env): DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID/SECRET
3. **DB**: `npx prisma generate && npx prisma migrate dev && npx prisma db seed` (or `pnpm run seed`)
4. **Dev**: `pnpm run start:dev` (port 3000)
5. **Test**: `pnpm run test:e2e`

## 📁 Files quan trọng
- **Seeds**: `src/prisma/seeds/*`, `foods_vn.csv`
- **Migrations**: `src/prisma/migrations/`
- **Uploads**: `uploads/profile-pictures/`, meal photos

**Hoàn tất scan!** File này liệt kê **đầy đủ** chức năng từ controllers/schema/services.

