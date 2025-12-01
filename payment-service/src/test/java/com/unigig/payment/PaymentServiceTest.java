package com.unigig.payment;

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
public class PaymentServiceTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testProcessPayment() throws Exception {
        String paymentJson = "{\"userId\":1,\"gigId\":1,\"amount\":50.0}";
        mockMvc.perform(post("/payments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(paymentJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(50.0));
    }

    @Test
    public void testGetAllTransactions() throws Exception {
        mockMvc.perform(get("/payments"))
                .andExpect(status().isOk());
    }
}
