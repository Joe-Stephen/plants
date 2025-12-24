import { Model, DataTypes, Sequelize } from 'sequelize';

class Category extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
  public description!: string;
  public parentId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    Category.init(
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
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Category',
      },
    );
  }

  static associate(models: any) {
    Category.hasMany(models.Product, {
      foreignKey: 'categoryId',
      as: 'products',
    });
    Category.belongsTo(models.Category, {
      foreignKey: 'parentId',
      as: 'parent',
    });
    Category.hasMany(models.Category, {
      foreignKey: 'parentId',
      as: 'children',
    });
  }
}

export default Category;
