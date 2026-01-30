/**
 * Student Management System - JavaScript
 * Handles CRUD operations, notifications, modals, and theme toggle
 */

// API Base URL
const API_URL = '/students';

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const studentCount = document.getElementById('studentCount');
const emptyState = document.getElementById('emptyState');
const studentTable = document.getElementById('studentTable');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');

// Modal Elements
const confirmModal = document.getElementById('confirmModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// State
let isEditMode = false;
let pendingAction = null;

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    setupEventListeners();
    initializeTheme();
});

/**
 * Setup event listeners
 */
function setupEventListeners() {
    studentForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
    themeToggle.addEventListener('click', toggleTheme);
    modalCancel.addEventListener('click', hideModal);
    modalConfirm.addEventListener('click', confirmAction);

    // Close modal on overlay click
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            hideModal();
        }
    });

    // Keyboard support for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && confirmModal.classList.contains('show')) {
            hideModal();
        }
    });
}

/**
 * Theme Management
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Toast Notification System
 */
function showToast(icon, title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        <div class="toast-progress"></div>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/**
 * Modal Functions
 */
function showModal(icon, title, message, action, isDanger = false) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    pendingAction = action;

    // Style confirm button based on action type
    modalConfirm.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';
    modalConfirm.textContent = isDanger ? 'Delete' : 'Confirm';

    confirmModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    confirmModal.classList.remove('show');
    document.body.style.overflow = '';
    pendingAction = null;
}

function confirmAction() {
    if (pendingAction) {
        pendingAction();
    }
    hideModal();
}

/**
 * Toggle table visibility based on data
 */
function toggleTableVisibility(hasData) {
    if (hasData) {
        studentTable.style.display = 'table';
        emptyState.classList.remove('show');
    } else {
        studentTable.style.display = 'none';
        emptyState.classList.add('show');
    }
}

/**
 * Load all students from the API
 */
async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        const students = await response.json();
        renderStudents(students);
        studentCount.textContent = students.length;
        toggleTableVisibility(students.length > 0);
    } catch (error) {
        console.error('Error loading students:', error);
        showToast('❌', 'Error', 'Failed to load students', 'error');
        toggleTableVisibility(false);
    }
}

/**
 * Render students in the table
 */
function renderStudents(students) {
    studentTableBody.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.05}s`;
        row.innerHTML = `
            <td><strong>#${student.id}</strong></td>
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td><span class="department-badge">${escapeHtml(student.department)}</span></td>
            <td class="actions-cell">
                <button class="btn-edit" onclick="editStudent(${student.id})">
                    ✏️ Edit
                </button>
                <button class="btn-delete" onclick="confirmDeleteStudent(${student.id}, '${escapeHtml(student.name)}')">
                    🗑️ Delete
                </button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Handle form submission
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    const studentData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value.trim()
    };

    // Validate form data
    if (!studentData.name || !studentData.email || !studentData.department) {
        showToast('⚠️', 'Validation Error', 'Please fill in all fields', 'warning');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentData.email)) {
        showToast('⚠️', 'Invalid Email', 'Please enter a valid email address', 'warning');
        return;
    }

    if (isEditMode) {
        showModal(
            '✏️',
            'Update Student',
            `Are you sure you want to update ${studentData.name}'s information?`,
            () => updateStudent(studentIdInput.value, studentData),
            false
        );
    } else {
        showModal(
            '➕',
            'Add New Student',
            `Are you sure you want to add ${studentData.name} to the system?`,
            () => createStudent(studentData),
            false
        );
    }
}

/**
 * Create a new student
 */
async function createStudent(studentData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            throw new Error('Failed to create student');
        }

        const newStudent = await response.json();
        showToast('✅', 'Student Added', `${studentData.name} has been successfully added!`, 'success');
        resetForm();
        loadStudents();
    } catch (error) {
        console.error('Error creating student:', error);
        showToast('❌', 'Error', 'Failed to add student', 'error');
    }
}

/**
 * Edit a student - populate form with student data
 */
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch student');
        }

        const student = await response.json();

        // Populate form
        studentIdInput.value = student.id;
        nameInput.value = student.name;
        emailInput.value = student.email;
        departmentInput.value = student.department;

        // Update UI for edit mode
        isEditMode = true;
        formTitle.innerHTML = '<span class="header-icon">✏️</span> Edit Student';
        submitBtn.innerHTML = '<span class="btn-icon">✓</span> Update Student';
        cancelBtn.style.display = 'flex';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

        showToast('📝', 'Edit Mode', `Editing ${student.name}'s information`, 'info');
    } catch (error) {
        console.error('Error fetching student:', error);
        showToast('❌', 'Error', 'Failed to load student data', 'error');
    }
}

/**
 * Update an existing student
 */
async function updateStudent(id, studentData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            throw new Error('Failed to update student');
        }

        showToast('✅', 'Student Updated', `${studentData.name}'s information has been updated!`, 'success');
        resetForm();
        loadStudents();
    } catch (error) {
        console.error('Error updating student:', error);
        showToast('❌', 'Error', 'Failed to update student', 'error');
    }
}

/**
 * Confirm delete - show modal
 */
function confirmDeleteStudent(id, name) {
    showModal(
        '🗑️',
        'Delete Student',
        `Are you sure you want to delete ${name}? This action cannot be undone.`,
        () => deleteStudent(id, name),
        true
    );
}

/**
 * Delete a student
 */
async function deleteStudent(id, name) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete student');
        }

        showToast('🗑️', 'Student Deleted', `${name} has been removed from the system`, 'success');
        loadStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
        showToast('❌', 'Error', 'Failed to delete student', 'error');
    }
}

/**
 * Reset form to initial state
 */
function resetForm() {
    studentForm.reset();
    studentIdInput.value = '';
    isEditMode = false;
    formTitle.innerHTML = '<span class="header-icon">➕</span> Add New Student';
    submitBtn.innerHTML = '<span class="btn-icon">+</span> Add Student';
    cancelBtn.style.display = 'none';
}
