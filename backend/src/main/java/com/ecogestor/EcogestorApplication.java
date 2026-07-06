package com.ecogestor;

import com.ecogestor.entity.User;
import com.ecogestor.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
public class EcogestorApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcogestorApplication.class, args);
	}

	@Bean
	CommandLineRunner resetAdminPassword(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			User admin = userRepository.findByEmail("admin@ecogestor.com").orElse(null);
			if (admin != null) {
				admin.setPassword(passwordEncoder.encode("admin123"));
				userRepository.save(admin);
				System.out.println("Admin password reset successfully!");
			}
		};
	}

}
