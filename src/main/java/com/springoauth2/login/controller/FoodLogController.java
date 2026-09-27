package com.springoauth2.login.controller;

import com.springoauth2.login.dto.FoodRequestDTO;
import com.springoauth2.login.entity.FoodLogEntity;
import com.springoauth2.login.security.AppPrincipal;
import com.springoauth2.login.service.FoodLogService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1.0/me/foodlog")
public class FoodLogController {

    private final FoodLogService foodLogService;

    public FoodLogController(FoodLogService foodLogService) {
        this.foodLogService = foodLogService;
    }

    @PostMapping
    public FoodLogEntity logMeal(@AuthenticationPrincipal AppPrincipal principal, @RequestBody FoodRequestDTO request) {
        Long userId = principal.getUserId();
        return foodLogService.logMeal(userId, request);
    }
}
