import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "login-page",
  class LoginPage extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.addListeners();
    }
    addListeners() {}
    render() {
      this.innerHTML = `
      <form class="form-login">
        <div class="container-login">
         <h1 class="container-login__title">Login</h1>
         <div class="container-login__content">
            <p class="container-login__description">Ingrese su correo electronico !!!</p>
            <input type="email" name="email" placeholder="correo electronico" required>
            <input type="password" name="password" placeholder="contraseña" required>
            <button class="login__button">ingresar</button>
            <p class="container-login__description">¿No tenés cuenta aún? <a href="usuario-nuevo">Crear cuenta</a></p>
         </div>
        </div>
     </form> 
        
        `;
      const form = document.querySelector(".form-login");
      console.log(state.getState());
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const button = this.querySelector(".login__button") as any;
        // button.disabled = true;
        const email = e.target["email"].value;
        const password = e.target["password"].value;
        state.usuarioLogin(email, password, (resul) => {
          if (resul.message) {
            alert(resul.message);
          } else {
            const cs = state.getState();
            cs.email = email;
            // cs.estado =
            // cs.password = password;
            cs.token = resul.token;
            cs.userId = resul.userId;
            state.getUsuario2((cb) => {
              cs.name = cb.name as any;
            });
            state.setState(cs);
            state.setOnline("online");
            Router.go("/home-page");
          }
        });
      });
      // const button2 = this.querySelector(".login__button");
      // button2.addEventListener("click", () => {
      //   //obtener ubicacion actual

      //   Router.go("/home-page");
      // });
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
