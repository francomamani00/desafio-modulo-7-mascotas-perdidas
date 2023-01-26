import { User } from "./user";
import { Report } from "./report";
import { Pet } from "./pet";
import { Auth } from "./auth";
User.hasMany(Pet);
Pet.belongsTo(User);

User.hasMany(Report);
Report.belongsTo(User);
export { User, Pet, Auth, Report };
