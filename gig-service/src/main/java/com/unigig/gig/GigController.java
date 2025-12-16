package com.unigig.gig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gigs")

public class GigController {

    @Autowired
    private GigRepository gigRepository;

    @PostMapping
    public Gig createGig(@RequestBody Gig gig) {
        return gigRepository.save(gig);
    }

    @GetMapping
    public List<Gig> getAllGigs() {
        return gigRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Gig> getGigById(@PathVariable Long id) {
        return gigRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gig> updateGig(@PathVariable Long id, @RequestBody Gig gigDetails) {
        return gigRepository.findById(id)
                .map(gig -> {
                    gig.setTitle(gigDetails.getTitle());
                    gig.setDescription(gigDetails.getDescription());
                    gig.setReward(gigDetails.getReward());
                    gig.setStatus(gigDetails.getStatus());
                    gig.setMaxPositions(gigDetails.getMaxPositions());
                    gig.setStudentIds(gigDetails.getStudentIds());
                    return ResponseEntity.ok(gigRepository.save(gig));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGig(@PathVariable Long id) {
        if (gigRepository.existsById(id)) {
            gigRepository.deleteById(id);

            // Cascade delete applications
            try {
                String appServiceUrl = "http://application-service:8084/applications/gig/" + id;
                restTemplate.delete(appServiceUrl);
            } catch (Exception e) {
                // Log and ignore (soft consistency)
                System.err.println("Failed to cascade delete applications: " + e.getMessage());
            }

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Gig> applyForGig(@PathVariable Long id, @RequestParam Long studentId) {
        return gigRepository.findById(id)
                .map(gig -> {
                    if (gig.getRejectedIds().contains(studentId)) {
                        return ResponseEntity.badRequest().body(gig); // Rejected students cannot re-apply
                    }
                    if (gig.getStudentIds().contains(studentId)) {
                         return ResponseEntity.badRequest().body(gig);
                    }
                    gig.getApplicantIds().add(studentId);
                    return ResponseEntity.ok(gigRepository.save(gig));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Gig> approveStudent(@PathVariable Long id, @RequestParam Long studentId) {
        return gigRepository.findById(id)
                .map(gig -> {
                    // Relaxed logic: Trust the Admin/ApplicationService.
                    // Always remove from applicants (if they were there)
                    gig.getApplicantIds().remove(studentId);
                    
                    // Add to students if not already there
                    if (!gig.getStudentIds().contains(studentId)) {
                        gig.getStudentIds().add(studentId);
                    }
                        
                    // Check if full
                    if (gig.getStudentIds().size() >= gig.getMaxPositions()) {
                        gig.setStatus("ASSIGNED");
                        // Auto-reject all other applicants
                        gig.getRejectedIds().addAll(gig.getApplicantIds());
                        gig.getApplicantIds().clear();
                    }
                    return ResponseEntity.ok(gigRepository.save(gig)); 
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Gig> rejectStudent(@PathVariable Long id, @RequestParam Long studentId) {
        return gigRepository.findById(id)
                .map(gig -> {
                    gig.getApplicantIds().remove(studentId);
                    gig.getRejectedIds().add(studentId); // Add to rejected list
                    return ResponseEntity.ok(gigRepository.save(gig));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private org.springframework.web.client.RestTemplate restTemplate;

    @PostMapping("/{id}/complete")
    public ResponseEntity<Gig> completeGig(@PathVariable Long id, @RequestParam Long studentId) {
        return gigRepository.findById(id)
                .map(gig -> {
                    if (gig.getStudentIds().contains(studentId)) {
                        // Add to completed list
                        gig.getCompletedStudentIds().add(studentId);

                        // Check if ALL students have completed
                        if (gig.getCompletedStudentIds().containsAll(gig.getStudentIds())) {
                            gig.setStatus("COMPLETED");
                        }
                        
                        // Call User Service to credit points
                        try {
                            Integer points = 100;
                            Integer gigs = 1;
                            String userServiceUrl = "http://user-service:8081/users/" + studentId + "/credit?points=" + points + "&gigs=" + gigs;
                            restTemplate.postForEntity(userServiceUrl, null, Void.class);
                        } catch (Exception e) {
                            System.err.println("Failed to credit user: " + e.getMessage());
                        }

                        // Call Application Service to mark as COMPLETED
                        try {
                            String appServiceUrl = "http://application-service:8084/applications/complete?studentId=" + studentId + "&gigId=" + id;
                            restTemplate.put(appServiceUrl, null);
                        } catch (Exception e) {
                            System.err.println("Failed to mark application complete: " + e.getMessage());
                        }

                        // Call Payment Service to record transaction
                        try {
                            // Simple Map to represent Transaction
                            java.util.Map<String, Object> transaction = new java.util.HashMap<>();
                            transaction.put("userId", studentId);
                            transaction.put("gigId", id);
                            transaction.put("amount", gig.getReward());
                            
                            String paymentServiceUrl = "http://payment-service:8083/payments";
                            restTemplate.postForEntity(paymentServiceUrl, transaction, Object.class);
                        } catch (Exception e) {
                            System.err.println("Failed to record payment: " + e.getMessage());
                        }

                        return ResponseEntity.ok(gigRepository.save(gig));
                    }
                    return ResponseEntity.ok(gig);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
