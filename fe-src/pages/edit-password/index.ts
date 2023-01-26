import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "edit-password",
  class EditPassword extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      if (cs.token != "") {
        this.render();
      } else {
        Router.go("/home-page");
      }
    }
    addListeners() {}
    render() {
      this.innerHTML = `
      <form class="form-edit-password">
        <div class="container-edit-password">
         <h1 class="container-edit-password__title">Editar tu password:</h1>
         <div class="container-edit-password__content">
            <input type="password" name="password" placeholder="password" required>
            <input type="password" name="password2" placeholder="password" required>
            <button class="edit-password__button">Actualizar</button>
         </div>
        </div>
     </form> 
        
        `;
      const form = document.querySelector(".form-edit-password");
      const currentState = state.getState();
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const button = this.querySelector(".edit-password__button") as any;
        const password = e.target["password"].value;
        const password2 = e.target["password2"].value;
        if (password == password2) {
          state.actualizarPassword({ password }, (resul) => {
            if (resul.message) {
              alert(resul.message);
            } else {
              //   currentState.password = password;
              //   state.setState(currentState);
              Router.go("/datos-guardados");
            }
          });
        } else {
          alert("Te olvidaste de poner tu nueva password!");
        }
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
