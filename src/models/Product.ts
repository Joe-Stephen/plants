import { Model, DataTypes, Sequelize } from 'sequelize';

class Product extends Model {
  public id!: number;
  public categoryId!: number | null;
  public name!: string;
  public slug!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        categoryId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        stock: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'Product',
      },
    );
  }

  static associate(models: any) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category',
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: 'productId',
      as: 'images',
    });
    Product.hasMany(models.CartItem, { foreignKey: 'productId' });
    Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
  }
}

export default Product;
