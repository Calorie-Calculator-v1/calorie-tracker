package com.springoauth2.login.repo;

import com.springoauth2.login.entity.Food;
import com.springoauth2.login.entity.FoodLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface FoodLogRepo extends JpaRepository<FoodLogEntity, Long> {

    @Query(value = "SELECT * FROM foods WHERE MATCH(Food_Name) AGAINST (:query IN NATURAL LANGUAGE MODE) LIMIT 20",
            nativeQuery = true)
    List<Food> searchByName(@Param("query") String query);
}
