import React from "react";
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="home">
      {/* 🟦 Sección Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">SecurityProyect</h1>
          <p className="hero-subtitle">
            Seguridad, Control y Jerarquía en un entorno moderno y escalable.
          </p>
        </div>
      </section>

      {/* 🧭 Sección Descripción */}
      <section className="about">
        <h2 className="section-title">¿Qué es SecurityProyect?</h2>
        <p className="about-text">
          <strong>SecurityProyect</strong> es una plataforma desarrollada para
          gestionar la seguridad y administración de usuarios en sistemas con
          jerarquías. Su diseño modular permite controlar de manera eficiente
          los niveles de acceso, los permisos y las acciones que cada usuario
          puede ejecutar dentro del sistema.
        </p>
        <p className="about-text">
          Este proyecto fue desarrollado con <strong>React</strong> como
          framework principal del frontend, y utiliza un enfoque adaptable con
          distintas librerías visuales como <strong>Material UI</strong>,{" "}
          <strong>Tailwind CSS</strong> y <strong>Bootstrap</strong>, logrando
          una experiencia fluida, moderna y totalmente responsive.
        </p>
      </section>

      {/* ⚙️ Funcionalidades */}
      <section className="features">
        <h2 className="section-title">Características Principales</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>👥 Gestión de Usuarios</h3>
            <p>
              Crea, edita y elimina usuarios con diferentes roles y niveles de
              autorización dentro del sistema.
            </p>
          </div>
          <div className="feature-card">
            <h3>🛡️ Roles y Permisos</h3>
            <p>
              Define jerarquías, permisos y accesos personalizados para mantener
              la integridad y seguridad de los datos.
            </p>
          </div>
          <div className="feature-card">
            <h3>🔐 Contraseñas Seguras</h3>
            <p>
              Administración robusta de contraseñas y políticas de seguridad
              enfocadas en la protección de credenciales.
            </p>
          </div>
          <div className="feature-card">
            <h3>📍 Direcciones y Dispositivos</h3>
            <p>
              Registro y control de direcciones, perfiles y dispositivos
              asociados a cada usuario del sistema.
            </p>
          </div>
        </div>
      </section>

      {/* ⚛️ Tecnologías */}
      <section className="tech">
        <h2 className="section-title">Tecnologías Utilizadas</h2>
        <div className="tech-logos">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
            alt="React Logo"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
            alt="Tailwind Logo"
          />
          <img src="https://mui.com/static/logo.png" alt="Material UI Logo" />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg"
            alt="Bootstrap Logo"
          />
        </div>
        <p className="tech-text">
          La combinación de estas tecnologías permite crear una interfaz visual
          moderna, ágil y compatible con distintos tamaños de pantalla, sin
          sacrificar el rendimiento ni la seguridad del sistema.
        </p>
      </section>

      {/* 👨‍💻 Equipo */}
      <section className="team">
        <h2 className="section-title">Equipo de Desarrollo</h2>
        <div className="team-grid">
          <div className="team-card">
            <span>Jacobo Quintero</span>
            <a
              href="https://github.com/xq25"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                alt="GitHub"
              />
            </a>
          </div>
          <div className="team-card">
            <span>Daniel Muñoz</span>
            <a
              href="https://github.com/DanielStudiante"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                alt="GitHub"
              />
            </a>
          </div>
          <div className="team-card">
            <span>Esteban Ramírez</span>
            <a
              href="https://github.com/Estebanr32"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                alt="GitHub"
              />
            </a>
          </div>
        </div>
      </section>

      {/* 🧾 Footer */}
      <footer className="footer">
        <p>© 2025 SecurityProyect — Desarrollado con React & FastAPI</p>
      </footer>
    </div>
  );
};

export default HomePage;
