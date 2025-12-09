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

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public Application apply(@RequestBody Application application) {
        long count = applicationRepository.countByStudentIdAndStatusIn(application.getStudentId(), List.of("PENDING"));
        if (count >= 3) {
            throw new RuntimeException("Max 3 active applications allowed.");
        }
        application.setStatus("PENDING");
        return applicationRepository.save(application);
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
        
        String gigServiceUrl = "http://gig-service:8082/gigs/" + app.getGigId();
        Map gig = restTemplate.getForObject(gigServiceUrl, Map.class);
        
        if (gig != null) {
            java.util.List<Number> studentIds = (java.util.List<Number>) gig.get("studentIds");
            if (studentIds == null) studentIds = new java.util.ArrayList<>();
            
            Integer maxPositions = (Integer) gig.get("maxPositions");
            if (maxPositions == null) maxPositions = 1;
            
            if (studentIds.size() >= maxPositions) {
                 throw new RuntimeException("Gig is full");
            }
            
            // Avoid duplicates
            long studentIdLong = app.getStudentId();
            boolean alreadyAssigned = studentIds.stream().anyMatch(sid -> sid.longValue() == studentIdLong);
            
            if (!alreadyAssigned) {
                 studentIds.add(studentIdLong);
                 gig.put("studentIds", studentIds);
                 
                 // If full, mark ASSIGNED
                 if (studentIds.size() >= maxPositions) {
                     gig.put("status", "ASSIGNED");
                 }
                 // Else keep status as is (OPEN)
                 
                 restTemplate.put(gigServiceUrl, gig);
            }
        }

        app.setStatus("APPROVED");
        return applicationRepository.save(app);
    }

    @PutMapping("/{id}/reject")
    public Application reject(@PathVariable Long id) {
        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus("REJECTED");
        return applicationRepository.save(app);
    }
}
