# ⚽ Proyecto Backend Fútbol

API RESTful para la gestión de módulos, roles, permisos y ligas en una aplicación administrativa para un sistema de fútbol.

---

## ✅ Requisitos

- [Node.js >= 18](https://nodejs.org/es/download)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Docker (opcional para desarrollo)](https://www.docker.com/get-started/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/backend-futbol.git
```

### 2. Crear archivo `.env`

Clonar el archivo `.env.template` y renombrarlo a `.env`

### 3. Instalación de dependencias

```bash
npm install
```

### 4. Ejecutar docker (Opcional)

- No es necesario tener instalado docker, pero se recomienda para el funcionamiento del proyecto
- Si no deseas trabajar con docker, es necesario tener instalado postgres

```bash
docker compose up -d
```

### 5. Ejecutar migraciones

```bash
npm run prisma:migrate:reset:dev
```

### 5. Ejecutar seeders

```bash
npm run prisma:seed:dev
```

### 6. Levantar proyecto

```bash
npm run dev
```
