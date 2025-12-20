# Project Tasks Manager

An application that allows users to create projects, manage tasks within those projects, and track progress.

<img width="1704" height="954" alt="image" src="https://github.com/user-attachments/assets/54b135e9-c2ab-404e-b423-b27044e0beab" />
<hr />
<img width="1704" height="1028" alt="image" src="https://github.com/user-attachments/assets/42809ccd-6592-42b7-881e-a29dc4a8cfb6" />
<hr />
<img width="1704" height="1770" alt="image" src="https://github.com/user-attachments/assets/3eb573a6-bd69-4549-b234-bb20b98ee4a0" />


## Run the application

It is recommended to use Docker and Docker Compose to run the application easily. If you don't have Docker installed, please refer to the [Run locally (Without Docker)](#run-locally-without-docker) section.

### Prerequisites

- [Docker](https://www.docker.com/get-started) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or later)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/VirtuMind/project-tasks-manager.git
   cd project-tasks-manager
   ```

2. **Environment variables**

   The Docker Compose file uses environment variables for configuration. You should set them in `.env` file after creating it in the root directory. Use the `.env.example` file provided as a template.

   | Variable            | Service  | Description                    |
   | ------------------- | -------- | ------------------------------ |
   | `POSTGRES_USER`     | db       | Database username              |
   | `POSTGRES_PASSWORD` | db       | Database password              |
   | `POSTGRES_DB`       | db       | Database name                  |
   | `JWT_KEY`           | backend  | JWT signing key (min 32 chars) |
   | `VITE_API_BASE_URL` | frontend | Backend API URL                |

3. **Start all services**

   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5062](http://localhost:5062)
   - Swagger Documentation: [http://localhost:5062/swagger](http://localhost:5062/swagger)
5. **Seeded users for testing**
   - email: `younes@example.com`, password: `younes123`
   - email: `hamid@example.com`, password: `hamid123`
   - email: `houria@example.com`, password: `houria123`

## Technologies

| Technology            | Version | Description                                |
| --------------------- | ------- | ------------------------------------------ |
| .NET                  | 10.0    | Web API framework                          |
| Entity Framework Core | 10.0    | ORM for database operations                |
| PostgreSQL            | 16      | Relational database                        |
| React                 | 19.2    | UI library                                 |
| TypeScript            | 5.9     | Type-safe JavaScript                       |
| Vite                  | 7.2     | Build tool and dev server                  |
| pnpm                  | Latest  | Fast, disk space efficient package manager |
| Tailwind CSS          | 3.4     | Utility-first CSS framework                |
| React Router          | 6.30    | Client-side routing                        |

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Design**: Modern UI that works on desktop and mobile devices. It follows neobrutalism
  design principles.
- **Project Management**: Create, edit, and delete projects
- **Task Management**: Add, update, and remove tasks within projects
- **Progress Tracking**: Visual progress indicators for project completion
- **API Documentation**: Swagger/OpenAPI documentation for backend APIs

## Run locally (Without Docker)

If you prefer to run the application without Docker, follow these steps:

### Environment Variables

Run PostgreSQL service and create a database.

Modify the `appsettings.json` file in the `backend` folder to set your database connection string and JWT settings.

Create a `.env` file in the `frontend` folder to set the `VITE_API_BASE_URL` variable to point to your local backend API URL (e.g., `http://localhost:5062/api`).

### Backend

```bash
cd backend

# Restore dependencies
dotnet restore

# Update database (requires PostgreSQL service running)
dotnet ef database update

# Run the application
dotnet run
```

### Frontend

```bash
cd frontend

#Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev
```
