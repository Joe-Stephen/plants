import models from './src/models';

const promoteUser = async () => {
  try {
    const user = await models.User.findOne({
      where: { email: 'test@example.com' },
    });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = 'ADMIN';
    await user.save();
    console.log(`User ${user.email} promoted to ADMIN`);
  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    process.exit();
  }
};

promoteUser();
