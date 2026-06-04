import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  userRole = localStorage.getItem('role') || 'BUYER';
  firstName = localStorage.getItem('firstName') || 'User';
  lastName = localStorage.getItem('lastName') || '';
  email = localStorage.getItem('email') || '';

  get initials(): string {
    return (this.firstName[0] + (this.lastName[0] || '')).toUpperCase();
  }

  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}