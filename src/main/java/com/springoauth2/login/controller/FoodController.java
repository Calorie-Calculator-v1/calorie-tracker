package com.springoauth2.login.controller;

import com.springoauth2.login.entity.Food;
import com.springoauth2.login.repo.FoodRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0/foods/")
public class FoodController {

    private final FoodRepository foodRepository;

    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    @GetMapping("/search")
    public List<Food> searchFoods(@RequestParam String q) {
        return foodRepository.findByNameContainingIgnoreCase(q);
    }
}
