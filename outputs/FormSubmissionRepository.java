package com.example.demo.repository;

import com.example.demo.model.FormSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FormSubmissionRepository extends JpaRepository<FormSubmission, Long> {
}

### Application Properties

Configure the database connection in `application.properties`.

spring.datasource.url=jdbc:mysql://localhost:3306/sample_form_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL5Dialect

### Frontend Code

The frontend code you provided is correct. It sends a POST request to `/submit` with the form data. Make sure the backend is running and accessible at the same domain or configure CORS if they are on different domains.