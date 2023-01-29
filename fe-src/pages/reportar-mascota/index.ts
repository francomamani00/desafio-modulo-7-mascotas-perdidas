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
        console.log(
          "necesitas logearte para reportar o ver tus mascotas reportadas"
        );
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
              <p class="content__container__description">
                Ingresa los datos de tu mascota !!!
              </p>
              
              <div class="mascota__imagen profile-picture-button">
                  <div class="mascota__cargar">AGREGAR FOTO</div>
              </div>
              
              <input type="text" name="petName" placeholder="nombre de la mascota"/>
              <textarea name="commentary" placeholder="detalles de la mascota"></textarea>
              <div class="conteiner__mapa">
                <input class="input-busqueda-location" type="text" name="location" placeholder="mi ubicación"/>
                <div id="map" style="width: 350px; height: 350px; border-radius: 30px;"></div>
                <button class="button small__button save-location">Agregar ubicacion</button>
              </div>
              <button class="button guardar">Reportar mascota perdida</button>
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
          const ownerEmail = cs.email;
          const lat = cs.petReported.lat;
          const lng = cs.petReported.lng;

          state.reportarMascota(
            { petName, petImage, commentary, location, lat, lng, ownerEmail },
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
      .section-home{
        display:flex;
        flex-direction:column;
        align-items:center;
        margin-left: 20px;
        margin-right: 20px;
      }
      @media (min-width: 768px) {
        #map {
            width:500px;
          }
        }
      .content__title{
        font-family:"Odibee Sans", cursive;
        font-size:48px;
        text-align:center;
        font-weight: bold;
      }
      .content__container__description {
        font-size: 20px;
        text-align: center;
      }
      .content-report__container{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 400;
        gap: 20px;
        margin-left:20px;
        margin-right:20px;
        margin-bottom:20px;
        margin-top:20px;
      }
      .conteiner__mapa{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
      }
      .button{
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
      .small__button{
        margi-top:5px;
        min-width:170px;
        font-size:13px;
        padding:15px 20px;
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
      .button-mis-mascotas{
        background-color:black;
      }
      .mascota__cargar {
        font-size: 14px;
        color: rgb(124, 124, 124, 0.3);
        position: absolute;
        padding: 80px;
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
      input{
        margin-top:15px;
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
      `;
      this.appendChild(style);
      // this.addListeners();
      // lo saque recien
    }
  }
);
