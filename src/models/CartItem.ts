import { Model, DataTypes, Sequelize } from 'sequelize';

class CartItem extends Model {
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    CartItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        cartId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: 'CartItem',
      },
    );
  }

  static associate(models: any) {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default CartItem;
