# RenovAR - Frontend
Aplicación de diseño y visualización 3D para remodelación de espacios, conexión con carpinteros para remodelaciones inteligentes

## **Descripción**

RenovAR es una plataforma que permite a los usuarios **visualizar y diseñar** la remodelación de sus espacios en 2D/3D antes de realizar cambios físicos, evitando errores costosos y conectándolos con carpinteros profesionales.

---

## **Estructura del Proyecto**

```
renovar-frontend/
├── public/               # Assets estáticos (imágenes, favicon, etc.)
├── src/                  # Código fuente
│   ├── assets/           # Recursos multimedia (fuentes, imágenes, etc.)
│   ├── components/       # Componentes reutilizables (Layout, UI, etc.)
│   ├── contexts/         # Contextos de React (Auth, Theme, etc.)
│   ├── pages/            # Componentes de páginas (Home, Login, Designs, etc.)
│   ├── services/         # Lógica de conexión a APIs (axios, fetch)
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada de la app
│   └── routes.jsx        # Configuración de rutas (React Router)
├── .gitignore            # Archivos ignorados por Git
├── README.md             # Documentación del proyecto
├── eslint.config.js      # Configuración de ESLint
├── index.html            # HTML base
├── package.json          # Dependencias y scripts
└── vite.config.js        # Configuración de Vite
```

---

## **Configuración Inicial**

### **Requisitos**

- Node.js (v18+)
- npm / yarn / pnpm

### **Instalación**

```
git clone https://github.com/IETI-RenovAR/Frontend.git
cd Frontend
npm install
```

### **Variables de Entorno**

*Para futura implementación*


Crea un archivo `.env` en la raíz del proyecto:


```
VITE_USERS_SERVICE_URL=http://localhost:3001
VITE_DESIGNS_SERVICE_URL=http://localhost:3002
VITE_PRODUCTS_SERVICE_URL=http://localhost:3003
VITE_PURCHASES_SERVICE_URL=http://localhost:3004
```

### **Comandos Útiles**

| **Comando** | **Descripción** |
| --- | --- |
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Genera versión para producción |
| `npm run preview` | Previsualiza build de producción |

---

## **🔧 Tecnologías Principales**

- **Frontend**: React + Vite
- **HTTP Client**: Axios

---

## **Diseño y Estructura**

- **Sistema de diseño**: Basado en Material-UI con personalización de temas.
- **Arquitectura**: Componentes funcionales + hooks.
- **Estado global**: Context API (para autenticación y temas).

---

## **Próximos Pasos**

1. ¡Continuar con las implementaciones!
2. **Integrar Three.js** para visualización 3D interactiva.
3. **Conectar con backend** (microservicios de Users, Designs, etc.).
4. **Implementar autenticación** (JWT + rutas protegidas).
5. **Desplegar**.

---

**✨ ¿Listo para transformar espacios?**

```
npm run dev
```

Y abre [http://localhost:5173](http://localhost:5173/) en tu navegador.

---

**Nota**: Este README se actualizará conforme avance el proyecto.
