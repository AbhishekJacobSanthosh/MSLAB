package com.unigig.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void findByEmail_thenReturnUser() {
        // given
        User axel = new User("Axel", "axel@example.com", "STUDENT", "pass", "bio", "skills");
        entityManager.persist(axel);
        entityManager.flush();

        // when
        User found = userRepository.findByEmail("axel@example.com");

        // then
        assertThat(found.getName()).isEqualTo(axel.getName());
    }
}
