package com.hostel.expensetracker.repository;

import com.hostel.expensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query(value = "SELECT * FROM expenses e WHERE " +
           "(CAST(:startDate AS DATE) IS NULL OR e.purchase_date >= :startDate) AND " +
           "(CAST(:endDate AS DATE) IS NULL OR e.purchase_date <= :endDate) AND " +
           "(CAST(:memberId AS BIGINT) IS NULL OR e.member_id = :memberId) AND " +
           "(CAST(:categoryId AS BIGINT) IS NULL OR e.category_id = :categoryId) " +
           "ORDER BY e.purchase_date DESC, e.id DESC",
           nativeQuery = true)
    List<Expense> findFiltered(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("memberId") Long memberId,
            @Param("categoryId") Long categoryId
    );
}
