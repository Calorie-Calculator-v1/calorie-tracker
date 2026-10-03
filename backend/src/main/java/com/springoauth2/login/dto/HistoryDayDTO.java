package com.springoauth2.login.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record HistoryDayDTO(
        LocalDate date,
        BigDecimal totalCalories,
        BigDecimal totalProtein,
        BigDecimal totalCarbs,
        BigDecimal totalFat,
        List<FoodLogResponseDTO> meals
        ) {

}
