import { Router } from "@vaadin/router";
import { state } from "./../../state";
// import { state } from "../../state";
customElements.define(
  "home-page",
  class HomePage extends HTMLElement {
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
        
        <section class="section-home">

            <div class="container-title-home">
              <h1 class="content__title-home">Estas son las mascotas perdidas cerca tuyo</h1>
            </div>
            <div class="container-subtitle-home">
              <p class="content__subtitle-home"> Necesitamos permiso para conocer tu ubicación.</p>
              <button class="button-home">Dar mi ubicacion</button>
            </div>

        </section>
        
        
        `;
      // Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.
      const button = this.querySelector(".button-home");
      button.addEventListener("click", () => {
        //obtener ubicacion actual
        navigator.geolocation.getCurrentPosition((e) => {
          const lat = e.coords.latitude as any;
          const lng = e.coords.longitude as any;

          state.setLoc(lat, lng, () => {
            Router.go("/perdidas");
          });
        });
      });
      const style = document.createElement("style");

      style.innerHTML = `
      .section-home-home{
        display:flex;
        flex-direction:column;
        align-items:center;
        margin-left: 20px;
        margin-right: 20px;
      }
      .content__title-home{
        font-family:"Odibee Sans", cursive;
        font-size:48px;
        text-align:center;
        font-weight: bold;
      }
      .content__subtitle-home{
        font-family:"Odibee Sans", cursive;
        font-size:24px;
        text-align:center;
      }
      .container-subtitle-home{
        text-align:center;
      }
      .button-home{
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
      .button-home:hover {
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
