import * as express from "express";
import * as path from "path";
import "dotenv/config";
import * as jwt from "jsonwebtoken";
import { index } from "./lib/algolia";
import {
  createUser,
  createAuth,
  getAllUsers,
  findToken,
  findUser,
  updateUser,
  updatePassword,
  updateName,
} from "./controllers/users-controller";

import { createPet } from "./controllers/pets-controller";
import {
  allReports,
  actulizarReport,
  createReport,
  unReporte,
  deletePet,
  reportesCerca,
} from "./controllers/reports-controller";
import { User, Pet, Auth, Report } from "./models";
import * as cors from "cors";
import { enviarEmail } from "./lib/sendgrid";
const app = express();
app.use(cors());
const port = process.env.PORT || 3005;
const SECRET = process.env.SECRET;

app.use(express.json({ limit: "50mb" }));
app.get("/test", async (req, res) => {
  const usersAuth = await Report.findAll();
  res.json(usersAuth);
});

//signup NUEVO USUARIO
app.post("/auth", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no hay datos en el body",
    });
  }
  const newUser = await createUser(req.body);
  const newAuth = await createAuth(newUser.get("id"), req.body);
  const data = {
    email: newAuth.getDataValue("email"),
    name: newUser.getDataValue("name"),
    userId: newAuth.getDataValue("id"),
  };
  res.json(data);
});
//signin LOGEARSE
app.post("/auth/token", async (req, res) => {
  const auth = await findToken(req.body);
  if (auth) {
    res.json(auth);
  } else {
    res.status(400).json({
      message: "user or pass are incorrect",
    });
  }
});
function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const data = jwt.verify(token, SECRET);
    req._user = data;

    next();
  } catch (e) {
    res.status(401).json({ error: "unauthorized" });
  }
}
//me
app.get("/me", authMiddleware, async (req, res) => {
  try {
    console.log("/me, antes de finduser", req._user.id);
    const user = await findUser(req._user.id);
    res.json({ user });
  } catch (err) {
    console.log(err);
  }
});
//BUSCA POR ID USUARIO ESTE USO
app.get("/usuario/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;
  const usuario = await findUser(id);
  console.log("id y usuarioooo", id, usuario);
  res.json(usuario);
});

app.put("/edit-name", authMiddleware, async (req, res) => {
  if (req.body) {
    const datos = await updateName(req.body, req._user.id);
    res.json(datos);
  } else {
    res.json({ error: "faltan datos" });
  }
});
app.put("/edit-password", authMiddleware, async (req, res) => {
  if (req.body) {
    const { password } = req.body;
    const datos = await updatePassword(password, req._user.id);
    console.log("datosssss", datos);
    res.json(datos);
  } else {
    res.json({ error: "faltan datos" });
  }
});
app.get("/users", async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

//
//PETS
//

app.post("/report-pet", authMiddleware, async (req, res) => {
  try {
    if (!req._user.id) {
      res.status(400).json("unauthorized");
    } else {
      const pet = await createReport(req._user.id, req.body);
      console.log("dentro de pet", req.body, pet);
      res.json(pet);
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/reportes/all", async (req, res) => {
  const data = await allReports();
  res.json(data);
});

app.get("/me/mis-reportes", authMiddleware, async (req, res) => {
  const data = await unReporte(req._user.id);
  res.json(data);
});

app.put("/reportes/:id", authMiddleware, async (req, res) => {
  if (req.body) {
    const datos = await actulizarReport(req.body, req.params.id, req._user.id);
    res.json(datos);
  } else {
    res.json({ error: "faltan datos" });
  }
});
app.delete("/delete-report/:id", authMiddleware, async (req, res) => {
  console.log(req.params.id);
  if (req.body) {
    const respuesta = await deletePet(req.params.id);
    res.json(respuesta);
  } else {
    res.json({ error: "faltan datos" });
  }
});
app.get("/reportes-cerca-de", async (req, res) => {
  if ((req.query.myLng, req.query.myLat)) {
    const cerca = await reportesCerca(req.query.myLat, req.query.myLng);
    res.json(cerca);
  } else {
    res.json({ error: "falta tu ubicacion" });
  }
});
app.post("/send-email", async (req, res) => {
  const { msg } = req.body;
  const viLaMascota = await enviarEmail(msg);
  res.json({ viLaMascota });
});
app.listen(port, () => {
  console.log("corriendo en", port);
});
