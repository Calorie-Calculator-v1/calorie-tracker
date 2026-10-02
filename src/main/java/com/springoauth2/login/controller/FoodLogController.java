package com.springoauth2.login.controller;

import com.springoauth2.login.dto.FoodLogResponseDTO;
import com.springoauth2.login.dto.FoodRequestDTO;
import com.springoauth2.login.dto.HistoryDayDTO;
import com.springoauth2.login.entity.FoodLogEntity;
import com.springoauth2.login.repo.FoodLogRepo;
import com.springoauth2.login.security.AppPrincipal;
import com.springoauth2.login.service.FoodLogService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
    public List<FoodLogResponseDTO> getMeals(@AuthenticationPrincipal AppPrincipal principal,
                                             @RequestParam(required = false) LocalDate date) {
        Long userId = principal.getUserId();
        return foodLogRepo.findByUser_IdAndLoggedDate(userId, date != null ? date : LocalDate.now())
                .stream()
                .map(FoodLogResponseDTO::from)
                .toList();
    }

    @GetMapping("/summary")
    public BigDecimal getDailySummary(@AuthenticationPrincipal AppPrincipal principal,
                                      @RequestParam(required = false) LocalDate date) {
        Long userId = principal.getUserId();
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return foodLogRepo.getTotalCaloriesForDate(userId, targetDate).orElse(BigDecimal.ZERO);
    }

    @GetMapping("/history")
    public List<HistoryDayDTO> getHistory(@AuthenticationPrincipal AppPrincipal principal) {
        List<FoodLogEntity> allLogs = foodLogRepo.findByUser_IdOrderByLoggedDateDesc(principal.getUserId());

        return allLogs.stream()
                .collect(Collectors.groupingBy(FoodLogEntity::getLoggedDate))
                .entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<FoodLogEntity> logsForDay = entry.getValue();

                    List<FoodLogResponseDTO> meals = logsForDay.stream()
                            .map(FoodLogResponseDTO::from)
                            .toList();

                    BigDecimal totalCalories = meals.stream()
                            .map(FoodLogResponseDTO::totalCalories)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal totalProtein = meals.stream()
                            .map(FoodLogResponseDTO::totalProtein)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal totalCarbs = meals.stream()
                            .map(FoodLogResponseDTO::totalCarbs)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal totalFat = meals.stream()
                            .map(FoodLogResponseDTO::totalFat)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return new HistoryDayDTO(date, totalCalories, totalProtein, totalCarbs, totalFat, meals);
                })
                .sorted(Comparator.comparing(HistoryDayDTO::date).reversed())
                .toList();
    }
}
