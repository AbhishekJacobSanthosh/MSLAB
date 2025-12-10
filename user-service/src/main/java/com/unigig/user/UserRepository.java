package com.unigig.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    List<User> findTop10ByRoleOrderByPointsDesc(String role);

    List<User> findTop10ByRoleOrderByGigsCompletedDesc(String role);
}
