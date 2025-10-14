import { PrismaClient } from '@prisma/client';
import { foodSeedData } from './seeds/foods.seed';
import { exerciseSeedData } from './seeds/exercises.seed';
import { userSeedData } from './seeds/users.seed';
import { userProfileSeedData } from 'src/prisma/seeds/user-profile.seed';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Started loading seeds data');

  let foodCreated = 0;
  let foodUpdated = 0;
  let exerciseCreated = 0;
  let exerciseUpdated = 0;
  let userCreated = 0;
  let userUpdated = 0;
  let profileCreated = 0;
  let profileUpdated = 0;

  // 🧍 Users
console.log('\n👤 Seeding Users...');
const rawUsers = await userSeedData();
const users: any[] = [];

for (const user of rawUsers) {
  const existing = await prisma.user.findUnique({ where: { email: user.email } });

  // 🔐 BƯỚC MỚI: MÃ HÓA MẬT KHẨU
  // Giả sử user.passwordHash chứa plain text password
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(user.passwordHash, salt);
  
  // Tạo đối tượng dữ liệu chung, bao gồm mật khẩu đã hash
  const userData = {
    ...user, // Bao gồm tất cả các trường từ seed, kể cả email
    passwordHash: passwordHash,
  };

  if (existing) {
    // 💡 LƯU Ý: Nếu bạn chỉ muốn cập nhật tên/ngày sinh và KHÔNG muốn thay đổi mật khẩu
    // của người dùng đã có, bạn có thể loại bỏ 'passwordHash' khỏi 'data' ở đây.
    
    await prisma.user.update({
      where: { email: user.email },
      data: {
        fullName: userData.fullName,
        gender: userData.gender,
        dateOfBirth: userData.dateOfBirth,
        // Giữ lại mật khẩu cũ nếu không muốn cập nhật:
        // passwordHash: existing.passwordHash,
        // Hoặc cập nhật mật khẩu mới:
        passwordHash: userData.passwordHash, 
      },
    });
    console.log(`🔁 Updated user: ${user.email}`);
    userUpdated++;
    users.push(existing); // Giữ lại ID người dùng cũ
  } else {
    // 🔑 TẠO MỚI: Sử dụng mật khẩu đã hash
    const created = await prisma.user.create({ data: userData });
    console.log(`✅ Added new user: ${user.email}`);
    userCreated++;
    users.push(created);
  }
}

  // 🧬 UserProfiles
  console.log('\n📋 Seeding User Profiles...');
  for (let i = 0; i < users.length; i++) {
    const profile = userProfileSeedData[i];
    const existing = await prisma.userProfile.findUnique({ where: { userId: users[i].id } });

    if (existing) {
      await prisma.userProfile.update({
        where: { userId: users[i].id },
        data: {
          heightCm: profile.heightCm,
          weightKg: profile.weightKg,
          targetWeightKg: profile.targetWeightKg,
          activityLevel: profile.activityLevel,
          bmi: profile.bmi,
        },
      });
      console.log(`🔁 Updated profile for: ${users[i].email}`);
      profileUpdated++;
    } else {
      await prisma.userProfile.create({
        data: { ...profile, userId: users[i].id },
      });
      console.log(`✅ Created profile for: ${users[i].email}`);
      profileCreated++;
    }
  }

  // 🥗 Foods
  console.log('\n🥗 Seeding Foods...');
  for (const food of foodSeedData) {
    const existing = await prisma.food.findUnique({ where: { name: food.name } });

    if (existing) {
      await prisma.food.update({
        where: { name: food.name },
        data: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          portionSize: food.portionSize,
        },
      });
      console.log(`🔁 Updated food: ${food.name}`);
      foodUpdated++;
    } else {
      await prisma.food.create({ data: food });
      console.log(`✅ Added new food: ${food.name}`);
      foodCreated++;
    }
  }

  // 🏋️ Exercises
  console.log('\n🏋️ Seeding Exercises...');
  for (const exercise of exerciseSeedData) {
    const existing = await prisma.exercise.findUnique({ where: { name: exercise.name } });

    if (existing) {
      await prisma.exercise.update({
        where: { name: exercise.name },
        data: {
          caloriesBurnedPerHour: exercise.caloriesBurnedPerHour,
          type: exercise.type,
        },
      });
      console.log(`🔁 Updated exercise: ${exercise.name}`);
      exerciseUpdated++;
    } else {
      await prisma.exercise.create({ data: exercise });
      console.log(`✅ Added new exercise: ${exercise.name}`);
      exerciseCreated++;
    }
  }

  // 📊 Summary
  console.log('\n📊 Summary Report:');
  console.log(`👤 Users → ${userCreated} added, ${userUpdated} updated`);
  console.log(`📋 Profiles → ${profileCreated} added, ${profileUpdated} updated`);
  console.log(`🥗 Foods → ${foodCreated} added, ${foodUpdated} updated`);
  console.log(`🏋️ Exercises → ${exerciseCreated} added, ${exerciseUpdated} updated`);
  console.log('\n✅ All seeds loaded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    console.log('❌ Failed to Load!');
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
