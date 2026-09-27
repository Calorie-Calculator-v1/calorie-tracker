package com.springoauth2.login.repo;

import com.springoauth2.login.entity.FoodLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodLogRepo extends JpaRepository<FoodLogEntity, Long> {
}
