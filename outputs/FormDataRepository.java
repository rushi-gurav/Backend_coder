package com.example.demo.repository;

import com.example.demo.model.FormData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormDataRepository extends JpaRepository<FormData, Long> {
}

#### 6. Application Properties

Configure the database connection in the `application.properties` file.

spring.datasource.url=jdbc:mysql://localhost:3306/sample_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

Replace `root` and `your_password` with your MySQL username and password.

### Frontend Code

The frontend code you provided is correct. It sends a POST request to the `/submit` endpoint with the form data. Make sure to update the `action` attribute of the form to match the endpoint in your Spring Boot application, e.g., `action="/api/submit"`.