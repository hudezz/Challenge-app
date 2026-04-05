package com.example.Challange2;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // This fixes the ID error!
    private Long id;

    @Column(name="challengeMonth")
    private String month;
    private String description;

    // Default constructor (required by JPA)
    public Challenge() {
    }

    // Constructor for manual creation
    public Challenge(Long id, String month, String description) {
        this.id = id;
        this.month = month;
        this.description = description;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getMonth() {
        return month;
    }

    public String getDescription() {
        return description;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}