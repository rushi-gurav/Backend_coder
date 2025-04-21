package com.example.demo.controller;

import com.example.demo.model.FormSubmission;
import com.example.demo.repository.FormSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
public class FormController {

    @Autowired
    private FormSubmissionRepository formSubmissionRepository;

    @PostMapping("/submit")
    public FormSubmission submitForm(@RequestBody FormSubmission formSubmission) {
        formSubmission.setCreatedAt(LocalDateTime.now());
        return formSubmissionRepository.save(formSubmission);
    }
}

### Repository

Create a repository interface to interact with the database.