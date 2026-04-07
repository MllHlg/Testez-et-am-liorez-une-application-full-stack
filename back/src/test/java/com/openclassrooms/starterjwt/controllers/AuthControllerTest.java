package com.openclassrooms.starterjwt.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testRegisterUser_shouldReturnSuccessMessage() throws Exception {
        String signupRequest = "{"
                + "\"email\": \"new_user@test.com\","
                + "\"firstName\": \"New User\","
                + "\"lastName\": \"Test\","
                + "\"password\": \"new_user_password\""
                + "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    public void testRegisterUser_whenEmailAlreadyExists_shouldReturnBadRequest() throws Exception {
        String signupRequest = "{"
                + "\"email\": \"admin@test.com\","
                + "\"firstName\": \"Second Admin\","
                + "\"lastName\": \"Test\","
                + "\"password\": \"second_admin_password\""
                + "}";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(signupRequest))
                .andExpect(status().isBadRequest()); 
    }

    @Test
    public void testAuthenticateUser_shouldReturnJwtResponse() throws Exception {
        String loginRequest = "{"
                + "\"email\": \"admin@test.com\","
                + "\"password\": \"admin_password\""
                + "}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.admin").value(true));
    }
}