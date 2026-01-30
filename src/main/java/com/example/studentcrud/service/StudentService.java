package com.example.studentcrud.service;

import com.example.studentcrud.entity.Student;
import com.example.studentcrud.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class that handles business logic for Student operations.
 * Demonstrates proper use of dependency injection and service layer pattern.
 */
@Service
public class StudentService {

    // Dependency injection of the repository
    private final StudentRepository studentRepository;

    /**
     * Constructor-based dependency injection.
     * This is the recommended way to inject dependencies in Spring.
     * 
     * @param studentRepository the repository to be injected
     */
    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Retrieves all students from the database.
     * 
     * @return a list of all students
     */
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Retrieves a student by their ID.
     * 
     * @param id the ID of the student to retrieve
     * @return an Optional containing the student if found, or empty if not found
     */
    public Optional<Student> getStudentById(Integer id) {
        return studentRepository.findById(id);
    }

    /**
     * Creates a new student record in the database.
     * 
     * @param student the student object to save
     * @return the saved student with generated ID
     */
    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }

    /**
     * Updates an existing student record.
     */
    public Optional<Student> updateStudent(Integer id, Student student) {
        return studentRepository.findById(id)
                .map(existingStudent -> {
                    existingStudent.setName(student.getName());
                    existingStudent.setEmail(student.getEmail());
                    existingStudent.setDepartment(student.getDepartment());
                    return studentRepository.save(existingStudent);
                });
    }

    /**
     * Deletes a student by their ID.
     * 
     * @param id the ID of the student to delete
     * @return true if the student was deleted, false if not found
     */
    public boolean deleteStudent(Integer id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
