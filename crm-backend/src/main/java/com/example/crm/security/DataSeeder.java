package com.example.crm.security;

import com.example.crm.model.Role;
import com.example.crm.model.User;
import com.example.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds a default ADMIN user on first startup so the API can be tested
 * immediately without a manual registration step.
 *
 * Default login -> email: admin@crm.com | password: admin123
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@crm.com")) {
            User admin = User.builder()
                    .fullName("System Admin")
                    .email("admin@crm.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Default admin created -> email: admin@crm.com | password: admin123");
        }
    }
}
