package com.unigig.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationRepository applicationRepository;

    @MockBean
    private RestTemplate restTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    private Application testApp;

    @BeforeEach
    void setUp() {
        testApp = new Application(101L, 202L, "PENDING");
        testApp.setId(1L);
    }

    @Test
    public void testApply_Success() throws Exception {
        when(applicationRepository.countByStudentIdAndStatusIn(anyLong(), anyList())).thenReturn(0L);
        when(applicationRepository.save(any(Application.class))).thenReturn(testApp);

        mockMvc.perform(post("/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testApp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    public void testApply_MaxLimitReached() throws Exception {
        when(applicationRepository.countByStudentIdAndStatusIn(anyLong(), anyList())).thenReturn(3L);

        mockMvc.perform(post("/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testApp)))
                // The controller throws RuntimeException which by default results in 500 or 400 depending on error handling
                // For simplicity assuming standard Spring Boot error (likely 500 or 4xx if exception handler exists)
                // We'll just verify it doesn't return 200 OK.
                .andExpect(status().isInternalServerError()); // default for unchecked exceptions
    }

    @Test
    public void testApproveApplication_Success() throws Exception {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(testApp));
        when(applicationRepository.save(any(Application.class))).thenAnswer(i -> i.getArguments()[0]);

        // Mock Gig Service response
        Map<String, Object> gigMock = new HashMap<>();
        gigMock.put("maxPositions", 5);
        gigMock.put("studentIds", new java.util.ArrayList<Number>());
        
        when(restTemplate.getForObject(anyString(), eq(Map.class))).thenReturn(gigMock);
        
        mockMvc.perform(put("/applications/1/approve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }
}
