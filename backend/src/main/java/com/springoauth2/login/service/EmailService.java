package com.springoauth2.login.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.base-url:https://calorie-tracker-backend-vgqg.onrender.com}")
    private String baseUrl;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        String link = baseUrl + "/api/v1.0/verify?token=" + token;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setTo(toEmail);
            message.setSubject("Verify your account");
            message.setText("Click the link to verify your account:\n\n" + link);

            log.info("Dispatching verification email to {}...", toEmail);
            mailSender.send(message);
            log.info("Verification email successfully sent to {}", toEmail);
        } catch (Exception ex) {
            log.error("Failed to send verification email to {}. Root cause: {}", toEmail, ex.getMessage());
        }
    }
}