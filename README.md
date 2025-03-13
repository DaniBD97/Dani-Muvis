Proyecto hecho con NodeJS y React usando el compilador Vite

para crear este proyecto necesitas seguir estos fundamentales pasos para el backend

```bash
  crear archivo para la configuracion del server

  npm init -y

  Configurar el json

{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "Descripción del proyecto",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write .",
    "prestart": "npm run build",
    "pretest": "npm run lint"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {}
}


  instalar dependencias (solo nodemon es una dependencia de desarrollador)
  npm i axios bcryptjs cookie-parser dotenv express jsonwebtoken mongoose nodemon

```

luego para el frontend necesitas instalar vite con tailwind si te acomoda

```bash
npm i  axios lucide-react react-hot-toast react-player react-router-dom tailwind-scrollbar-hide use-debounce zustand
```

la mayoria de estas dependencias son para un mejor rendimiento y estetica mas que para un uso fundamental, sientete libre de usar las librerias que mas te gusten 

luego solo necesitas conseguir las key de la api que se usa, una cuenta en MongoDB y las ganas de programar

  
	[MongoDB](https://www.mongodb.com/es/lp/cloud/atlas/try4?utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_amers-cl_ps-all_desktop_es-la_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=20751878828&adgroup=156970816922&cq_cmp=20751878828&gad_source=1&gclid=EAIaIQobChMIyKqzhpKIjAMVZGlIAB1P0xR2EAAYASAAEgK3dfD_BwE)
  
  [Movies Data Base ](https://www.themoviedb.org/?language=es)




