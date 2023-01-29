import { Router } from "@vaadin/router";
import { state } from "../../state";
customElements.define(
  "perdidas-page",
  class PerdidasPage extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const cs = state.getState();
      if (cs.myLat != "") {
        this.render();
      } else {
        alert(
          "Necesitamos tu ubicacion para que veas las mascotas cerca tuyo!"
        );
        Router.go("/home-page");
      }
      this.addListeners();
      // this.render();
      // this.addListeners();
    }
    addListeners() {}
    render() {
      const currentState = state.getState();
      if (!currentState.cercaMio[0]) {
        this.innerHTML = `
        <section class="section-mis-mascotas">

            <div class="container-title">
              <h1 class="content__title">Se encontraron 0 mascotas cerca tuyo</h1>
            </div>
        </section>
        `;
      } else {
        this.innerHTML = ` 
          <section class="section-mis-mascotas">

            <div class="container-title">
              <h1 class="content__title">Estas son las mascotas perdidas cerca tuyo</h1>
              <div class="results">
                <div class="results-item-template">
                  ${currentState.cercaMio
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
                        "button" + element.objectID
                      } visto">Yo lo vi</button>
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
      const avisarSectionEl: HTMLElement =
        document.querySelector(".avisar__section");

      currentState.cercaMio.map((e) => {
        const petClassButton = "button" + e.objectID;
        const button = "." + petClassButton;

        const loViButton = document.querySelector(button);
        // currentState.emailAEnviar.petName = e.petName;
        // currentState.emailAEnviar.location = e.location;
        if (loViButton) {
          loViButton.addEventListener("click", () => {
            state.setNumberEmailAEnviar(e.objectID, () => {
              Router.go("/send-email");
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
      .pet__card:hover {
        transform: translateY(2px);
        box-shadow: 0 12px 16px rgba(0, 0, 0, 0.2);
      }
      .location__card{
        font-weight: 200;
        font-size:24px;
        margin: 5px 0 0 0;
        font-family: "Odibee Sans", cursive;
      }
      .footer__card{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        margin: 0 15px;
        text-align:center;
        align-items:center;
      }
      .title__card{
        font-weight: 600;
        font-size:36px;

        font-family: "Odibee Sans", cursive;
      }
      .visto{
        background: none;
        border: none;
        background-color:red;
        color: #fff;
        border-radius:5px;
        padding:10px 10px;
        font-family:"Odibee Sans", cursive;
        font-size:20px;
        transition: all 0.3s ease-in-out;
      }
      .visto:hover {
        transform: scale(1.2);
        transition: 0.3s;
        cursor: pointer;
      }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
