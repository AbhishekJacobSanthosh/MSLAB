package com.unigig.gig;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GigRepository extends JpaRepository<Gig, Long> {
}
