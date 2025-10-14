import * as bcrypt from 'bcrypt';

export const userSeedData = async () => {
  const passwordHash = await bcrypt.hash('Hoanglong123', 20);

  return [
    {
      email: 'long@example.com',
      passwordHash,
      fullName: 'Lý Hoàng Long',
      gender: 'male',
      dateOfBirth: new Date('2001-05-20'),
    },
    {
      email: 'thao@example.com',
      passwordHash,
      fullName: 'Nguyễn Thị Thảo',
      gender: 'female',
      dateOfBirth: new Date('2002-08-12'),
    },
    {
      email: 'minh@example.com',
      passwordHash,
      fullName: 'Trần Văn Minh',
      gender: 'male',
      dateOfBirth: new Date('2000-11-05'),
    },
  ];
};
