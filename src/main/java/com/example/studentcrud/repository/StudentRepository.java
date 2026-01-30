package com.example.studentcrud.repository;

import com.example.studentcrud.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Student entity.
 * Extends JpaRepository to provide CRUD operations.
 * Spring Data JPA will automatically provide the implementation.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    // JpaRepository provides all basic CRUD methods:
    // - save(Student entity)
    // - findById(Integer id)
    // - findAll()
    // - deleteById(Integer id)
    // - existsById(Integer id)
    // and more...
}
