package com.springoauth2.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_logs")
@Getter
@Setter
@NoArgsConstructor
public class FoodLogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private FoodLogEntity food; // SWAP LATER

    private BigDecimal quantity;

    @Column(name = "meal_type")
    private String mealType;

    @Column(name = "logged_date")
    private LocalDate loggedDate;

    private LocalDateTime createdAt = LocalDateTime.now();


}
