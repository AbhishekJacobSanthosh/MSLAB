package com.unigig.gig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class GigRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private GigRepository gigRepository;

    @Test
    public void testSaveAndFindGig() {
        // given
        Gig gig = new Gig("Clean Lab", "Clean the biology lab", 20.0, "OPEN", 1);
        entityManager.persist(gig);
        entityManager.flush();

        // when
        Gig found = gigRepository.findById(gig.getId()).orElse(null);

        // then
        assertThat(found).isNotNull();
        assertThat(found.getTitle()).isEqualTo("Clean Lab");
    }
}
