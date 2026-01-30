# Student CRUD Application

This is a simple Student Management System project made using Spring Boot and basic JavaScript.
The main goal of this project is to perform CRUD operations on student data.

## Project Overview

This application demonstrates CRUD (Create, Read, Update, Delete) operations on a Student entity using:
- Backend: Spring Boot with Spring Data JPA
- Database: MySQL
- Frontend: HTML, CSS, JavaScript

## Setup Instructions :

## Prerequisites
- Java 17 or later
- Maven 3.6+
- MySQL Server

## Database Setup
1. Make sure MySQL is running
2. The application will automatically create the database `student_db`
3. Default credentials in `application.properties`:
   - Username: `root`
   - Password: (Password is empty by default)

## Running the Application

1. Go to the project directory:

   cd Assignment


2. Build and run with Maven:

   mvn spring-boot:run


3. Open browser and navigate to:

   http://localhost:8080


## API Endpoints

| Method | Endpoint | Description |
| POST | `/students` | Add a new student |
| GET | `/students` | Retrieve all students |
| GET | `/students/{id}` | Retrieve a student by ID |
| PUT | `/students/{id}` | Update a student by ID |
| DELETE | `/students/{id}` | Delete a student by ID |


##  AOOP Concepts Demonstrated

1. Encapsulation: Private fields with public getters/setters in the `Student` class
2. Classes and Objects: Well-structured `entity`, `service`, and `controller` classes
3. Constructors: Default and parameterized constructors in the `Student` class
4. Dependency Injection: Constructor-based DI in `service` and `controller` classes

## Features

-  Add new students with form validation
-  View all students in a dynamic table
-  Edit existing student records
-  Delete students with confirmation
-  Toast notifications for user feedback
-  Responsive design for all screen sizes
-  Modern dark theme UI

