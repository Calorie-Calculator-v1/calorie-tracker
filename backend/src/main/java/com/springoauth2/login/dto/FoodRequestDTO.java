package com.springoauth2.login.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class FoodRequestDTO {

    private Long foodId;
    private BigDecimal quantity;
    private String mealType;
    private LocalDate loggedDate;
}
