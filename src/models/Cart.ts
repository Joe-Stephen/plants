import { Model, DataTypes, Sequelize } from 'sequelize';

class Cart extends Model {
  public id!: number;
  public userId!: number | null;
  public sessionId!: string | null;
  public items?: any[]; // Using any[] to avoid circular dependency import issues for now, or use CartItem[] if imported
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Cart.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sessionId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'Cart',
      },
    );
  }

  static associate(models: any) {
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cartId', as: 'items' });
  }
}

export default Cart;
