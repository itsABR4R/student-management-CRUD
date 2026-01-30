package com.example.studentcrud.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Student Entity class representing a student record in the database.
 * Demonstrates OOP principles: encapsulation with private fields,
 * proper constructors, and getter/setter methods.
 */
@Entity
@Table(name = "students")
public class Student {

    // Private fields for encapsulation
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String email;

    private String department;

    /**
     * Default constructor required by JPA.
     */
    public Student() {
    }

    /**
     * Parameterized constructor for creating Student objects.
     */
    public Student(String name, String email, String department) {
        this.name = name;
        this.email = email;
        this.department = department;
    }

    /**
     * Full parameterized constructor including ID.
     */
    public Student(Integer id, String name, String email, String department) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
    }

    // Getter and Setter methods for encapsulation

    /**
     * Gets the student's ID.
     */
    public Integer getId() {
        return id;
    }

    /**
     * Sets the student's ID.
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * Gets the student's name.
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the student's name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets the student's email.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the student's email.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Gets the student's department.
     */
    public String getDepartment() {
        return department;
    }

    /**
     * Sets the student's department.
     */
    public void setDepartment(String department) {
        this.department = department;
    }

    /**
     * Returns a string representation of the Student object.
     */
    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}
