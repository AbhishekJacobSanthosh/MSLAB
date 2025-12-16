package com.unigig.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private RestTemplate restTemplate;

    @PostMapping
    public Application apply(@RequestBody Application application) {
        long count = applicationRepository.countByStudentIdAndStatusIn(application.getStudentId(), java.util.List.of("PENDING", "APPROVED"));
        if (count >= 3) {
            throw new RuntimeException("You have reached the limit of 3 active Gigs (Pending or Approved).");
        }
        application.setStatus("PENDING");
        
        // Call GigService to update applicantIds
        String gigServiceUrl = "http://gig-service:8082/gigs/" + application.getGigId() + "/apply?studentId=" + application.getStudentId();
        try {
            restTemplate.postForEntity(gigServiceUrl, null, Object.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to notify GigService: " + e.getMessage());
        }

        return applicationRepository.save(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/gig/{gigId}")
    public List<Application> getByGig(@PathVariable Long gigId) {
        return applicationRepository.findByGigId(gigId);
    }

    @GetMapping("/student/{studentId}")
    public List<Application> getByStudent(@PathVariable Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @PutMapping("/{id}/approve")
    public Application approve(@PathVariable Long id) {
        Application app = applicationRepository.findById(id).orElseThrow();
        
        // Call GigService to approve student
        String gigServiceUrl = "http://gig-service:8082/gigs/" + app.getGigId() + "/approve?studentId=" + app.getStudentId();
        try {
            restTemplate.postForEntity(gigServiceUrl, null, Object.class);
        } catch (Exception e) {
             throw new RuntimeException("Failed to approve in GigService: " + e.getMessage());
        }

        app.setStatus("APPROVED");
        return applicationRepository.save(app);
    }

    @PutMapping("/{id}/reject")
    public Application reject(@PathVariable Long id) {
        Application app = applicationRepository.findById(id).orElseThrow();
        
        // Call GigService to reject student
        String gigServiceUrl = "http://gig-service:8082/gigs/" + app.getGigId() + "/reject?studentId=" + app.getStudentId();
        try {
            restTemplate.postForEntity(gigServiceUrl, null, Object.class);
        } catch (Exception e) {
             throw new RuntimeException("Failed to reject in GigService: " + e.getMessage());
        }

        app.setStatus("REJECTED");
        return applicationRepository.save(app);
    }

    @DeleteMapping("/gig/{gigId}")
    @org.springframework.transaction.annotation.Transactional
    public void deleteApplicationsByGig(@PathVariable Long gigId) {
        applicationRepository.deleteByGigId(gigId);
    }

    @PutMapping("/complete")
    public void completeApplication(@RequestParam Long studentId, @RequestParam Long gigId) {
        Application app = applicationRepository.findByStudentIdAndGigId(studentId, gigId);
        if (app != null) {
            app.setStatus("COMPLETED");
            applicationRepository.save(app);
        }
    }
}
