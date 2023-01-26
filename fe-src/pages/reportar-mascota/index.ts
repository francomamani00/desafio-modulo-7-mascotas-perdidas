import { Router } from "@vaadin/router";
import { state } from "./../../state";
import { Dropzone } from "dropzone";
import * as mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
const mapboxClient = new MapboxClient(process.env.MAPBOX_API_KEY);
import { initMap, initSearchForm } from "../../lib/mapbox";
// import { state } from "../../state";
customElements.define(
  "reportar-mascota",
  class ReportarMascota extends HTMLElement {
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

      <section class="section-home">
        <button class="button button-mis-mascotas">Mis mascotas reportadas</button>
        <form class="form__nueva-mascota">
          <div class="container">
            <h1 class="content__title">Agregar Mascota</h1>
            <div class="content-report__container">
              <p class="content__container__desciption">
                Ingresa los datos de tu mascota !!!
              </p>
              
              <div class="mascota__imagen profile-picture-button">
                  <div class="mascota__cargar">AGREGAR FOTO</div>
              </div>
              
              <input type="text" name="petName" placeholder="nombre de la mascota"/>
              <textarea name="commentary" placeholder="detalles de la mascota"></textarea>
              <div class="mapa">
                <input class="input-busqueda-location" type="text" name="location" placeholder="mi ubicación"/>
                <div id="map" style="width: 350px; height: 350px"></div>
                <button class="small__button save-location">Agregar ubicacion</button>
              </div>
              <button class="guardar">Reportar mascota perdida</button>
            </div>
          </div>
        </form>
      </section>

        
        
        `;
      // Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.
      const misMascotas = document.querySelector(".button-mis-mascotas");
      misMascotas.addEventListener("click", () => {
        Router.go("/mis-mascotas");
      });
      const formEl = document.querySelector(".form__nueva-mascota");
      let pictureFile;
      const myDropzone = new Dropzone(".profile-picture-button", {
        url: "/falsa",
        autoProcessQueue: false,
      });

      myDropzone.on("addedfile", function (file) {
        pictureFile = file;
        document.querySelector(".dz-error-mark").remove();
        document.querySelector(".dz-success-mark").remove();
        document.querySelector(".dz-error-message").remove();
        document.querySelector(".dz-progress").remove();
        document.querySelector(".dz-details").remove();
        // // usando este evento pueden acceder al dataURL directamente
        // pictureFile = file;
      });
      const cs = state.getState();
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        if (pictureFile) {
          const petName = e.target["petName"].value;
          const petImage = pictureFile.dataURL;
          const commentary = e.target["commentary"].value;
          const location = e.target["location"].value;
          const lat = cs.petReported.lat;
          const lng = cs.petReported.lng;
          console.log("antes del form");
          state.reportarMascota(
            { petName, petImage, commentary, location, lat, lng },
            (cb) => {
              if (cb) Router.go("/datos-guardados");
            }
          );
        } else {
          alert("ERROR: datos incompletos!!!");
        }
      });
      let lng = cs.myLng;
      let lat = cs.myLat;
      const idMap = document.querySelector("#map");
      function initMap() {
        mapboxgl.accessToken = process.env.MAPBOX_API_KEY;
        return new mapboxgl.Map({
          container: "map",
          style: "mapbox://styles/mapbox/streets-v11",
          center: [lng, lat],
          zoom: 14,
        });
      }
      function initSearchForm(callback) {
        const inputBusqueda: any = document.querySelector(
          ".input-busqueda-location"
        );
        const saveBusqueda: any = document.querySelector(".save-location");
        saveBusqueda.addEventListener("click", (e) => {
          e.preventDefault();
          mapboxClient.geocodeForward(
            inputBusqueda.value,
            {
              country: "ar",
              autocomplete: true,
              language: "es",
            },
            function (err, data, res) {
              if (!err) callback(data.features);
            }
          );
        });
      }
      (function () {
        const map = initMap();
        initSearchForm(function (results) {
          const firstResult = results[0];
          console.log(firstResult);
          const marker = new mapboxgl.Marker()
            .setLngLat(firstResult.geometry.coordinates)
            .addTo(map);
          map.setCenter(firstResult.geometry.coordinates);
          map.setZoom(14);
          state.setReportLocation(
            firstResult.geometry.coordinates[1],
            firstResult.geometry.coordinates[0]
          );
        });
      })();

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
      .content-report__container{
        display:flex;
        flex-direction:column;
        gap:15px;
        text-align:center;
        justify-content:center;
        margin-left:20px;
        margin-right:20px;
        margin-top:20px;
      }
      .mascota__cargar {
        font-size: 14px;
        color: rgb(124, 124, 124);
        position: absolute;
        padding: 120px;
      }
      .mascota__imagen {
        height: 200px;
        width: 200px;
        border: 2px solid #ffffff;
        filter: drop-shadow(3px 4px 8px #a2a2a2);
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: cover;
        display:flex;
        text-align:center;
        justify-content:center;
      }
      .mascota__imagen:hover {
        border-color: #e3e3e3;
        cursor: pointer;
    }
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
