package com.unigig.application;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long gigId;
    private Long studentId;
    private String status; // PENDING, APPROVED, REJECTED

    public Application() {}

    public Application(Long gigId, Long studentId, String status) {
        this.gigId = gigId;
        this.studentId = studentId;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getGigId() { return gigId; }
    public void setGigId(Long gigId) { this.gigId = gigId; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
