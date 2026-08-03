package com.hostel.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;

public class ExpenseSummaryDTO {
    private BigDecimal totalAmount;
    private BigDecimal averagePerMember;
    private String topSpender;
    private String mostBoughtCategory;
    private List<MemberTotal> perMember;
    private List<CategoryTotal> perCategory;

    public ExpenseSummaryDTO() {}

    public ExpenseSummaryDTO(BigDecimal totalAmount, BigDecimal averagePerMember, String topSpender, String mostBoughtCategory, List<MemberTotal> perMember, List<CategoryTotal> perCategory) {
        this.totalAmount = totalAmount;
        this.averagePerMember = averagePerMember;
        this.topSpender = topSpender;
        this.mostBoughtCategory = mostBoughtCategory;
        this.perMember = perMember;
        this.perCategory = perCategory;
    }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public BigDecimal getAveragePerMember() { return averagePerMember; }
    public String getTopSpender() { return topSpender; }
    public String getMostBoughtCategory() { return mostBoughtCategory; }
    public List<MemberTotal> getPerMember() { return perMember; }
    public List<CategoryTotal> getPerCategory() { return perCategory; }

    public static class MemberTotal {
        private String memberName;
        private BigDecimal total;
        public MemberTotal() {}
        public MemberTotal(String memberName, BigDecimal total) { this.memberName = memberName; this.total = total; }
        public String getMemberName() { return memberName; }
        public BigDecimal getTotal() { return total; }
    }

    public static class CategoryTotal {
        private String categoryName;
        private BigDecimal total;
        public CategoryTotal() {}
        public CategoryTotal(String categoryName, BigDecimal total) { this.categoryName = categoryName; this.total = total; }
        public String getCategoryName() { return categoryName; }
        public BigDecimal getTotal() { return total; }
    }
}
