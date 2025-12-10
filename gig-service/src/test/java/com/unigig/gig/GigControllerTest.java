package com.unigig.gig;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GigController.class)
public class GigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GigRepository gigRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Gig testGig;

    @BeforeEach
    void setUp() {
        testGig = new Gig("Code for Good", "Help build a website", 500.0, "OPEN", 2);
        testGig.setId(1L);
    }

    @Test
    public void testCreateGig() throws Exception {
        when(gigRepository.save(any(Gig.class))).thenReturn(testGig);

        mockMvc.perform(post("/gigs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testGig)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Code for Good"));
    }

    @Test
    public void testGetAllGigs() throws Exception {
        when(gigRepository.findAll()).thenReturn(Arrays.asList(testGig));

        mockMvc.perform(get("/gigs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Code for Good"));
    }

    @Test
    public void testGetGigById_Success() throws Exception {
        when(gigRepository.findById(1L)).thenReturn(Optional.of(testGig));

        mockMvc.perform(get("/gigs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Code for Good"));
    }

    @Test
    public void testGetGigById_NotFound() throws Exception {
        when(gigRepository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/gigs/99"))
                .andExpect(status().isNotFound());
    }
}
