import { Model, DataTypes, Sequelize } from 'sequelize';

class AnalyticsDailySummary extends Model {
  public id!: number;
  public date!: string;
  public totalRevenue!: number;
  public totalOrders!: number;
  public totalItemsSold!: number;
  public newUsers!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize) {
    AnalyticsDailySummary.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          unique: true,
        },
        totalRevenue: {
          type: DataTypes.DECIMAL(10, 2),
          defaultValue: 0,
          allowNull: false,
        },
        totalOrders: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        totalItemsSold: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        newUsers: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'AnalyticsDailySummary',
        tableName: 'AnalyticsDailySummaries',
      },
    );
  }

  static associate(_models: any) {
    // No associations needed for now
  }
}

export default AnalyticsDailySummary;
