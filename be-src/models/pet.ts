import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";
export class Pet extends Model {}
Pet.init(
  {
    petname: DataTypes.STRING,
    petImage: DataTypes.STRING,
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    founded: { type: DataTypes.BOOLEAN, defaultValue: false },
    user_id: DataTypes.INTEGER,
  },
  { sequelize, modelName: "pet" }
);
