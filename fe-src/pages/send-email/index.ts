import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "send-email",
  class sendEmail extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      //   if (cs.myLat != "") {
      //     this.render();
      //   } else {
      //     alert(
      //       "Necesitamos tu ubicacion para que veas las mascotas cerca tuyo!"
      //     );
      //     Router.go("/home-page");
      //   }
      this.render();
      this.addListeners();
      // this.render();
      // this.addListeners();
    }
    addListeners() {}
    render() {
      const currentState = state.getState();
      const array = currentState.cercaMio.map((r) => {
        return r;
      });

      function email() {
        return array.find((e) => {
          if (e.objectID == currentState.emailAEnviar.objectID) {
            return e;
          }
        });
      }
      const petQueVi = email();
      this.innerHTML = `
        <section class="avisar__section">
            <div class="avisar__container">
            <button class="send-email__button salir">Volver</button>
            <form class="avisar__form">
                <h1 class="send-email__title">Reportar info de ${petQueVi.petName} </h1>
                <label>
                  <h2>Tu nombre</h2>
                  <input type="text" class="" name="nombre" required>
                </label>
                <label>
                  <h2>Tu telefono</h2>
                  <input type="text" class="" name="telefono" required>
                </label>
                <label>
                    <h2>¿Donde lo viste?</h2>
                    <textarea name="bio" class="bio" ></textarea>
                </label>
                <button class="send-email__button enviarEmail">Enviar</button>
            </form>
            </div>
        </section>
          
          `;

      const avisarSectionEl: HTMLElement =
        document.querySelector(".avisar__section");
      const formEl = document.querySelector(".avisar__form");
      const salir = document.querySelector(".salir");
      salir.addEventListener("click", () => {
        Router.go("/perdidas");
      });
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreDelReportador = e.target["nombre"].value;
        const telefono = e.target["telefono"].value;
        const bio = e.target["bio"].value;
        state.setemailAEnviar(
          {
            nombreDelReportador,
            telefono,
            bio,
          },

          (cb) => {
            const mensaje = {
              to: petQueVi.ownerEmail,
              from: "francocruzfjm7@gmail.com",
              subject: `Vieron tu mascota: ${petQueVi.petName}!`,
              text: "and",
              html: `<strong>Hola! Tenemos buenas noticias acerca de ${petQueVi.petName}!!
                      <br>Ya que ${currentState.emailAEnviar.nombreDelReportador}, tiene informacion de tu mascota.
                      <br>Te dejó este mensaje: "${currentState.emailAEnviar.bio}".
                      <br>Y aqui esta su telefono para que puedas comunicarte: ${currentState.emailAEnviar.telefono} 
                      </strong>`,
            };
            state.sendEmail(mensaje, () => {
              alert("tu mensaje ha sido enviado al dueño de la mascota!!");
              Router.go("/home-page");
            });
          }
        );
      });
      const style = document.createElement("style");

      style.innerHTML = `
      .avisar__section{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        margin-left: 20px;
        margin-right: 20px;
      }
      .avisar__container{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
      }
      .send-email__title{
        font-family:"Odibee Sans", cursive;
        font-size:48px;
        text-align:center;
        font-weight: bold;
      }
      .content__subtitle{
        font-family:"Odibee Sans", cursive;
        font-size:24px;
        text-align:center;
      }
      .avisar__form{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 400;
        gap: 20px;
      }
      .container-subtitle{
        text-align:center;
      }

      .send-email__button {
        background: red;
        border: none;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-size: 15px;
        transition: all 0.3s ease-in-out;
        border-radius: 25px;
        margin-top: 10px;
        letter-spacing: 0.1px;
        line-height: 1em;
        padding: 20px 30px;
        text-transform: uppercase;
        min-width: 200px;
      }
      .send-email__button:hover {
        transform: scale(1.2);
        transition: 0.3s;
        cursor: pointer;
      }
      .send-email__button:disabled{
        background:#e0e0e0;
        cursor: progress;
      }
      .salir{
        background-color:black
      }
      input, textarea {
        letter-spacing: 0.1px;
        border: 1px solid #e1e1e1;
        border-radius: 25px;
        padding: 10px 20px;
        font-size: 18px;
        min-width: 300px;
        transition: all 0.3s ease-in-out;
      } 
      input:focus, textarea:focus {
        transition: 0.5s;
        transform: scale(1.07);
      }
      textarea {
        resize: none;
        min-width: 320px;
      }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
