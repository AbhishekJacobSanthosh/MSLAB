package com.unigig.gig;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "gigs")
public class Gig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Double reward;
    private String status; // OPEN, ASSIGNED, COMPLETED, PAID
    private Integer maxPositions = 1;

    @ElementCollection
    private Set<Long> studentIds = new HashSet<>();

    @ElementCollection
    private Set<Long> applicantIds = new HashSet<>();

    @ElementCollection
    private Set<Long> rejectedIds = new HashSet<>();

    public Gig() {}

    public Gig(String title, String description, Double reward, String status, Integer maxPositions) {
        this.title = title;
        this.description = description;
        this.reward = reward;
        this.status = status;
        this.maxPositions = maxPositions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getReward() { return reward; }
    public void setReward(Double reward) { this.reward = reward; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getMaxPositions() { return maxPositions; }
    public void setMaxPositions(Integer maxPositions) { this.maxPositions = maxPositions; }
    public Set<Long> getStudentIds() { return studentIds; }
    public void setStudentIds(Set<Long> studentIds) { this.studentIds = studentIds; }

    public Set<Long> getApplicantIds() { return applicantIds; }
    public void setApplicantIds(Set<Long> applicantIds) { this.applicantIds = applicantIds; }

    public Set<Long> getRejectedIds() {
        return rejectedIds;
    }

    public void setRejectedIds(Set<Long> rejectedIds) {
        this.rejectedIds = rejectedIds;
    }

    @ElementCollection
    private Set<Long> completedStudentIds = new HashSet<>();

    public Set<Long> getCompletedStudentIds() {
        return completedStudentIds;
    }

    public void setCompletedStudentIds(Set<Long> completedStudentIds) {
        this.completedStudentIds = completedStudentIds;
    }
}
