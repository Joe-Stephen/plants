import { Model, DataTypes, Sequelize } from 'sequelize';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'USER' | 'ADMIN';
  public status!: 'active' | 'inactive';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('USER', 'ADMIN'),
          defaultValue: 'USER',
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive'),
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        modelName: 'User',
      },
    );
  }

  static associate(models: any) {
    User.hasMany(models.Address, { foreignKey: 'userId', as: 'addresses' });
    User.hasOne(models.Cart, { foreignKey: 'userId', as: 'cart' });
    User.hasMany(models.Order, { foreignKey: 'userId', as: 'orders' });
  }
}

export default User;
