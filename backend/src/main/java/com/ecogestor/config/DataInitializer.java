
package com.ecogestor.config;

import com.ecogestor.entity.*;
import com.ecogestor.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Profile("h2")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            MaterialRepository materialRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.materialRepository = materialRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create default admin user
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Administrador")
                    .email("admin@ecogestor.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
        }

        // Create sample materials
        if (materialRepository.count() == 0) {
            Material alumínio = Material.builder()
                    .nome("Alumínio")
                    .categoria("Metal")
                    .unidadeMedida("kg")
                    .valorPadraoKg(new BigDecimal("5.00"))
                    .build();

            Material cobre = Material.builder()
                    .nome("Cobre")
                    .categoria("Metal")
                    .unidadeMedida("kg")
                    .valorPadraoKg(new BigDecimal("15.00"))
                    .build();

            Material aço = Material.builder()
                    .nome("Aço")
                    .categoria("Metal")
                    .unidadeMedida("kg")
                    .valorPadraoKg(new BigDecimal("2.50"))
                    .build();

            materialRepository.save(alumínio);
            materialRepository.save(cobre);
            materialRepository.save(aço);
        }
    }
}
