package com.unigig.gig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class GigServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testCreateGig() throws Exception {
        String gigJson = "{\"title\":\"Fix Printer\",\"description\":\"Fix the printer in lab 3\",\"reward\":50.0,\"status\":\"OPEN\"}";
        mockMvc.perform(post("/gigs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(gigJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Fix Printer"));
    }

    @Test
    public void testGetAllGigs() throws Exception {
        mockMvc.perform(get("/gigs"))
                .andExpect(status().isOk());
    }
}
