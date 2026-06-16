import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-market-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-analytics.component.html',
  styleUrls: ['./market-analytics.component.scss']
})
export class MarketAnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('priceChart') priceChartRef!: ElementRef;
  @ViewChild('typeChart') typeChartRef!: ElementRef;
  @ViewChild('districtChart') districtChartRef!: ElementRef;

  properties: any[] = [];
  loading = true;

  stats = {
    avgPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    avgSurface: 0,
    totalListings: 0,
    pricePerM2: 0
  };

  topDistricts: { name: string, count: number, avgPrice: number }[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/properties`).subscribe({
      next: (data) => {
        this.properties = data;
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {}

  calculateStats() {
    if (this.properties.length === 0) return;

    const prices = this.properties.map(p => p.price).filter(p => p);
    const surfaces = this.properties.map(p => p.surface).filter(s => s);

    this.stats.avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    this.stats.minPrice = Math.min(...prices);
    this.stats.maxPrice = Math.max(...prices);
    this.stats.avgSurface = surfaces.reduce((a, b) => a + b, 0) / surfaces.length;
    this.stats.totalListings = this.properties.length;
    this.stats.pricePerM2 = this.stats.avgPrice / this.stats.avgSurface;

    const districtMap = new Map<string, { count: number, totalPrice: number }>();
    this.properties.forEach(p => {
      const d = p.district || 'Unknown';
      if (!districtMap.has(d)) districtMap.set(d, { count: 0, totalPrice: 0 });
      const entry = districtMap.get(d)!;
      entry.count++;
      entry.totalPrice += p.price;
    });

    this.topDistricts = Array.from(districtMap.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgPrice: data.totalPrice / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  renderCharts() {
    this.renderPriceChart();
    this.renderTypeChart();
    this.renderDistrictChart();
  }

  renderPriceChart() {
    if (!this.priceChartRef) return;
    const ranges = [
      { label: '0-100K', min: 0, max: 100000 },
      { label: '100K-250K', min: 100000, max: 250000 },
      { label: '250K-500K', min: 250000, max: 500000 },
      { label: '500K-1M', min: 500000, max: 1000000 },
      { label: '1M+', min: 1000000, max: Infinity }
    ];

    const data = ranges.map(r =>
      this.properties.filter(p => p.price >= r.min && p.price < r.max).length
    );

    new Chart(this.priceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ranges.map(r => r.label),
        datasets: [{
          label: 'Properties',
          data,
          backgroundColor: '#1a2942',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    });
  }

  renderTypeChart() {
    if (!this.typeChartRef) return;
    const types = ['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL'];
    const data = types.map(t => this.properties.filter(p => p.propertyType === t).length);

    new Chart(this.typeChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: types,
        datasets: [{
          data,
          backgroundColor: ['#1a2942', '#c9a84c', '#2e7d32', '#1565c0']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
      }
    });
  }

  renderDistrictChart() {
    if (!this.districtChartRef) return;

    new Chart(this.districtChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.topDistricts.map(d => d.name),
        datasets: [{
          label: 'Avg Price (DT)',
          data: this.topDistricts.map(d => Math.round(d.avgPrice)),
          backgroundColor: '#c9a84c',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }
}