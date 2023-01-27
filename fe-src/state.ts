const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3005";
type Estado = "online" | "offline";
const state = {
  data: {
    email: "",
    name: "",
    myLat: "",
    myLng: "",
    userId: "",
    token: "",
    estado: "",
    meReports: [],
    editar: {
      report: 0,
      newPetName: "",
      newLocation: "",
      newPetImage: "",
      newPetLat: "",
      newPetLng: "",
    },
    petReported: {
      location: "",
      petImage: "",
      lat: "",
      lng: "",
      petName: "",
    },
  },
  listeners: [],
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
      console.log("soy el state he cambiado", state.getState());
    }

    console.log("Soy el state, he cambiado:", newState);
  },
  closeSesion() {
    let data = this.getState();
    data.name = "";
    data.password = "";
    data.email = "";
    (data.myLat = ""),
      (data.myLng = ""),
      (data.userId = ""),
      (data.token = ""),
      (data.meReports = []);
    (data.petReported = {
      location: "",
      petImage: "",
      lat: "",
      lng: "",
      petName: "",
    }),
      (data.editar = {
        report: 0,
        newPetName: "",
        newLocation: "",
        newPetImage: "",
        newPetLat: "",
        newPetLng: "",
      });
    // (data.estado = ""),
    this.setState(data);
  },
  suscribe(cb: (any) => any) {
    this.listeners.push(cb);
  },
  getToken(cb) {
    cb(localStorage.getItem("Token"));
  },
  clearToken(cb) {
    cb(localStorage.removeItem("Token"));
  },
  setOnline(estado: Estado, cb?) {
    const cs = this.getState();
    cs.estado = estado;
    this.setState(cs);
    localStorage.setItem("estado", estado);
    if (cb) cb();
  },

  setLoc(lat, lng, callback) {
    const cs = state.getState();
    cs.myLat = lat;
    cs.myLng = lng;
    this.setState(cs);
    callback();
  },
  usuarioNuevo(callback) {
    const cs = state.getState();
    fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: cs.name,
        email: cs.email,
        password: cs.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.name = data.name;
        cs.email = data.email;
        cs.password = data.password;
        cs.userId = data.userId;
        this.setState();
      });
  },
  usuarioNuevo2(name: string, email: string, password: string, cb?) {
    const cs = state.getState();
    fetch(API_BASE_URL + "/auth", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((datos) => {
        console.log("datos del Auth", datos);
        cb(datos);
      });
  },

  usuarioLogin(email: string, password: string, cb?) {
    fetch(API_BASE_URL + "/auth/token", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((datos) => {
        const token = datos[0];
        cb(datos);
      });
  },
  getUsuario(token, cb?) {
    const cs = this.getState();
    const tokenBearer = "bearer " + token;
    fetch(API_BASE_URL + "/me", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("datadeluser", data.user);
        // (cs.email = data.email), (cs.name = data.name), (cs.userId = data.id);
        // this.setState(cs);
        console.log(cs);
        cb(data);
      });
  },
  //ESTE SIRVE DE ABAJO Y LO ESTOY USANDO
  getUsuario2(cb?) {
    const cs = this.getState();
    const idUsuario = cs.userId;
    const tokenBearer = "bearer " + cs.token;
    fetch(API_BASE_URL + "/usuario/" + idUsuario, {
      method: "GET",
      headers: {
        Authorization: tokenBearer,
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // (cs.email = data.email), (cs.name = data.name), (cs.userId = data.id);
        // this.setState(cs);
        // console.log(cs);
        console.log("data de getusuario2", data);
        cb(data);
      });
  },

  actualizarName(datos: any, cb?) {
    const cs = state.getState();
    const idUsuario = cs.userId;
    const tokenBearer = "bearer " + cs.token;
    fetch(API_BASE_URL + "/edit-name", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
      body: JSON.stringify(datos),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data de actualizarname", data);
        cb(data);
      });
  },
  actualizarPassword(datos: any, cb?) {
    const cs = state.getState();
    const idUsuario = cs.userId;
    const tokenBearer = "bearer " + cs.token;
    fetch(API_BASE_URL + "/edit-password", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
      body: JSON.stringify(datos),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data de actualizarpassword", data);
        cb(data);
      });
  },
  reportarMascota(datos: any, cb?) {
    const cs = state.getState();
    const idUsuario = cs.userId;
    const tokenBearer = "bearer " + cs.token;
    console.log("datos en el state reportarMascota", datos);
    fetch(API_BASE_URL + "/report-pet", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
      body: JSON.stringify(datos),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.petReported.petName = data.petName;
        cs.petReported.location = data.location;
        cs.petReported.petImage = data.petImage;
        console.log("data de reportar mascota", data);
        this.setState(cs);
        cb(data);
      });
  },
  getReportesDeUnUser(callback) {
    const cs = this.getState();
    const tokenBearer = "bearer " + cs.token;
    fetch(API_BASE_URL + "/me/mis-reportes", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data del getReportes de un user", data);
        if (data[0]) {
          cs.meReports = data;
        }

        this.setState(cs);
        callback(data);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  clearPetReported() {
    const cs = state.getState();
    cs.petReported.location = "";
    cs.petReported.petImage = "";
    cs.petReported.lat = "";
    cs.petReported.lng = "";
    cs.petReported.petName = "";
    state.setState(cs);
  },
  setReportLocation(lat, lng) {
    let cs = this.getState();
    console.log(lat, lng);
    cs.petReported.lat = lat;
    cs.petReported.lng = lng;
    this.setState(cs);
  },
  setEditReportLocation(lat, lng) {
    let cs = this.getState();
    cs.editar.newPetLat = lat;
    cs.editar.newPetLng = lng;
    this.setState(cs);
  },
  setNumberReport(id: number, callback) {
    let cs = this.getState();
    cs.editar.report = id;
    this.setState(cs);
    callback();
  },
  editarMascota(datos: any, cb?) {
    const cs = state.getState();
    const idUsuario = cs.userId;
    const tokenBearer = "bearer " + cs.token;
    console.log("datos en el state editarMascota", datos);
    fetch(API_BASE_URL + "/reportes/" + cs.editar.report, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: tokenBearer,
      },
      body: JSON.stringify(datos),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // cs.petReported.petName = data.petName;
        // cs.petReported.location = data.location;
        // cs.petReported.petImage = data.petImage;
        console.log("data de editar mascota", data);
        // this.setState(cs);
        cb(data);
      });
  },
};
export { state };
