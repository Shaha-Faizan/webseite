import { Component, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:[CommonModule,FormsModule,HttpClientModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userList: Array<any> = []; // Array to hold user data

  http = inject(HttpClient) // Inject HttpClient

  userName: string = '';
  userEmail: string = '';
  userNumber: string = '';
  userId: number | null = null;

  getUsers() {
    this.http.get('https://jsonplaceholder.typicode.com/users').subscribe(
      (response: any) => {
        this.userList = response;
        console.log('Users fetched:', response);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // POST: Add a new user
  addUser() {
    const newUser = { name: this.userName, email: this.userEmail, number: this.userNumber };

    this.http.post('https://jsonplaceholder.typicode.com/users', newUser).subscribe(
      (response) => {
        console.log('User added successfully:', response);
        this.userList.push(response); // Add to the list
        this.clearInputs(); // Clear input fields
      },
      (error) => {
        console.error('Error adding user:', error);
      }
    );
  }

  updateUser() {
    if (this.userId === null) {
      console.error('User ID is required for updating');
      return;
    }

    const updatedUser = { name: this.userName, email: this.userEmail, number: this.userNumber };

    this.http.put(`https://jsonplaceholder.typicode.com/users/${this.userId}`, updatedUser).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        
        // Update the user in userList array
        const index = this.userList.findIndex(user => user.id === this.userId);
        if (index !== -1) {
          this.userList[index] = { ...this.userList[index], ...updatedUser }; // Update existing user
        }
        
        this.clearInputs(); // Clear input fields
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }


  deleteUser() {
    if (this.userId == null) return;

    this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.userId}`).subscribe(
      () => {
        console.log('User deleted successfully');
        this.userList = this.userList.filter(user => user.id !== this.userId); // Update list
        this.userId = null; // Clear ID
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  clearInputs() {
    this.userName = '';
    this.userEmail = '';
    this.userNumber = '';
    this.userId = null;
  }
}
