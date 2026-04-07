package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser
    public void testFindById_shouldReturnSession() throws Exception {
        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session Test"));
    }

    @Test
    @WithMockUser
    public void testFindAll_shouldReturnAllSessions() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Session Test"));
    }

    @Test
    @WithMockUser
    public void testCreate_shouldReturnCreatedSession() throws Exception {
        String newSessionJson = "{"
                + "\"name\": \"Nouvelle session test\","
                + "\"date\": \"2026-05-20T10:00:00\","
                + "\"teacher_id\": 3,"
                + "\"description\": \"Description de la nouvelle session\""
                + "}";

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newSessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nouvelle session test"));
    }

    @Test
    @WithMockUser
    public void testUpdate_shouldReturnUpdatedSession() throws Exception {
        String updatedSessionJson = "{"
                + "\"name\": \"Session modifiée\","
                + "\"date\": \"2026-06-20T10:00:00\","
                + "\"teacher_id\": 1,"
                + "\"description\": \"Description modifiée\""
                + "}";

        mockMvc.perform(put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedSessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Session modifiée"));
    }

    @Test
    @WithMockUser
    public void testDelete_shouldDeleteSession() throws Exception {
        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testParticipate_shouldReturnOk() throws Exception {
        mockMvc.perform(post("/api/session/2/participate/2"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    public void testNoLongerParticipate_shouldReturnOk() throws Exception {
        mockMvc.perform(delete("/api/session/2/participate/1"))
                .andExpect(status().isOk());
    }
}