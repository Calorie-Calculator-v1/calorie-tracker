package com.springoauth2.login.service;

import com.springoauth2.login.dto.UserDTO;
import com.springoauth2.login.entity.UserEntity;
import com.springoauth2.login.repo.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public void register(@Valid UserDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        UserEntity newUser = new UserEntity();
        newUser.setName(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default to true so users can immediately log in even if email fails
        newUser.setEnabled(true);
        newUser.setVerificationToken(UUID.randomUUID().toString());

        userRepository.save(newUser);
        log.info("User {} successfully saved in database", newUser.getEmail());

        // Safe email dispatch: will not crash registration if SMTP fails
        try {
            emailService.sendVerificationEmail(newUser.getEmail(), newUser.getVerificationToken());
            log.info("Verification email sent successfully to {}", newUser.getEmail());
        } catch (Exception ex) {
            log.error("Failed to send verification email to {}. Error: {}", newUser.getEmail(), ex.getMessage(), ex);
        }
    }

    public void verifyUser(String token) {
        UserEntity user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification token"));

        user.setEnabled(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }
}