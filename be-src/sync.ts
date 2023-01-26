// import { sequelize } from "./models/conn";

// sequelize.sync({ alter: true }).then((res) => {
//   console.log(res);
// });

// ts-node ./be-src/sync

import { User, Pet, Report } from "./models";
User.sequelize.sync({ force: true }).then((res) => {
  console.log(res);
});
