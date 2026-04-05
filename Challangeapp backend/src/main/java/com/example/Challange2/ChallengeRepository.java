package com.example.Challange2;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;

import java.util.Optional;

public interface ChallengeRepository  extends JpaRepository<Challenge,Long> {


    Optional<Challenge>

    findByMonthIgnoreCase(String month);

}
