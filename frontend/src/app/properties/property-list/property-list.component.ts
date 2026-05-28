import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  properties: any[] = [];
  filtered: any[] = [];
  loading = true;
  search = '';
  selectedType = '';
  selectedStatus = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/properties`).subscribe({
      next: (data) => {
        this.properties = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters() {
    this.filtered = this.properties.filter(p => {
      const matchSearch = !this.search ||
        p.title?.toLowerCase().includes(this.search.toLowerCase()) ||
        p.location?.toLowerCase().includes(this.search.toLowerCase());
      const matchType = !this.selectedType || p.propertyType === this.selectedType;
      const matchStatus = !this.selectedStatus || p.status === this.selectedStatus;
      return matchSearch && matchType && matchStatus;
    });
  }

  onSearch(event: any) {
    this.search = event.target.value;
    this.applyFilters();
  }

  onTypeChange(event: any) {
    this.selectedType = event.target.value;
    this.applyFilters();
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.applyFilters();
  }

  goToDetail(id: number) {
    this.router.navigate(['/properties', id]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace('_', '-');
  }
}