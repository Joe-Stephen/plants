import { Model, DataTypes, Sequelize } from 'sequelize';

class Order extends Model {
  public id!: number;
  public userId!: number;
  public addressId!: number | null;
  public total!: number;
  public status!: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  public razorpayOrderId!: string | null;
  public razorpayPaymentId!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Order.init(
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
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(
            'PENDING',
            'PAID',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
          ),
          defaultValue: 'PENDING',
        },
        razorpayOrderId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        razorpayPaymentId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Order',
      },
    );
  }

  static associate(models: any) {
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Order.belongsTo(models.Address, { foreignKey: 'addressId', as: 'address' });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'items' });
  }
}

export default Order;
