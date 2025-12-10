package com.unigig.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).build();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    user.setEmail(userDetails.getEmail());
                    user.setRole(userDetails.getRole());
                    user.setBio(userDetails.getBio());
                    user.setSkills(userDetails.getSkills());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<User> patchUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    if (userDetails.getName() != null) user.setName(userDetails.getName());
                    if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
                    if (userDetails.getRole() != null) user.setRole(userDetails.getRole());
                    if (userDetails.getBio() != null) user.setBio(userDetails.getBio());
                    if (userDetails.getSkills() != null) user.setSkills(userDetails.getSkills());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/credit")
    public ResponseEntity<User> creditUser(@PathVariable Long id, @RequestParam Integer points, @RequestParam Integer gigs) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setPoints(user.getPoints() + points);
                    user.setGigsCompleted(user.getGigsCompleted() + gigs);
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/leaderboard/points")
    public List<User> getLeaderboardByPoints() {
        return userRepository.findTop10ByRoleOrderByPointsDesc("STUDENT");
    }

    @GetMapping("/leaderboard/gigs")
    public List<User> getLeaderboardByGigs() {
        return userRepository.findTop10ByRoleOrderByGigsCompletedDesc("STUDENT");
    }
}
