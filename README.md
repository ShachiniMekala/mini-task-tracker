# Mini Task Tracker

A full-stack application to track tasks with project grouping and status workflows. It features a modern React frontend and a robust Symfony backend.

## Tech Stack
- **Backend:** Symfony 6.4 (PHP 8.1+)
- **Frontend:** React + Vite
- **Database:** SQLite (default: `backend/var/data.db`)

## Setup Instructions

### 1. Prerequisites
- **PHP 8.1** or higher
  - *Note: Ensure the following extensions are enabled in your `php.ini` (remove the `;` at the beginning of the line):*
    ```ini
    extension=pdo_sqlite
    extension=sqlite3
    ```
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
    # Option A: If you have composer installed globally
    composer install

    # Option B: If you use the local composer.phar
    php composer.phar install
    ```

3.  **Setup the Database:**
    *Ensure you have an `.env` file with the database configuration. By default, it uses SQLite.*
    
    1. **Create the database file:**
       Manually create an empty file named `data.db` in the `backend/var/` directory.
    
    2. **Run migrations:**
       Run the following command to create tables and seed initial data (Statuses, Priorities, Rules):
       ```bash
       php bin/console doctrine:migrations:migrate --no-interaction
       ```

4.  **Start the Backend Server:**
    Run the PHP built-in server:
    ```bash
    php -S localhost:8000 -t public
    ```
    *Note: Keep this terminal open while using the application.*

5.  **Run Backend Tests:**
    To verify the workflow logic and status transitions:
    ```bash
    php vendor/bin/phpunit
    ```
    *Note: If you encounter issues with missing extensions, you can run:*
    ```bash
    php -d extension=mbstring vendor/bin/phpunit
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

4.  **Run Frontend Tests:**
    To verify UI components and interactions:
    ```bash
    npm test
    ```

---

### 4. Accessing the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

The frontend is configured to proxy requests to `http://localhost:8000`. If your backend is running on a different port, update the `baseURL` in `frontend/src/api/client.ts`.

### 5. API Documentation (Postman)

A comprehensive Postman collection is included in the root directory:
- **File:** `postman-collection.postman_collection.json`
- **Usage:** Import this file into Postman to test all API endpoints, including Projects, Tasks, and Configuration. 
- **Environment:** Ensure you set the `SERVER_URL` variable in your Postman environment to `http://localhost:8000/api`.

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

## Architectural Decisions

- **State Management:** Instead of using a complex library like Redux, I opted for the native **React Context API** combined with standard parent-child prop passing. 
  - **Reasoning:** For an application of this scale, Context API provides a lightweight and built-in solution that keeps the codebase simple and easy to maintain. 
  - **Data Handling:** 
    - **Projects/Tasks:** These are managed using a classic parent-child relationship since the data flow is straightforward and limited in depth.
    - **Configuration Data:** Global settings like *Statuses* and *Priorities* are managed via **ConfigContext**. This is ideal because this data is fetched once at application startup and updated infrequently, if at all, during a session.

- **Form Handling:** I chose to use **native HTML form elements** and React state management instead of external libraries like Formik or React Hook Form. This keeps the bundle size small and avoids unnecessary dependencies for a simple tracker.

- **Scalability & Extensibility:**
  - **Dynamic Configuration:** Statuses and Priorities are stored in separate database tables rather than being hardcoded in the logic. This allows for adding new options without modifying the source code.
  - **Workflow Engine:** Transition rules are stored in a `task_workflow_rule` table. This decouples the business logic from the code, allowing for complex workflow changes via database updates.

- **Database Indexing Strategy:**
  - **Lean Schema:** I intentionally avoided adding standard B-tree indexes on fields like `task.description` or `task.title` eventhough ther are used in searching.
  - **Reasoning:** Since the application uses partial matching (`LIKE '%...%'`) for searches and sorts by `createdAt`, standard indexes would provide no performance benefit while adding unnecessary write overhead.
  - **Integrity Indexes:** Unique indexes were maintained on lookup tables (`task_status`, `task_priority`) to ensure data integrity and facilitate fast ID-to-name lookups.

## Database Structure

The application uses an SQLite database with the following table structure:

- **`project`**: Stores project details.
  - `id` (PK), `name`, `description`, `created_at`
- **`task`**: Stores tasks associated with projects.
  - `id` (PK), `project_id` (FK), `status_id` (FK), `priority_id` (FK), `title`, `description`, `transition_comment`, `created_at`
- **`task_status`**: Lookup table for task statuses (e.g., TODO, IN_PROGRESS, DONE).
  - `id` (PK), `name` (unique identifier), `label` (display name)
- **`task_priority`**: Lookup table for task priorities (e.g., LOW, MEDIUM, HIGH).
  - `id` (PK), `name` (unique identifier), `label` (display name)
- **`task_workflow_rule`**: Defines allowed transitions between task statuses.
  - `id` (PK), `from_status_id` (FK), `to_status_id` (FK), `default_comment`

**Relationships:**
- A **Project** has many **Tasks**.
- A **Task** belongs to one **Project**, one **Status**, and one **Priority**.
- **Workflow Rules** govern how a Task's **Status** can change.

## Future Improvements
  - **Pagination:** For production use, adding pagination to the project sidebar and task list would be essential to maintain performance as data grows.
  - **UI-driven Workflow Restrictions:** Currently, the backend enforces workflow rules and returns errors for invalid transitions (as per requirements). A future improvement would be to update the UI to only display allowed transition options in the dropdown, preventing invalid actions before they happen.
  - **Data Transfer Objects (DTOs):** Transitioning from passing raw arrays to the service layer to using structured DTOs would improve type safety and code clarity.
  - **Comprehensive Test Coverage:** While core workflow logic is tested, expanding the test suite to cover each isolated layer (Controllers, Repositories, Services) with unit and functional tests would ensure long-term stability.
  - **Custom Delete Confirmation:** Replace the native browser `alert()` and `confirm()` calls with a custom, styled modal component for a more consistent and professional user experience.
  - **Strict Request Validation:** Currently, the backend ignores unknown parameters in request payloads. A future improvement would be to implement strict validation that rejects requests containing unexpected or additional parameters not defined in the API specification, ensuring higher security and data integrity.

> **Note:** Due to time constraints, only core functionalities (such as status transitions and basic UI components) have been covered with automated tests.

