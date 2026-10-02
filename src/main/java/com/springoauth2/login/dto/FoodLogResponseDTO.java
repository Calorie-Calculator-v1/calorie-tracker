package com.springoauth2.login.dto;

import com.springoauth2.login.entity.FoodLogEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

public record FoodLogResponseDTO(
        Long id,
        String foodName,
        BigDecimal quantity,
        BigDecimal totalCalories,
        BigDecimal totalProtein,
        BigDecimal totalCarbs,
        BigDecimal totalFat,
        String mealType,
        LocalDate loggedDate
) {
    public static FoodLogResponseDTO from(FoodLogEntity log) {
        BigDecimal qty = log.getQuantity();
        var food = log.getFood();

        return new FoodLogResponseDTO(
                log.getId(),
                food.getName(),
                qty,
                food.getEnergyPerServingKcal().multiply(qty),
                food.getProteinPerServingG().multiply(qty),
                food.getCarbsPerServingG().multiply(qty),
                food.getFatPerServingG().multiply(qty),
                log.getMealType(),
                log.getLoggedDate()
        );
    }
}