import { Model, DataTypes } from "sequelize";
import { sequelize } from "../models/conn";

export class Report extends Model {}
Report.init(
  {
    petName: DataTypes.STRING,
    petImage: DataTypes.STRING,
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    commentary: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    ownerEmail: DataTypes.STRING,
  },
  { sequelize, modelName: "report" }
);
