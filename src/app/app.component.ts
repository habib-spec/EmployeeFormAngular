// src/app/app.component.ts

import { Component, OnInit } from '@angular/core'; // Import OnInit for lifecycle hook
import { CommonModule } from '@angular/common';   // For NgIf, NgFor directives
import { FormsModule } from '@angular/forms';     // For [(ngModel)]

import { EmployeeService, Employee } from './employee.service'; // Import the service and interface

@Component({
  selector: 'app-root',
  standalone: true, // This component is standalone, no NgModule needed
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Note: styleUrls is plural
})
export class AppComponent implements OnInit { // Implement OnInit interface
  protected title = 'Employee Management System'; // Updated title

  // Form properties, matching Employee interface field names
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  position: string = '';
  salary: number | null = null; // Matches Employee interface and initial state

  protected selectedEmployeeId: number | null = null; // Tracks which employee is being edited

  employees: Employee[] = []; // Array to store fetched employees

  constructor(private employeeService: EmployeeService) { } // Inject the EmployeeService

  // Lifecycle hook: called once after the component is initialized
  ngOnInit(): void {
    this.getEmployees(); // Fetch employees when the app starts
  }

  /**
   * Fetches the list of employees from the backend and updates the local array.
   */
  getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data; // Assign fetched data to employees array
        console.log('Employees loaded:', this.employees);
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        alert('Failed to load employees. Check console for details.');
      }
    });
  }

  /**
   * Handles form submission. Determines whether to add a new employee or update an existing one.
   */
  onSubmit(): void {
    // Create an employee object from current form data
    const employeeData: Employee = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      position: this.position,
      salary: this.salary
    };

    if (this.selectedEmployeeId) {
      // If an employee is selected for editing, perform an update
      employeeData.id = this.selectedEmployeeId; // Add the ID for the update operation
      this.employeeService.updateEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee updated successfully:', response);
          alert('Employee updated successfully!');
          this.resetForm();    // Clear form and switch to add mode
          this.getEmployees(); // Refresh the employee list
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          alert('Failed to update employee. Check console for details.');
        }
      });
    } else {
      // Otherwise, add a new employee
      this.employeeService.addEmployee(employeeData).subscribe({
        next: (response) => {
          console.log('Employee added successfully:', response);
          alert('Employee added successfully!');
          this.resetForm();    // Clear the form
          this.getEmployees(); // Refresh the employee list
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          alert('Failed to add employee. Check console for details.');
        }
      });
    }
  }

  /**
   * Populates the form fields with the data of the selected employee for editing.
   * @param employee The employee object to edit.
   */
  editEmployee(employee: Employee): void {
    this.selectedEmployeeId = employee.id || null; // Store the ID for update operation
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.email = employee.email;
    this.position = employee.position;
    this.salary = employee.salary;
  }

  /**
   * Deletes an employee from the backend and refreshes the list.
   * @param id The ID of the employee to delete.
   */
  deleteEmployee(id: number | undefined): void {
    if (id === undefined) {
      console.warn('Attempted to delete employee without an ID.');
      return;
    }

    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          console.log('Employee deleted successfully:', id);
          alert('Employee deleted successfully!');
          this.getEmployees(); // Refresh the list
          // If the deleted employee was currently being edited, reset the form
          if (this.selectedEmployeeId === id) {
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Check console for details.');
        }
      });
    }
  }

  /**
   * Resets all form fields and clears the selected employee ID,
   * effectively switching back to "Add Employee" mode.
   */
  resetForm(): void {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.position = '';
    this.salary = null;
    this.selectedEmployeeId = null; // Exit edit mode
  }
}