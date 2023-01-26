import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "profile-me",
  class Profile extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      // const cs = state.getState();
      // if (cs.token != "") {
      //   state.suscribe(() => {
      //     this.render();
      //   });
      //   this.render();
      // } else {
      //   Router.go("/home-page");
      // }
      const cs = state.getState();
      if (cs.token != "") {
        this.render();
      } else {
        Router.go("/home-page");
      }
    }
    render() {
      const currentState = state.getState();
      //   state.getUsuario2((cb) => {
      //     currentState.name = cb.name as any;
      //     state.setState(currentState);
      //   });
      this.innerHTML = `
        <section class="section-profile">
            <div class="container_profile">
                <h1 class="miPerfil">Mi perfil</h1>
                <p>Usuario:${currentState.name}</p>
                <p>Email:${currentState.email}</p>
                <button class="button-editar-profile">Editar Perfil</button>
                <button class="button-editar-password">Cambiar contraseña</button>
            </div>
        <section>
        <div class="div-button">
            <button id="cerrar"class="button-cerrar-sesion">Cerrar Sesión</button>
        </div>
        
        `;
      const buttonEditProfile = document.querySelector(
        ".button-editar-profile"
      );
      const buttonEditPassword = document.querySelector(
        ".button-editar-password"
      );
      const buttonCerrarSesion = document.querySelector(
        ".button-cerrar-sesion"
      );
      buttonEditProfile.addEventListener("click", () => {
        Router.go("/edit-name");
      });

      buttonEditPassword.addEventListener("click", () => {
        Router.go("/edit-password");
      });
      buttonCerrarSesion.addEventListener("click", () => {
        state.closeSesion();
        state.setOnline("offline", () => {
          Router.go("/home-page");
        });
      });
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
    }
  }
);
