package com.springoauth2.login.dto;

import com.springoauth2.login.entity.Food;

public record FoodSearchResultDTO(Integer id, String name, java.math.BigDecimal caloriesPerServing) {
    public static FoodSearchResultDTO from(Food food) {
        return new FoodSearchResultDTO(food.getId(), food.getName(), food.getEnergyPerServingKcal());
    }
}