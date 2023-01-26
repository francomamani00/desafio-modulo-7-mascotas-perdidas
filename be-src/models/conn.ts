console.log("hola");
// import { Sequelize, Model, DataTypes } from "sequelize";
// //En este gist
// //  podés encontrar el objeto de conexión completo
// // , con todas las opciones necesarias para conectarte correctamente.
// // Tené en cuenta que es más cómodo guardar este objeto en un archivo separado
// // , al que podemos nombrar como db.ts
// export const sequelize = new Sequelize({
//   dialect: "postgres",
//   username: "htysoaxemjwwuq",
//   password: "a9334b26ba837063aeda65ac071f05dd6c6c46390e15caafd51fd73a677f90bc",
//   database: "d7i9dro56ndfeb",
//   port: 5432,
//   host: "ec2-34-203-182-65.compute-1.amazonaws.com",
//   ssl: true,
//   // esto es necesario para que corra correctamente
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });
// hasta aca
import { Sequelize, Model, DataTypes } from "sequelize";

export const sequelize = new Sequelize(
  "postgres://afemtbkn:i_mbG5Tinb0ibXXNa_7B-VrduzZKhOx5@babar.db.elephantsql.com/afemtbkn"
);
