import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.scss']
})
export class AddPropertyComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = false;

  propertyTypes = ['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL'];
  propertyStatuses = ['FOR_SALE', 'FOR_RENT'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      surface: ['', [Validators.required, Validators.min(1)]],
      rooms: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      district: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      propertyType: ['APARTMENT', Validators.required],
      status: ['FOR_SALE', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.http.post(`${environment.apiUrl}/properties`, this.form.value).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/properties']), 1500);
      },
      error: () => {
        this.error = 'Failed to add property. Please try again.';
        this.loading = false;
      }
    });
  }
}