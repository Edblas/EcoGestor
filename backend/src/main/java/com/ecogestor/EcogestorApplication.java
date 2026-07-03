package com.ecogestor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EcogestorApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcogestorApplication.class, args);
	}

}
