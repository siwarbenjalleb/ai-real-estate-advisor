import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  properties: any[] = [];
  loading = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const savedIds: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (savedIds.length === 0) {
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/properties`).subscribe({
      next: (data) => {
        this.properties = data.filter(p => savedIds.includes(p.id));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removeFromFavorites(id: number, event: Event) {
    event.stopPropagation();
    const savedIds: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = savedIds.filter(fId => fId !== id);
    localStorage.setItem('favorites', JSON.stringify(updated));
    this.properties = this.properties.filter(p => p.id !== id);
    this.cdr.detectChanges();
  }

  goToProperty(id: number) {
    this.router.navigate(['/properties', id]);
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase().replace('_', '-');
  }
}