import { Router } from "@vaadin/router";
import { state } from "../../state";
const huella = require("url:../../../fe-src/assets/huella.png");
const marcaX = require("url:../../../fe-src/assets/marca-x.png");

class Header extends HTMLElement {
  connectedCallback() {
    state.suscribe(() => {
      this.render();
    });
    this.render();
  }
  render() {
    this.innerHTML = `
    <div class="header-component__container">
        <div class="header">
            <a class="header-component__logo">
                <img src="${huella}" >
            </a>
            <div class="menu header__hamburger--open">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        <nav class="header-component-nav">
          <ul class="links">
            <li><a class="header__comp-link login">Cuenta</a></li>
            <li><a class="header__comp-link reportar-mascotas">Reportar mascota</a></li>
            <li><a class="header__comp-link reportes-cerca">Reportes cerca tuyo</a></li>
          </ul>
        </nav>
        
        <div class="header-comp__window-menu">
        <div class="header-comp__window-close header__hamburger--close">
          <img
            src=${marcaX}
            alt="x"
            class="header__logo--close"
          />
        </div>
        <div class="header-comp__window-menu-link">
          <a class="header__nav-link--window-open login2" >Cuenta</a>
          <a class="header__nav-link--window-open reportar-mascotas2">Reportar Mascota</a>
          <a class="header__nav-link--window-open reportes-cerca2">Reportes cerca tuyo</a>
        </div>
    </div>

    </div>
    
    
    
    `;
    const logo = this.querySelector(".header-component__logo");
    logo.addEventListener("click", () => {
      Router.go("/home-page");
    });
    const style = document.createElement("style");
    style.innerHTML = `
    .header-component__logo {
        flex-grow: 1;
    }
    .header-component__logo img {
        width: 50px;
        filter: invert(1);
        transition: all 0.4s ease-in-out ;
    }
    .header-component__logo img:hover {
        cursor: pointer;
        transform: scale(1.1);
    }
    .header-component__container {
        padding: 10px 21px;
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: red;
        border-radius: 10px;
        justify-content:space-between;
    }
    .header{
        display:flex;
        flex-grow:1;
        flex-direction:row;
        justify-content:space-between;
        align-items:center;
    }
    .header__comp-link{
      cursor:pointer;
    }
    .menu {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 32px;
        height: 32px;
        cursor: pointer;
    }
    .menu div {
        position: relative;
        width: 32px;
        height: 4px;
        background-color: white;
    }
    .header-component-nav{
        display:none
    }
    .header-comp__window-menu {
        padding: 22px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        background: linear-gradient(147deg, #000000 0%, red 70%);
        height: 100vh;
        display: none;
      }
      .header__logo--close {
        height: 40px;
        width: 40px;
        cursor: pointer;
      }
      .header-comp__window-close {
        text-align: end;
      }
      .header__nav-link--window-open {
        font-weight: bolder;
        font-size: 40px;
        font-family: "Flamenco";
        color: white;
        cursor: pointer;
        text-decoration: none;
      }
      .header-comp__window-menu-link {
        margin-top: 100px;
        display: flex;
        align-items: center;
        gap: 80px;
        justify-content: center;
        justify-content: space-between;
        flex-direction: column;
      }



    @media (min-width:769px){
        .menu{
            display:none;
        }
        .header{
            flex-grow:0.5;
        }
        .links{
            display:flex;
            margin:0 auto;
            justify-content:flex-end;
            padding:left:25px;
        }
        .header-component-nav {
            display:flex;
            position: static;
            max-height: 100%;
            background-color: transparent;
        }
        .header-component-nav ul {
            display: flex;
            flex-direction: column;
            list-style: none;
            gap: 18px;
            justify-content: flex-end;
            align-items: center;
            padding: 0;
        }
        .header-component-nav ul li a {
            color: white;
            text-decoration: none;
            font-size: 18px;
            padding: 10px 10px;
            transition: all 0.5s ease-in-out ;
        }
        .header-component-nav ul {
            flex-direction: row;
        }
        
    }
    `;
    const cs = state.getState();
    const login = document.querySelector(".login");
    const login2 = document.querySelector(".login2");
    // state.data.token
    if (cs.token != "") {
      login.classList.add("cuenta");
      login2.classList.add("cuenta2");

      login.innerHTML = "Cuenta";
      login2.innerHTML = "Cuenta";
    } else {
      login.classList.remove("cuenta");
      login2.classList.remove("cuenta2");

      login.innerHTML = "Login";
      login2.innerHTML = "Login";
    }
    // login.addEventListener("click", () => {
    //   if (login.classList.contains("login")) {
    //     Router.go("/login");
    //   } else {
    //     // const currentState=state.getState()
    //     // currentState.getUsuario(cs.token, (cb) => {
    //     //   cs.name = cb.name;
    //     // });
    //     state.getUsuario2((cb) => {
    //       cs.name = cb.name as any;
    //       state.setState(cs);
    //     });
    //     Router.go("/profile");
    //   }
    // });
    login.addEventListener("click", () => {
      if (login.classList.contains("cuenta")) {
        state.getUsuario2((cb) => {
          cs.name = cb.name as any;
          state.setState(cs);
        });
        Router.go("/profile");
      } else {
        Router.go("/login");
      }
    });
    login2.addEventListener("click", () => {
      if (login2.classList.contains("cuenta2")) {
        state.getUsuario2((cb) => {
          cs.name = cb.name as any;
          state.setState(cs);
        });
        Router.go("/profile");
      } else {
        Router.go("/login");
      }
    });
    const openWindow = document.querySelector(".header__hamburger--open");
    const closeWindow = document.querySelector(".header__hamburger--close");
    const windowEl = document.querySelector(".header-comp__window-menu") as any;

    openWindow.addEventListener("click", () => {
      windowEl.style.display = "inherit";
    });
    closeWindow.addEventListener("click", () => {
      windowEl.style.display = "";
    });
    const reportarMascota = document.querySelector(".reportar-mascotas");
    const reportesCerca = document.querySelector(".reportes-cerca");
    reportarMascota.addEventListener("click", () => {
      Router.go("/reportar-mascota");
    });
    reportesCerca.addEventListener("click", () => {
      Router.go("/perdidas");
    });
    const reportarMascota2 = document.querySelector(".reportar-mascotas2");
    const reportesCerca2 = document.querySelector(".reportes-cerca2");
    reportarMascota2.addEventListener("click", () => {
      Router.go("/reportar-mascota");
    });
    reportesCerca2.addEventListener("click", () => {
      Router.go("/perdidas");
    });
    this.appendChild(style);
  }
}
customElements.define("header-comp", Header);
