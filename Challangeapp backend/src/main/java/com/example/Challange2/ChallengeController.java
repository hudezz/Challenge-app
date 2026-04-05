package com.example.Challange2;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/challenges")
@CrossOrigin(origins = "http://localhost:3000")
public class ChallengeController {

    private ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService ;
    }

    @GetMapping
    public ResponseEntity <List<Challenge>> getALLChallenges() {
        return new ResponseEntity<>(challengeService.getAllChallenges(),HttpStatus.OK);
    }

    @PostMapping

    public ResponseEntity <String> addChallenge(@RequestBody Challenge challenge) {
        boolean isChallengeAdded=
                challengeService.addChallenge(challenge);
        if (isChallengeAdded )
            return new ResponseEntity<>("challenge added successfully",HttpStatus.OK);
        else
            return new ResponseEntity<>("challenge is not added successfully",HttpStatus.NOT_FOUND);
    }
    @GetMapping("/{month}")
    public ResponseEntity <Challenge> getChallenge(
            @PathVariable String month) {
        Challenge challenge = challengeService.getChallenge(month);
        if (challenge != null)
        return new ResponseEntity<>(challenge, HttpStatus.OK) ;
        else
        return new  ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}")
    public  ResponseEntity<String > updateChallenge(@PathVariable Long id,@RequestBody Challenge updateChallenge) {
      boolean isChallengeUpdated =
              challengeService.updateChallenge(id,updateChallenge);
        if (isChallengeUpdated )
            return new ResponseEntity<>("challenge updated successfully",HttpStatus.OK);
        else
            return new ResponseEntity<>("challenge is not updated successfully",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteChallenge(@PathVariable Long id){
        boolean isChallengeDeleted =
                challengeService.deleteChallenge(id);
        if (isChallengeDeleted )
            return new ResponseEntity<>("challenge deleted successfully",HttpStatus.OK);
        else
            return new ResponseEntity<>("challenge is not deleted successfully",HttpStatus.NOT_FOUND);
    }

    }


