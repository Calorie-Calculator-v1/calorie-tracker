package com.springoauth2.login.controller;

import com.springoauth2.login.dto.FoodRequestDTO;
import com.springoauth2.login.entity.FoodLogEntity;
import com.springoauth2.login.repo.FoodLogRepo;
import com.springoauth2.login.security.AppPrincipal;
import com.springoauth2.login.service.FoodLogService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1.0/me/foodlog")
public class FoodLogController {

    private final FoodLogService foodLogService;
    private final FoodLogRepo foodLogRepo;

    public FoodLogController(FoodLogService foodLogService, FoodLogRepo foodLogRepo) {
        this.foodLogService = foodLogService;
        this.foodLogRepo = foodLogRepo;
    }

    @PostMapping
    public FoodLogEntity logMeal(@AuthenticationPrincipal AppPrincipal principal, @RequestBody FoodRequestDTO request) {
        Long userId = principal.getUserId();
        return foodLogService.logMeal(userId, request);
    }

    @GetMapping
    public List<FoodLogEntity> getMeals(@AuthenticationPrincipal AppPrincipal principal, @RequestParam(required = false) LocalDate date) {
        return foodLogRepo.findByUser_IdAndLoggedDate(principal.getUserId(), date != null ? date : LocalDate.now());
    }

    @GetMapping("/summary")
    public BigDecimal getDailySummary(@AuthenticationPrincipal AppPrincipal principal,
                                      @RequestParam(required = false) LocalDate date) {
        Long userId = principal.getUserId();
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return foodLogRepo.getTotalCaloriesForDate(userId, targetDate).orElse(BigDecimal.ZERO);
    }
}
