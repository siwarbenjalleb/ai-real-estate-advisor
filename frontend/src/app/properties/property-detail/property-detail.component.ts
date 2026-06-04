import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  property: any = null;
  prediction: any = null;
  loadingProperty = true;
  loadingPrediction = false;
  error = '';
  isFavorite = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Loading property id:', id);

    this.http.get(`${environment.apiUrl}/properties/${id}`).subscribe({
      next: (data) => {
        this.property = data;
        this.loadingProperty = false;
        this.checkFavorite();
        this.cdr.detectChanges();
        console.log('Property loaded:', this.property);
      },
      error: (err) => {
        console.error('Error loading property:', err);
        this.error = 'Property not found';
        this.loadingProperty = false;
        this.cdr.detectChanges();
      }
    });
  }

  checkFavorite() {
    const id = this.route.snapshot.paramMap.get('id');
    const savedIds: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.isFavorite = savedIds.includes(Number(id));
  }

  toggleFavorite() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const savedIds: number[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (this.isFavorite) {
      const updated = savedIds.filter(fId => fId !== id);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } else {
      savedIds.push(id);
      localStorage.setItem('favorites', JSON.stringify(savedIds));
    }
    this.isFavorite = !this.isFavorite;
    this.cdr.detectChanges();
  }

  getPrediction() {
    this.loadingPrediction = true;
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(`${environment.apiUrl}/predictions/${id}`).subscribe({
      next: (data) => {
        this.prediction = data;
        this.loadingPrediction = false;
        this.cdr.detectChanges();
        console.log('Prediction:', this.prediction);
      },
      error: (err) => {
        console.error('Prediction error:', err);
        this.loadingPrediction = false;
        this.cdr.detectChanges();
      }
    });
  }

  getRiskColor(risk: string): string {
    switch (risk?.toLowerCase()) {
      case 'low': return 'risk-low';
      case 'medium': return 'risk-medium';
      case 'high': return 'risk-high';
      default: return '';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 70) return '#2e7d32';
    if (score >= 40) return '#f57c00';
    return '#c62828';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}