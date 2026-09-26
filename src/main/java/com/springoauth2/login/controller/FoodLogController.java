package com.springoauth2.login.controller;

import com.springoauth2.login.security.AppPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0/me/foodlog")
public class FoodLogController {

    @PostMapping
    public String logMeal(@AuthenticationPrincipal AppPrincipal principal) {
        Long userId = principal.getUserId();
        return "logged for user " + userId;
    }
}
