import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.scss']
})
export class BuyerDashboardComponent implements OnInit {
  firstName = localStorage.getItem('firstName') || 'User';
  recentProperties: any[] = [];
  favorites: any[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  loading = true;

  stats = {
    saved: 0,
    viewed: parseInt(localStorage.getItem('viewedCount') || '0'),
    predictions: parseInt(localStorage.getItem('predictionsCount') || '0'),
    matches: 0
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

 ngOnInit() {
  const savedIds: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');
  this.stats.saved = savedIds.length;

  this.http.get<any[]>(`${environment.apiUrl}/properties`).subscribe({
    next: (data) => {
      this.recentProperties = data.slice(0, 5);
      this.stats.matches = data.length;
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