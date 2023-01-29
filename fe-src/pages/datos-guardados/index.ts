import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "datos-guardados",
  class DatosGuardados extends HTMLElement {
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
      this.render();
    }
    addListeners() {}
    render() {
      this.innerHTML = `
      
        <div class="container-perfil-actualizado">
         <h1 class="container-perfil-actualizado__title">Tus datos han sido guardados correctamente!!</h1>
        </div>
     
        
        `;

      const style = document.createElement("style");

      style.innerHTML = `
      .container-perfil-actualizado{
        margin-top:20px;
        margin-left:30px;
        margin-right:30px;
        display:flex;
        align-items:center;
      }
      .container-perfil-actualizado__title{
        text-align:center;
      }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
