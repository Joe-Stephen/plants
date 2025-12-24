import { Model, DataTypes, Sequelize } from 'sequelize';

class ProductImage extends Model {
  public id!: number;
  public productId!: number;
  public url!: string;
  public is_primary!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    ProductImage.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        is_primary: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'ProductImage',
      },
    );
  }

  static associate(models: any) {
    ProductImage.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product',
    });
  }
}

export default ProductImage;
