# Admin Laboratory API

A premium, state-of-the-art RESTful API built with **Express.js**, **Sequelize ORM**, **JWT**, and **bcryptjs** for managing laboratory environments, inventories, assistants, and activity reports (BAP).

---

## 🛠️ Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Sequelize ORM
- **Database Support**: MySQL, PostgreSQL, MariaDB (Configurable via environment variables)
- **Security**: Password hashing with `bcryptjs`
- **Authentication**: JWT (JSON Web Tokens) with Token Rotation support
- **Development Utility**: `nodemon` & `sequelize-cli`

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- A relational database server (e.g. MySQL) running locally or remotely

### ⚙️ Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd admin2
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and fill in your database credentials and secret key configuration:
   ```ini
   PORT=5000
   NODE_ENV=development

   # Database Settings
   DB_HOST=127.0.0.1
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_NAME=admin_api_db
   DB_PORT=3306
   DB_DIALECT=mysql

   # JWT Settings
   JWT_SECRET=supersecretkeyantigravityadminapp123456!
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_SECRET=supersecretrefreshkeyantigravityadminapp123456!
   JWT_REFRESH_EXPIRES_IN=7d
   ```

---

## 🗄️ Database Initialization

This application uses Sequelize migrations and seeders to initialize the schema structure and populate basic setup values.

1. **Create the Database (if it does not exist):**
   ```bash
   npx sequelize-cli db:create
   ```

2. **Run Database Migrations:**
   Executes the schema migration sequence (creating tables in order of foreign key dependency):
   ```bash
   npm run db:migrate
   ```

3. **Seed Database Roles & Laboratoriums:**
   Injects initial lookup parameters (`Laboran` and `Asisten` roles, along with default laboratories `A1-A5`, `B1-B5`, `C1-C3`, `D1-D5`):
   ```bash
   npm run db:seed
   ```

---

## 🏃 Running the Application

### Development Mode (with nodemon hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Once started, the API will listen on the port specified in `.env` (default is `http://localhost:5000`). You can verify connectivity by hitting:
`GET http://localhost:5000/api/health`

---

## 🗺️ API Routes Summary

### 🔑 Authentication (`/api/auth`)
* `POST /api/auth/register` - General user registration. Returns `token` and `refreshToken`.
* `POST /api/auth/login` - Authenticate using email/username and password. Returns `token` (accessToken) and `refreshToken`.
* `POST /api/auth/refresh` - Refresh access token using rotation mechanism. Returns a new `token` and a new `refreshToken`.
* `POST /api/auth/logout` - Clear refresh token from the database.
* `GET /api/auth/me` - Retrieve the profile details of the currently authenticated user (requires token).

### 🧪 Laboran / Managers (`/api/laboran`)
* `POST /api/laboran/register-asisten` - Register a new Assistant user. Automatically inherits the Laboran's laboratory scope if not explicitly defined (restricted to `Laboran` role).

### 💼 Asisten / Assistants (`/api/asisten`)
* `PUT /api/asisten/profile` - Update assistant account profile attributes (restricted to `Asisten` role).

### 🏛️ Laboratorium CRUD (`/api/laboratorium`)
* `GET /api/laboratorium` - List all laboratories.
* `GET /api/laboratorium/:id` - Fetch laboratory details.
* `POST /api/laboratorium` - Create laboratory (restricted to `Laboran` role).
* `PUT /api/laboratorium/:id` - Update laboratory (restricted to `Laboran` role).
* `DELETE /api/laboratorium/:id` - Delete laboratory (restricted to `Laboran` role).

### 📦 Lokasi CRUD (`/api/lokasi`)
* `GET /api/lokasi` - List all storage locations.
* `GET /api/lokasi/:id` - Fetch location details.
* `POST /api/lokasi` - Create location (restricted to `Laboran` role).
* `PUT /api/lokasi/:id` - Update location (restricted to `Laboran` role).
* `DELETE /api/lokasi/:id` - Delete location (restricted to `Laboran` role).

### 🏷️ Kategori CRUD (`/api/kategori`)
* `GET /api/kategori` - List all categories.
* `GET /api/kategori/:id` - Fetch category details.
* `POST /api/kategori` - Create category (restricted to `Laboran` role).
* `PUT /api/kategori/:id` - Update category (restricted to `Laboran` role).
* `DELETE /api/kategori/:id` - Delete category (restricted to `Laboran` role).

### 📄 BAP CRUD (`/api/bap`)
* `GET /api/bap` - List all BAP records.
* `GET /api/bap/:id` - Fetch single BAP report by ID.
* `POST /api/bap` - Create BAP report.
* `PUT /api/bap/:id` - Update BAP report (restricted to owner or `Laboran`).
* `DELETE /api/bap/:id` - Delete BAP report (restricted to owner or `Laboran`).

### 🔍 Barang Hilang CRUD (`/api/barang-hilang`)
* `GET /api/barang-hilang` - List all lost items.
* `GET /api/barang-hilang/:id` - Fetch lost item details.
* `POST /api/barang-hilang` - Create a lost item record.
* `PUT /api/barang-hilang/:id` - Update a lost item record.
* `DELETE /api/barang-hilang/:id` - Delete lost item record.
