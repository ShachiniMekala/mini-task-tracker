# Mini Task Tracker

A full-stack application to track tasks with project grouping and status workflows. It features a modern React frontend and a robust Symfony backend.

## Tech Stack
- **Backend:** Symfony 6.4 (PHP 8.1+)
- **Frontend:** React + Vite
- **Database:** SQLite (default: `backend/var/data.db`)

## Setup Instructions

### 1. Prerequisites
- **PHP 8.1** or higher
- **Composer** (PHP dependency manager)
- **Node.js** (v18+) & **npm**
- **Symfony CLI** (optional but recommended)

---

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install PHP dependencies:**
    ```bash
    composer install
    ```

3.  **Setup the Database:**
    *Ensure you have an `.env` file with the database configuration. By default, it uses SQLite.*
    ```bash
    # Create the database file
    php bin/console doctrine:database:create
    
    # Run migrations to create tables and seed initial data (Statuses, Priorities, Rules)
    php bin/console doctrine:migrations:migrate --no-interaction
    ```

4.  **Start the Backend Server:**
    Using Symfony CLI:
    ```bash
    symfony serve -d
    ```
    *Alternatively, use the PHP built-in server:*
    ```bash
    php -S localhost:8000 -t public
    ```

---

### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install Node dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

---

### 4. Accessing the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

The frontend is configured to proxy requests to `http://localhost:8000`. If your backend is running on a different port, update the `baseURL` in `frontend/src/api/apiClient.js`.

## Key Features
- **Project Sidebar:** Organizes tasks into different projects.
- **Task Workflow:** Status transitions are governed by rules (e.g., `To Do` -> `In Progress` -> `Done`).
- **Real-time Feedback:** Toast notifications for all actions.
- **Responsive Layout:** Modern list-based view with custom styling.
- **Form Validations:** Comprehensive validation on both frontend and backend.

## Folder Structure
- `backend/`: Symfony source code and configuration.
  - `src/Entity/`: Database models.
  - `src/Service/`: Business logic and workflow management.
- `frontend/`: React application.
  - `src/components/`: Modularized components (Project, Task, Common).
  - `src/api/`: API service layers.
  - `src/context/`: Global configuration context.

