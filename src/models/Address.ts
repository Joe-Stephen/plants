import { Model, DataTypes, Sequelize } from 'sequelize';

class Address extends Model {
  public id!: number;
  public userId!: number;
  public street!: string;
  public city!: string;
  public state!: string;
  public zip!: string;
  public country!: string;
  public is_default!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Address.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        zip: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_default: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'Address',
      },
    );
  }

  static associate(models: any) {
    Address.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Address.hasMany(models.Order, { foreignKey: 'addressId', as: 'orders' });
  }
}

export default Address;
