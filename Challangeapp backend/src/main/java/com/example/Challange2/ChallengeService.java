package com.example.Challange2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public boolean addChallenge(Challenge challenge) {
        if (challenge != null) {
            challengeRepository.save(challenge);
            return true;
        }
        return false;
    }

    public Challenge getChallenge(String month) {
        Optional<Challenge> challenge = challengeRepository.findByMonthIgnoreCase(month);
        return challenge.orElse(null);
    }

    public boolean updateChallenge(Long id, Challenge updateChallenge) {
        Optional<Challenge> challenge = challengeRepository.findById(id);
        if (challenge.isPresent()){
            Challenge challengeToUpdate = challenge.get();
            challengeToUpdate.setMonth(updateChallenge.getMonth());
            challengeToUpdate.setDescription(updateChallenge.getDescription());
            challengeRepository.save(challengeToUpdate);
            return true;
        }
        return false;
    }

    public boolean deleteChallenge(Long id) {
        if (challengeRepository.existsById(id)) {
            challengeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}