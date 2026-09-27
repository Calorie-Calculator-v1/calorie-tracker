package com.springoauth2.login.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table
public class Food {
    @Id
    private Long id;

    //TODO [Reverse Engineering] generate columns from DB
}