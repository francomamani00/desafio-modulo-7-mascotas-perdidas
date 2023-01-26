import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "profile-me",
  class Profile extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      if (cs.token != "") {
        this.render();
        this.addListeners();
      } else {
        Router.go("/home-page");
      }
    }
    addListeners() {}
    render() {
      const currentState = state.getState();

      this.innerHTML = `
      <form class="form-profile">
        <div class="container-profile">
         <h1 class="container-profile__title">Mis datos:</h1>
         <div class="container-profile__content">
            <p class="container-profile__description">Actualiza tus datos</p>
            <input type="text" name="name" placeholder="Nombre:" required>
            <input type="email" name="email" placeholder="${currentState.email}" readonly>
            <input type="password" name="password" placeholder="Contraseña:" required>
            <input type="password" name="password2" placeholder="Repita contraseña:" required>
            <button class="profile__button-actualizar">Actualizar!</button>
            <button class="profile__button-close">Cerrar Sesión</button>
         </div>
        </div>
     </form> 
     
        
        `;
      const form = document.querySelector(".form-profile") as any;
      console.log("state del profile", state.getState());
      //   const currentState = state.getState();
      const buttonActualizar = this.querySelector(
        ".profile__button-actualizar"
      );
      const buttonCerrarSesion = this.querySelector(".profile__button-close");
      //   state.getUsuario(currentState.token, (cb) => {
      //     form.name.value = cb.name;
      //     state.setState(currentState);
      //   });
      state.getUsuario2((cb) => {
        form.name.value = cb.name;
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = e.target["name"].value;
        const password = e.target["password"].value;
        const password2 = e.target["password2"].value;
        if (!password) {
          state.actualizarUsuario({ name }, () => {
            Router.go("/mensaje");
          });
        } else {
          if (password == password2) {
            state.actualizarUsuario({ name, password }, () => {
              Router.go("/mensaje");
            });
          } else {
            alert("las contraseñas no coinciden");
          }
        }
      });
      //   form.addEventListener("submit", (e) => {
      //     e.preventDefault();
      //     // button.disabled = true;
      //     const name = e.target["name"].value;
      //     const email = e.target["email"].value;
      //     const password = e.target["password"].value;
      //     const password2 = e.target["password2"].value;
      //     if (password == password2) {
      //       state.usuarioNuevo2(name, email, password, (resul) => {
      //         if (resul.message) {
      //           alert(resul.message);
      //         } else {
      //           currentState.name = name;
      //           currentState.email = email;
      //           //   currentState.password = password;
      //           state.setState(currentState);
      //           Router.go("/login");
      //         }
      //       });
      //     } else {
      //       alert("las contraseñas no coinciden");
      //     }
      //   });
      const style = document.createElement("style");

      style.innerHTML = `
      .section{
        display:flex;
        flex-direction:column;
        align-items:center;
        margin-left: 20px;
        margin-right: 20px;
      }
      .content__title{
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
      .container-subtitle{
        text-align:center;
      }
      .button {
        background: black;
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
      .button:hover {
        transform: scale(1.2);
        transition: 0.3s;
        cursor: pointer;
      }
      .button:disabled{
        background:#e0e0e0;
        cursor: progress;
      }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
