package com.hostel.expensetracker.service;

import com.hostel.expensetracker.dto.MemberDTO;
import com.hostel.expensetracker.exception.ResourceNotFoundException;
import com.hostel.expensetracker.model.Member;
import com.hostel.expensetracker.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public MemberDTO createMember(MemberDTO dto) {
        Member member = new Member();
        member.setName(dto.getName());
        member.setJoinDate(dto.getJoinDate());
        Member saved = memberRepository.save(member);
        return toDTO(saved);
    }

    @Transactional
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new ResourceNotFoundException("Member not found with id: " + id);
        }
        memberRepository.deleteById(id);
    }

    private MemberDTO toDTO(Member member) {
        return new MemberDTO(member.getId(), member.getName(), member.getJoinDate());
    }
}
