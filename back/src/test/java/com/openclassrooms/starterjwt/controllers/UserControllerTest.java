package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    public void testFindById_shouldReturnUser() throws Exception {
        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("admin@test.com"))
                .andExpect(jsonPath("$.firstName").value("Admin"))
                .andExpect(jsonPath("$.lastName").value("Test"));
    }

    @Test
    @WithMockUser
    public void testFindById_whenUserNotFound_shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/user/0"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user@test.com")
    public void testDelete_whenAuthorized_shouldDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/user/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "admin@test.com")
    public void testDelete_whenUnauthorized_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/user/2"))
                .andExpect(status().isUnauthorized());
    }
}