package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/submit")
    public User submitForm(@RequestBody User user) {
        return userService.saveUser(user);
    }
}

### 7. Application Properties

Configure your `application.properties` file with database connection details.