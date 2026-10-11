package com.springoauth2.login.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.base-url:https://calorie-tracker-backend-vgqg.onrender.com}")
    private String baseUrl;

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    @Value("${brevo.sender.email:}")
    private String senderEmail;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String link = baseUrl + "/api/v1.0/verify?token=" + token;

        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            log.warn("BREVO_API_KEY is not configured. Verification link: {}", link);
            return;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);

            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", "Gainly", "email", senderEmail),
                    "to", List.of(Map.of("email", toEmail)),
                    "subject", "Verify your Gainly account",
                    "htmlContent", "<p>Welcome to Gainly!</p><p>Please <a href=\"" + link + "\">click here to verify your account</a>.</p>"
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api.brevo.com/v3/smtp/email",
                    request,
                    String.class
            );

            log.info("Verification email sent to {} via Brevo! Status: {}", toEmail, response.getStatusCode());
        } catch (Exception ex) {
            log.error("Failed to send verification email to {}: {}", toEmail, ex.getMessage());
        }
    }
}