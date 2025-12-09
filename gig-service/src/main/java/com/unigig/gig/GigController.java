package com.unigig.gig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gigs")
@CrossOrigin(origins = "*")
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
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
