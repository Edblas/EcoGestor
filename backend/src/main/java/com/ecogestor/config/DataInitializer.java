
package com.ecogestor.config;

import com.ecogestor.entity.*;
import com.ecogestor.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Profile("h2")
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final TipoDespesaRepository tipoDespesaRepository;
    private final DespesaRepository despesaRepository;
    private final ReceitaRepository receitaRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            MaterialRepository materialRepository,
            TipoDespesaRepository tipoDespesaRepository,
            DespesaRepository despesaRepository,
            ReceitaRepository receitaRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.materialRepository = materialRepository;
        this.tipoDespesaRepository = tipoDespesaRepository;
        this.despesaRepository = despesaRepository;
        this.receitaRepository = receitaRepository;
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

        // Create sample tipos de despesa
        if (tipoDespesaRepository.count() == 0) {
            TipoDespesa agua = TipoDespesa.builder()
                    .nome("Água")
                    .descricao("Conta de água mensal")
                    .build();

            TipoDespesa luz = TipoDespesa.builder()
                    .nome("Energia Elétrica")
                    .descricao("Conta de luz mensal")
                    .build();

            TipoDespesa telefone = TipoDespesa.builder()
                    .nome("Telefone/Internet")
                    .descricao("Conta de telefone e internet")
                    .build();

            TipoDespesa aluguel = TipoDespesa.builder()
                    .nome("Aluguel")
                    .descricao("Aluguel do local")
                    .build();

            TipoDespesa outros = TipoDespesa.builder()
                    .nome("Outros")
                    .descricao("Despesas diversas")
                    .build();

            tipoDespesaRepository.save(agua);
            tipoDespesaRepository.save(luz);
            tipoDespesaRepository.save(telefone);
            tipoDespesaRepository.save(aluguel);
            tipoDespesaRepository.save(outros);
        }

        // Create sample despesas
        if (despesaRepository.count() == 0) {
            TipoDespesa agua = tipoDespesaRepository.findAllActive(org.springframework.data.domain.Pageable.unpaged()).getContent().get(0);
            TipoDespesa luz = tipoDespesaRepository.findAllActive(org.springframework.data.domain.Pageable.unpaged()).getContent().get(1);

            Despesa despesa1 = Despesa.builder()
                    .tipoDespesa(agua)
                    .descricao("Conta de água de julho")
                    .valor(new BigDecimal("150.00"))
                    .dataVencimento(LocalDate.now().plusDays(10))
                    .status(StatusFinanceiro.PENDENTE)
                    .build();

            Despesa despesa2 = Despesa.builder()
                    .tipoDespesa(luz)
                    .descricao("Conta de luz de junho")
                    .valor(new BigDecimal("350.00"))
                    .dataVencimento(LocalDate.now().minusDays(5))
                    .dataPagamento(LocalDate.now().minusDays(3))
                    .status(StatusFinanceiro.PAGO)
                    .build();

            despesaRepository.save(despesa1);
            despesaRepository.save(despesa2);
        }

        // Create sample receitas
        if (receitaRepository.count() == 0) {
            Receita receita1 = Receita.builder()
                    .descricao("Venda de Alumínio")
                    .valor(new BigDecimal("1500.00"))
                    .dataRecebimento(LocalDate.now().minusDays(2))
                    .status(StatusFinanceiro.RECEBIDO)
                    .build();

            Receita receita2 = Receita.builder()
                    .descricao("Venda de Cobre")
                    .valor(new BigDecimal("2500.00"))
                    .dataRecebimento(LocalDate.now().plusDays(15))
                    .status(StatusFinanceiro.PENDENTE)
                    .build();

            receitaRepository.save(receita1);
            receitaRepository.save(receita2);
        }
    }
}
