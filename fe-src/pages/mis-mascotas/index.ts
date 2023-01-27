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
      const currentState = state.getState();
      console.log(currentState.meReports);
      if (!currentState.meReports[0]) {
        this.innerHTML = `
        <section class="section-mis-mascotas">

            <div class="container-title">
              <h1 class="content__title">No tenes ninguna mascota reportada</h1>
            </div>
        </section>
        `;
      } else {
        this.innerHTML = ` 
          <section class="section-mis-mascotas">

            <div class="container-title">
              <h1 class="content__title">Estas son tus mascotas reportadas</h1>
              <div class="results">
                <div class="results-item-template">
                  ${currentState.meReports
                    .map(
                      (element) =>
                        `
                    <div class="pet__card">
                      <img class="img-src__card" src="${
                        element.petImage
                      }" crossorigin="anonymous">
                      <h3 class="location__card">${element.location}</h3>
                      <div class="footer__card">
                      <h1 class="title__card">${element.petName}</h1>
                      <button class="${
                        "button" + element.id
                      } editar">Editar</button>
                      </div>
                    
                    </div>
                    `
                    )
                    .join("")}
                </div>
              </div>
            </div>
        </section>
          
          `;
      }
      currentState.meReports.map((e) => {
        const petClassButton = "button" + e.id;
        const button = "." + petClassButton;

        const avisar = document.querySelector(button);

        if (avisar) {
          avisar.addEventListener("click", () => {
            state.setNumberReport(e.id, () => {
              Router.go("/edit-pet");
              //
            });
          });
        }
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
      .results-item-template{
        width: 100%;
        margin: 0 auto;
        text-align: center;
      }
      .img-src__card {
        width: 100%;
        height: 140px;
        background-size:contain;
      }
      .pet__card {
        display: inline-table;
        background-color: #F5F3EE;
        width:340px;
        height: 220px;
        border-radius: 5px;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        margin: 20px;
        transition: all 0.25s;
        text-align: center;
        position: static;
        z-index: 1;
      }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
