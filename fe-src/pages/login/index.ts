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
            <p class="container-login__description">Ingrese su correo electronico</p>
            <input type="email" name="email" placeholder="correo electronico" required>
            <input type="password" name="password" placeholder="contraseña" required>
            <button class="login__button">ingresar</button>
            <p class="container-login__description">¿No tenés cuenta aún? <a href="usuario-nuevo">Crear cuenta</a></p>
         </div>
        </div>
     </form> 
        
        `;
      const form = document.querySelector(".form-login");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const button = this.querySelector(".login__button") as any;
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

      const style = document.createElement("style");

      style.innerHTML = `
      .section{
        display:flex;
        flex-direction:column;
        align-items:center;
        margin-left: 20px;
        margin-right: 20px;
      }
      .container-login__title{
        font-family:"Odibee Sans", cursive;
        font-size:48px;
        text-align:center;
        font-weight: bold;
      }
      .container-login__description{
        font-family:"Odibee Sans", cursive;
        font-size:24px;
        text-align:center;
      }
      .container-login{
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        margin-right: 20px;
      }
      .container-login__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 400;
        gap: 20px;
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
      .login__button {
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
      .login__button:hover {
        transform: scale(1.2);
        transition: 0.3s;
        cursor: pointer;
      }
      .login__button:disabled{
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
