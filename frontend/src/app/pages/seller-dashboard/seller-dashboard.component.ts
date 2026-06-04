import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {
  firstName = localStorage.getItem('firstName') || 'User';
  myProperties: any[] = [];
  loading = true;

  stats = {
    total: 0,
    forSale: 0,
    forRent: 0,
    sold: 0
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/properties/my-properties`).subscribe({
      next: (data) => {
        this.myProperties = data;
        this.stats.total = data.length;
        this.stats.forSale = data.filter(p => p.status === 'FOR_SALE').length;
        this.stats.forRent = data.filter(p => p.status === 'FOR_RENT').length;
        this.stats.sold = data.filter(p => p.status === 'SOLD').length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToProperty(id: number) {
    this.router.navigate(['/properties', id]);
  }

  deleteProperty(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this property?')) {
      this.http.delete(`${environment.apiUrl}/properties/${id}`).subscribe({
        next: () => {
          this.myProperties = this.myProperties.filter(p => p.id !== id);
          this.stats.total--;
          this.cdr.detectChanges();
        }
      });
    }
  }

  editProperty(id: number, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/edit-property', id]);
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace('_', '-');
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}