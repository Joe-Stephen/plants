import models from './src/models';

const listUsers = async () => {
  try {
    const users = await models.User.findAll();
    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

listUsers();
