// src/app/employee.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// IMPORTANT: Employee interface updated to precisely match Spring Boot EmployeeEntity
// 'id' is Long in Java, becomes number in TypeScript.
// 'salary' is double in Java, becomes number | null in TypeScript to match form state.
export interface Employee {
  id?: number;         // Optional for new employees, assigned by backend for existing
  firstName: string;   // Matches backend 'firstName'
  lastName: string;    // Matches backend 'lastName'
  email: string;       // Matches backend 'email'
  position: string;
  salary: number | null; // <--- FIX: Changed to allow 'null' to match form's initial state
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // IMPORTANT: Ensure this matches your Spring Boot server's URL and base path
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  /**
   * Sends new employee data to the backend for creation.
   * Backend endpoint: POST http://localhost:8080/api/employees/save
   */
  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/save`, employee);
  }

  /**
   * Fetches all employees from the backend.
   * Backend endpoint: GET http://localhost:8080/api/employees
   */
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  /**
   * Sends updated employee data to the backend.
   * Backend endpoint: PUT http://localhost:8080/api/employees/{id}
   */
  updateEmployee(employee: Employee): Observable<Employee> {
    if (!employee.id) {
      throw new Error('Employee must have an ID to be updated.');
    }
    const url = `${this.apiUrl}/${employee.id}`; // Append ID to the URL
    return this.http.put<Employee>(url, employee);
  }

  /**
   * Deletes an employee by ID from the backend.
   * Backend endpoint: DELETE http://localhost:8080/api/employees/{id}
   */
  deleteEmployee(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`; // Append ID to the URL
    return this.http.delete<void>(url);
  }
}