package com.hostel.expensetracker.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ExpenseDTO(
    Long id,
    @NotNull Long memberId,
    String memberName,
    @NotNull Long categoryId,
    String categoryName,
    @NotBlank String itemName,
    @NotNull @DecimalMin("0.01") BigDecimal amount,
    @NotNull LocalDate purchaseDate,
    String notes
) {}
