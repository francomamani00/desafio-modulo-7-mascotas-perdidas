import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "mis-mascotas",
  class MisMascotas extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      if (cs.token != "") {
        this.render();
      } else {
        Router.go("/login");
      }
      this.addListeners();
      // this.render();
    }
    addListeners() {}
    render() {
      this.innerHTML = `
        <section class="section">

            <div class="container-title">
              <h1 class="content__title">Estas son tus mascotas</h1>
            </div>
            <div class="container-subtitle">
              <p class="content__subtitle">Se encontraron 0 mascotas cerca tuyo</p>
            </div>

        </section>
        
        
        `;
      const button = this.querySelector(".button");

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

      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
