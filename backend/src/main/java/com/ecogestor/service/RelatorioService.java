package com.ecogestor.service;

import com.ecogestor.dto.relatorio.RelatorioItemDTO;
import com.ecogestor.entity.EntradaMaterial;
import com.ecogestor.entity.SaidaMaterial;
import com.ecogestor.repository.EntradaMaterialRepository;
import com.ecogestor.repository.SaidaMaterialRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RelatorioService {

    private final EntradaMaterialRepository entradaRepository;
    private final SaidaMaterialRepository saidaRepository;

    public RelatorioService(EntradaMaterialRepository entradaRepository,
                           SaidaMaterialRepository saidaRepository) {
        this.entradaRepository = entradaRepository;
        this.saidaRepository = saidaRepository;
    }

    public ByteArrayOutputStream gerarRelatorioPersonalizado(LocalDate dataInicio, LocalDate dataFim,
                                                              UUID materialId, UUID clienteId, UUID fornecedorId) {
        LocalDateTime dtInicio = dataInicio.atStartOfDay();
        LocalDateTime dtFim = dataFim.atTime(23, 59, 59);
        String periodoLabel = String.format("%s até %s", 
            dataInicio.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
            dataFim.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        List<EntradaMaterial> entradas = entradaRepository.findByDataEntradaBetween(dtInicio, dtFim);
        List<SaidaMaterial> saidas = saidaRepository.findByDataSaidaBetween(dtInicio, dtFim);

        List<RelatorioItemDTO> items = new ArrayList<>();
        BigDecimal totalEntradas = BigDecimal.ZERO;
        BigDecimal totalSaidas = BigDecimal.ZERO;

        for (EntradaMaterial entrada : entradas) {
            if (materialId != null && !entrada.getMaterial().getId().equals(materialId)) continue;
            if (clienteId != null && (entrada.getCliente() == null || !entrada.getCliente().getId().equals(clienteId))) continue;
            if (fornecedorId != null && (entrada.getFornecedor() == null || !entrada.getFornecedor().getId().equals(fornecedorId))) continue;

            items.add(RelatorioItemDTO.builder()
                    .tipo("ENTRADA")
                    .material(entrada.getMaterial().getNome())
                    .cliente(entrada.getCliente() != null ? entrada.getCliente().getNome() : "")
                    .fornecedor(entrada.getFornecedor() != null ? entrada.getFornecedor().getNome() : "")
                    .peso(entrada.getPeso())
                    .valorKg(entrada.getValorKg())
                    .valorTotal(entrada.getValorTotal())
                    .data(entrada.getDataEntrada())
                    .observacoes(entrada.getObservacoes())
                    .build());
            totalEntradas = totalEntradas.add(entrada.getValorTotal());
        }

        for (SaidaMaterial saida : saidas) {
            if (materialId != null && !saida.getMaterial().getId().equals(materialId)) continue;
            if (clienteId != null && !saida.getCliente().getId().equals(clienteId)) continue;

            items.add(RelatorioItemDTO.builder()
                    .tipo("SAÍDA")
                    .material(saida.getMaterial().getNome())
                    .cliente(saida.getCliente().getNome())
                    .fornecedor("")
                    .peso(saida.getPeso())
                    .valorKg(saida.getValorKg())
                    .valorTotal(saida.getValorTotal())
                    .data(saida.getDataSaida())
                    .observacoes(saida.getObservacoes())
                    .build());
            totalSaidas = totalSaidas.add(saida.getValorTotal());
        }

        items.sort((a, b) -> a.getData().compareTo(b.getData()));

        return gerarPDF(periodoLabel, items, totalEntradas, totalSaidas);
    }

    private ByteArrayOutputStream gerarPDF(String periodo, List<RelatorioItemDTO> items,
                                            BigDecimal totalEntradas, BigDecimal totalSaidas) {
        try {
            Document document = new Document(PageSize.A4.rotate());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.DARK_GRAY);
            Paragraph title = new Paragraph("Relatório de Entradas e Saídas de Materiais", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 14, BaseColor.GRAY);
            Paragraph subtitle = new Paragraph("Período: " + periodo, subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20f);
            document.add(subtitle);

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            float[] widths = {1.2f, 2f, 2f, 2f, 1.5f, 1.5f, 1.5f, 3f};
            table.setWidths(widths);

            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            String[] headers = {"Tipo", "Material", "Cliente", "Fornecedor", "Peso (kg)", "Valor/kg", "Total", "Data"};
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(BaseColor.DARK_GRAY);
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
            for (RelatorioItemDTO item : items) {
                PdfPCell cellTipo = new PdfPCell(new Phrase(item.getTipo(), cellFont));
                cellTipo.setPadding(3);
                cellTipo.setBackgroundColor(item.getTipo().equals("ENTRADA") ? new BaseColor(200, 255, 200) : new BaseColor(255, 200, 200));
                table.addCell(cellTipo);

                PdfPCell cellMaterial = new PdfPCell(new Phrase(item.getMaterial(), cellFont));
                cellMaterial.setPadding(3);
                table.addCell(cellMaterial);

                PdfPCell cellCliente = new PdfPCell(new Phrase(item.getCliente(), cellFont));
                cellCliente.setPadding(3);
                table.addCell(cellCliente);

                PdfPCell cellFornecedor = new PdfPCell(new Phrase(item.getFornecedor(), cellFont));
                cellFornecedor.setPadding(3);
                table.addCell(cellFornecedor);

                PdfPCell cellPeso = new PdfPCell(new Phrase(String.format("%.2f", item.getPeso()), cellFont));
                cellPeso.setPadding(3);
                cellPeso.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cellPeso);

                PdfPCell cellValorKg = new PdfPCell(new Phrase(String.format("R$ %.2f", item.getValorKg()), cellFont));
                cellValorKg.setPadding(3);
                cellValorKg.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cellValorKg);

                PdfPCell cellTotal = new PdfPCell(new Phrase(String.format("R$ %.2f", item.getValorTotal()), cellFont));
                cellTotal.setPadding(3);
                cellTotal.setHorizontalAlignment(Element.ALIGN_RIGHT);
                table.addCell(cellTotal);

                PdfPCell cellData = new PdfPCell(new Phrase(item.getData().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")), cellFont));
                cellData.setPadding(3);
                cellData.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cellData);
            }

            document.add(table);
            document.add(Chunk.NEWLINE);

            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Paragraph totalEntradasP = new Paragraph("Total de Entradas: R$ " + String.format("%.2f", totalEntradas), totalFont);
            totalEntradasP.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalEntradasP);

            Paragraph totalSaidasP = new Paragraph("Total de Saídas: R$ " + String.format("%.2f", totalSaidas), totalFont);
            totalSaidasP.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalSaidasP);

            Paragraph saldoP = new Paragraph("Saldo: R$ " + String.format("%.2f", totalEntradas.subtract(totalSaidas)), totalFont);
            saldoP.setAlignment(Element.ALIGN_RIGHT);
            document.add(saldoP);

            document.close();
            return out;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF", e);
        }
    }
}
