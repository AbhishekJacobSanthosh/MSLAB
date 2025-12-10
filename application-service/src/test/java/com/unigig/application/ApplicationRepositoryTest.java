package com.unigig.application;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class ApplicationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Test
    public void testFindByGigId() {
        // given
        Application app = new Application(100L, 200L, "PENDING");
        entityManager.persist(app);
        entityManager.flush();

        // when
        List<Application> found = applicationRepository.findByGigId(100L);

        // then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getStudentId()).isEqualTo(200L);
    }
}
