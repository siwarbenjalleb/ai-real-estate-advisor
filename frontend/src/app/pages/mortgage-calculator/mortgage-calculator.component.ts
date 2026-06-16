import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mortgage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mortgage-calculator.component.html',
  styleUrls: ['./mortgage-calculator.component.scss']
})
export class MortgageCalculatorComponent {
  propertyPrice = 250000;
  downPayment = 50000;
  interestRate = 7.5;
  loanTermYears = 20;

  get loanAmount(): number {
    return this.propertyPrice - this.downPayment;
  }

  get downPaymentPercent(): number {
    return Math.round((this.downPayment / this.propertyPrice) * 100);
  }

  get monthlyPayment(): number {
    const principal = this.loanAmount;
    const monthlyRate = this.interestRate / 100 / 12;
    const numPayments = this.loanTermYears * 12;
    if (monthlyRate === 0) return principal / numPayments;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))
      / (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  get totalPayment(): number {
    return this.monthlyPayment * this.loanTermYears * 12;
  }

  get totalInterest(): number {
    return this.totalPayment - this.loanAmount;
  }

  get principalPercent(): number {
    return Math.round((this.loanAmount / this.totalPayment) * 100);
  }

  get interestPercent(): number {
    return 100 - this.principalPercent;
  }

  getYearlySchedule() {
    const schedule = [];
    let balance = this.loanAmount;
    const monthlyRate = this.interestRate / 100 / 12;

    for (let year = 1; year <= Math.min(this.loanTermYears, 10); year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 0; month < 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = this.monthlyPayment - interestPayment;
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }

      schedule.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.max(0, Math.round(balance))
      });
    }
    return schedule;
  }
}