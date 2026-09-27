package com.springoauth2.login.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "foods")
@Getter
@Setter
public class Food {

    @Id
    @Column(name = "Food_ID")
    private Integer id; // mediumint fits comfortably in Java's Integer

    @Column(name = "Food_Name")
    private String name;

    @Column(name = "Source_Dataset")
    private String sourceDataset;

    @Column(name = "Energy_kcal")
    private BigDecimal energyKcal;

    @Column(name = "Energy_kJ")
    private BigDecimal energyKj;

    @Column(name = "Protein_g")
    private BigDecimal proteinG;

    @Column(name = "Fat_g")
    private BigDecimal fatG;

    @Column(name = "Carbs_g")
    private BigDecimal carbsG;

    @Column(name = "Data_Quality")
    private String dataQuality;

    @Column(name = "Serving_Size_g")
    private BigDecimal servingSizeG;

    @Column(name = "Serving_Basis")
    private String servingBasis;

    @Column(name = "Energy_per_serving_kcal")
    private BigDecimal energyPerServingKcal;

    @Column(name = "Protein_per_serving_g")
    private BigDecimal proteinPerServingG;

    @Column(name = "Fat_per_serving_g")
    private BigDecimal fatPerServingG;

    @Column(name = "Carbs_per_serving_g")
    private BigDecimal carbsPerServingG;
}