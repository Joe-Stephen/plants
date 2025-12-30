import models from './src/models';
import bcrypt from 'bcryptjs';

const resetPassword = async () => {
  try {
    const user = await models.User.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!user) {
      console.log('User not found');
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash('newpassword123', 10);
    user.password_hash = hashedPassword;
    await user.save();
    console.log(`Password for ${user.email} reset to 'newpassword123'`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    process.exit();
  }
};

resetPassword();
