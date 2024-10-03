# Task Management Application

This is a full-stack task management application built with React for the frontend and Spring Boot for the backend.

## Features

- **User Authentication:** Secure user login and registration.
- **Task Creation:** Create new tasks with titles, descriptions, due dates, and priorities.
- **Task Management:** View, edit, and delete tasks.
- **Task Filtering and Sorting:** Filter tasks by status, priority, and due date. Sort tasks by various criteria.
- **User-Friendly Interface:** Intuitive and easy-to-use interface for managing tasks.

## Technologies Used

**Frontend:**

- React
- Vite
- Bootstrap
- Redux Toolkit
- Axios
- jQWidgets
- Font Awesome

**Backend:**

- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL (or your preferred database)

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed
- Java Development Kit (JDK) installed
- MySQL (or your preferred database) installed and running

### Frontend Setup

1. Navigate to the `task-management-app` directory (frontend).
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application in your browser at `http://localhost:5173`

### Backend Setup

1. Navigate to the `TaskManagementApplication` directory (backend).
2. Configure database connection details in `application.properties`.
3. Build the application: `./gradlew build`
4. Run the application: `java -jar target/TaskManagementApplication-0.0.1-SNAPSHOT.jar`

## Running with Docker

1. Build the Docker image: `docker build -t task-management-app .`
2. Run the Docker container: `docker run -p 8080:8080 task-management-app`
3. Access the application in your browser at `http://localhost:8080`

## Testing

- Frontend unit tests are written using Jest and React Testing Library.
- Backend unit and integration tests are written using JUnit and Mockito.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request.

## License

This project is licensed under the MIT License