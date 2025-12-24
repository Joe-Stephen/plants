import models, { sequelize } from '../models';

const verifyDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Optional: Sync only for testing if needed, or rely on migrations
    // await sequelize.sync({ force: true });

    console.log('Models loaded:', Object.keys(models));

    // Example usage check
    // const user = await models.User.create({ ... });

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

verifyDb();
