import { User, Pet, Report, Auth } from "../models";
import { cloudinary } from "../lib/cloudinary";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
const SECRET = process.env.SECRET;
function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}
// entonces este controlller se dedica exclusivamente para crear un product de un user
export async function createUser(updateData) {
  const [user, created] = await User.findOrCreate({
    where: { email: updateData.email },
    defaults: {
      name: updateData.name,
      email: updateData.email,
    },
  });
  console.log({ user, created });
  return user;
}
export async function createAuth(userId, data) {
  const [auth, authCreated] = await Auth.findOrCreate({
    where: {
      user_id: userId,
    },
    defaults: {
      email: data.email,
      password: getSHA256ofString(data.password),
      user_id: userId,
    },
  });

  return auth;
}

export async function updateProfile(userId, updateData) {
  // console.log("hola soy el updated data del controller funcion", updateData);
  if (updateData.pictureURL) {
    // aca es donde se sube el archivo a cloudinary y despues nos devuelve
    // en imagen.secure_url la url de cloudinary con la foto ya subida
    const imagen = await cloudinary.uploader.upload(updateData.pictureURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    const updateDataComplete = {
      fullname: updateData.fullname,
      bio: updateData.bio,
      pictureURL: imagen.secure_url,
    };
    // console.log("updateDataComplete", updateDataComplete);
    await User.update(updateDataComplete, {
      where: {
        id: userId,
      },
    });
    return updateDataComplete;
  } else {
    console.error("no hay imagen adjunta");
  }
}

export async function findToken(data) {
  try {
    const auth = await Auth.findOne({
      where: {
        email: data.email,
        password: getSHA256ofString(data.password),
      },
    });
    await console.log("auth", auth);
    const userId = await auth.get("id");
    await console.log(userId, "userId");
    const token = await jwt.sign({ id: auth.get("id") }, SECRET);
    console.log(token, "token");
    return { token, userId };
  } catch (err) {
    console.log(err);
  }
}
export async function findUser(userId) {
  const user = await User.findByPk(userId);
  return user;
}

//ESTE USO
export async function updateName(name, id) {
  const respuesta: any = {};
  respuesta.name = name;
  console.log("RESPUESTA", respuesta);
  const perfilActualizado = await User.update(respuesta.name, {
    where: { id },
  });
  return perfilActualizado;
}
// export async function updatePassword(password, id) {
//   console.log("updatepassword", password, id);
//   const passwordHasheada = getSHA256ofString(password.password);
//   console.log("passwordhasheada", passwordHasheada);
//   const respuesta: any = {};
//   respuesta.password = passwordHasheada;
//   console.log("respuesta", respuesta);
//   const perfilActualizado = await Auth.update(respuesta.password, {
//     where: { id },
//   });
//   console.log("perfilactualizado", perfilActualizado);
//   return perfilActualizado;
// }
export async function updatePassword(password, id) {
  const editarUsuario = await Auth.update(
    {
      password: getSHA256ofString(password),
    },
    {
      where: { id },
    }
  );
  return editarUsuario;
}
export async function updateUser(data, userId) {
  const { name, password } = data;
  const user = await Auth.findByPk(userId);
  const updatedUser = await Auth.update(
    {
      ...user,
      name,
      password: getSHA256ofString(password),
    },
    {
      where: {
        id: userId,
      },
    }
  );
  return updatedUser;
}

// MODIFICAR USUARIO POR ID
// export async function updatePassword(id, password) {
//   const editarUsuario = await Auth.update(
//     {
//       password: getSHA256ofString(password),
//     },
//     {
//       where: { id },
//     }
//   );
//   return editarUsuario;
// }
export async function getAllUsers() {
  const users = await User.findAll();
  return users;
}
export async function getProfile(userId) {
  const userProfile = await User.findByPk(userId);
  return userProfile;
}
