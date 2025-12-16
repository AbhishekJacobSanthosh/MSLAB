package com.unigig.application;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByGigId(Long gigId);
    List<Application> findByStudentId(Long studentId);
    long countByStudentIdAndStatusIn(Long studentId, List<String> statuses);
    void deleteByGigId(Long gigId);
    Application findByStudentIdAndGigId(Long studentId, Long gigId);
}
