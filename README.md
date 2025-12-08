# Educational Test Platform

A full-stack web application designed for educational testing, featuring separate interfaces for administrators and students. This project is containerized using Docker for easy deployment and development.

## Features

- **User Authentication**: Secure login system.
- **Role-Based Access**: Specialized dashboards for different user roles.
  - **Admin Dashboard**: Interface for administrators to manage tests and users.
  - **Student Dashboard**: Interface for students to take tests and view progress.
- **Responsive Design**: Built with TailwindCSS for a modern, responsive user interface.

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: TailwindCSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: SQLite
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)

### Infrastructure
- **Containerization**: Docker & Docker Compose

## Prerequisites

Ensure you have the following installed on your system:
- Docker
- Docker Compose

## Getting Started

### Quick Start

The easiest way to run the application is using the provided helper script:

```bash
./run-docker.sh
```

This script will check for necessary tools, create required directories, and start the containers.

### Manual Setup

If you prefer to run the docker commands manually:

1. Create the data directory for database persistence:
   ```bash
   mkdir -p data
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build -d
   ```

### Stopping the Application

To stop the containers:

```bash
docker-compose down
```

## Accessing the Application

Once the containers are running, you can access the services at:

- **Frontend Application**: http://localhost:3005
- **Backend API**: http://localhost:5005

## Project Structure

- **backend/**: Contains the Node.js/Express server code.
- **frontend/**: Contains the React application code.
- **data/**: Directory used for persisting the SQLite database (created at runtime).
- **docker-compose.yml**: Defines the services, networks, and volumes.
- **run-docker.sh**: Shell script to simplify the startup process.
