package com.unigig.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")

public class PaymentController {

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping
    public Transaction processPayment(@RequestBody Transaction transaction) {
        transaction.setTimestamp(java.time.LocalDateTime.now());
        return transactionRepository.save(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getTransactionsByUser(@PathVariable Long userId) {
        return transactionRepository.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}/earnings")
    public ResponseEntity<Double> getStudentEarnings(@PathVariable Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        double totalEarnings = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
        return ResponseEntity.ok(totalEarnings);
    }
}
