package com.springoauth2.login.service;

import com.springoauth2.login.dto.FoodRequestDTO;
import com.springoauth2.login.entity.Food;
import com.springoauth2.login.entity.FoodLogEntity;
import com.springoauth2.login.entity.UserEntity;
import com.springoauth2.login.repo.FoodLogRepo;
import com.springoauth2.login.repo.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class FoodLogService {
    private final UserRepository userRepository;
    private final FoodLogRepo foodLogRepo;

    public FoodLogService(UserRepository userRepository, FoodLogRepo foodLogRepo) {
        this.userRepository = userRepository;
        this.foodLogRepo = foodLogRepo;
    }

    public FoodLogEntity logMeal(Long userId, FoodRequestDTO request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Food food = foodLogRepo.findById(request.getFoodId())
                .orElseThrow(() -> new IllegalArgumentException("Food not found: " + request.getFoodId())).getFood();
        FoodLogEntity log = new FoodLogEntity();
        log.setUser(user);
        log.setFood(food);
        log.setQuantity(request.getQuantity());
        log.setMealType(request.getMealType());
        log.setLoggedDate(request.getLoggedDate() != null ? request.getLoggedDate() : java.time.LocalDate.now());
        return foodLogRepo.save(log);
    }
}
