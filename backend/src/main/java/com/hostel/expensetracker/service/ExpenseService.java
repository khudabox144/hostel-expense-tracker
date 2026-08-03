package com.hostel.expensetracker.service;

import com.hostel.expensetracker.dto.ExpenseDTO;
import com.hostel.expensetracker.dto.ExpenseSummaryDTO;
import com.hostel.expensetracker.model.Category;
import com.hostel.expensetracker.model.Expense;
import com.hostel.expensetracker.model.Member;
import com.hostel.expensetracker.repository.CategoryRepository;
import com.hostel.expensetracker.repository.ExpenseRepository;
import com.hostel.expensetracker.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;

    public List<ExpenseDTO> getExpenses(String month, Long memberId, Long categoryId) {
        LocalDate startDate = null;
        LocalDate endDate = null;
        if (month != null && !month.isEmpty()) {
            YearMonth yearMonth = YearMonth.parse(month);
            startDate = yearMonth.atDay(1);
            endDate = yearMonth.atEndOfMonth();
        }
        return expenseRepository.findFiltered(startDate, endDate, memberId, categoryId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ExpenseSummaryDTO getSummary(String month) {
        YearMonth yearMonth = month != null ? YearMonth.parse(month) : YearMonth.now();
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<Expense> expenses = expenseRepository.findFiltered(startDate, endDate, null, null);
        
        BigDecimal totalAmount = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, BigDecimal> perMemberMap = new HashMap<>();
        Map<String, BigDecimal> perCategoryMap = new HashMap<>();
        
        for (Expense e : expenses) {
            perMemberMap.merge(e.getMember().getName(), e.getAmount(), BigDecimal::add);
            perCategoryMap.merge(e.getCategory() != null ? e.getCategory().getName() : "Other", e.getAmount(), BigDecimal::add);
        }
        
        long count = expenses.stream().map(e -> e.getMember().getId()).distinct().count();
        BigDecimal avg = count > 0 ? totalAmount.divide(BigDecimal.valueOf(count), 2, java.math.RoundingMode.HALF_UP) : BigDecimal.ZERO;
        
        String topSpender = perMemberMap.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A");
        String topCat = perCategoryMap.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A");
        
        List<ExpenseSummaryDTO.MemberTotal> memberTotals = perMemberMap.entrySet().stream()
                .map(e -> new ExpenseSummaryDTO.MemberTotal(e.getKey(), e.getValue())).collect(Collectors.toList());
        List<ExpenseSummaryDTO.CategoryTotal> categoryTotals = perCategoryMap.entrySet().stream()
                .map(e -> new ExpenseSummaryDTO.CategoryTotal(e.getKey(), e.getValue())).collect(Collectors.toList());
        
        return new ExpenseSummaryDTO(totalAmount, avg, topSpender, topCat, memberTotals, categoryTotals);
    }

    public ExpenseDTO createExpense(ExpenseDTO dto) {
        Member member = memberRepository.findById(dto.getMemberId()).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found"));
        Expense expense = new Expense();
        expense.setMember(member);
        expense.setCategory(category);
        expense.setItemName(dto.getItemName());
        expense.setAmount(dto.getAmount());
        expense.setPurchaseDate(dto.getPurchaseDate());
        expense.setNotes(dto.getNotes());
        return toDTO(expenseRepository.save(expense));
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        Member member = memberRepository.findById(dto.getMemberId()).orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Category category = categoryRepository.findById(dto.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found"));
        expense.setMember(member);
        expense.setCategory(category);
        expense.setItemName(dto.getItemName());
        expense.setAmount(dto.getAmount());
        expense.setPurchaseDate(dto.getPurchaseDate());
        expense.setNotes(dto.getNotes());
        return toDTO(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    private ExpenseDTO toDTO(Expense e) {
        return new ExpenseDTO(e.getId(), e.getMember().getId(), e.getMember().getName(),
                e.getCategory().getId(), e.getCategory().getName(), e.getItemName(),
                e.getAmount(), e.getPurchaseDate(), e.getNotes());
    }
}
