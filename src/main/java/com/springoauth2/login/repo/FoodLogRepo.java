package com.springoauth2.login.repo;

import com.springoauth2.login.entity.Food;
import com.springoauth2.login.entity.FoodLogEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FoodLogRepo extends JpaRepository<FoodLogEntity, Long> {

    @Query(value = "SELECT * FROM foods WHERE MATCH(Food_Name) AGAINST (:query IN NATURAL LANGUAGE MODE) LIMIT 20",
            nativeQuery = true)
    List<Food> searchByName(@Param("query") String query);

    List<FoodLogEntity> findByUser_IdAndLoggedDate(Long userId, LocalDate loggedDate);

    @Query("""
        SELECT SUM(fl.quantity * f.energyPerServingKcal)
        FROM FoodLogEntity fl
        JOIN fl.food f
        WHERE fl.user.id = :userId AND fl.loggedDate = :date
        """)
    Optional<BigDecimal> getTotalCaloriesForDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    List<FoodLogEntity> findByUser_IdOrderByLoggedDateDesc(Long userId);

    boolean existsByIdAndUser_Id(Long id, Long userId);

    interface DailyTotal {
        LocalDate getDate();
        BigDecimal getTotalCalories();
    }

    @Transactional
    @Modifying
    void deleteByIdAndUser_Id(Long id, Long userId);
}
