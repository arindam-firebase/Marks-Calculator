import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SubjectMark {
  id: number;
  marks: number | null;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-calculator',
  styleUrl: './calculator.scss',
  templateUrl: './calculator.html',
})
export class Calculator {
  subjects: SubjectMark[] = [
    { id: 1, marks: null },
    { id: 2, marks: null },
    { id: 3, marks: null },
  ];
  totalMarks: number | null = null;
  maximumMarks: number | null = null;
  percentage: string | null = null;
  resultStatus: 'Pass' | 'Fail' | null = null;
  grade: string | null = null;
  highestMark: number | null = null;
  lowestMark: number | null = null;
  errorMessage = '';

  private nextSubjectId = 4;

  addSubject(): void {
    this.subjects.push({ id: this.nextSubjectId, marks: null });
    this.nextSubjectId += 1;
    this.clearResults();
  }

  removeSubject(id: number): void {
    if (this.subjects.length <= 1) {
      return;
    }

    this.subjects = this.subjects.filter((subject) => subject.id !== id);
    this.clearResults();
  }

  trackSubject(_index: number, subject: SubjectMark): number {
    return subject.id;
  }

  calculateResult(): void {
    const marks = this.subjects.map((subject) => this.toMark(subject.marks));

    if (marks.some((mark) => mark === null)) {
      this.errorMessage = 'All subject mark fields must be filled out.';
      this.clearResults();
      return;
    }

    const validMarks = marks as number[];
    if (validMarks.some((mark) => mark < 0 || mark > 100)) {
      this.errorMessage = 'Each subject mark must be between 0 and 100.';
      this.clearResults();
      return;
    }

    this.errorMessage = '';
    const total = validMarks.reduce((sum, mark) => sum + mark, 0);
    this.totalMarks = total;
    this.maximumMarks = validMarks.length * 100;
    this.percentage = ((total / this.maximumMarks) * 100).toFixed(2);
    this.highestMark = Math.max(...validMarks);
    this.lowestMark = Math.min(...validMarks);

    if (validMarks.some((mark) => mark < 40)) {
      this.resultStatus = 'Fail';
      this.grade = '-';
      return;
    }

    this.resultStatus = 'Pass';
    const percentageValue = Number(this.percentage);
    if (percentageValue >= 80) {
      this.grade = 'A';
    } else if (percentageValue >= 60) {
      this.grade = 'B';
    } else {
      this.grade = 'C';
    }
  }

  resetCalculator(): void {
    this.subjects = [
      { id: 1, marks: null },
      { id: 2, marks: null },
      { id: 3, marks: null },
    ];
    this.nextSubjectId = 4;
    this.errorMessage = '';
    this.clearResults();
  }

  private toMark(value: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const mark = Number(value);
    return Number.isFinite(mark) ? mark : null;
  }

  private clearResults(): void {
    this.totalMarks = null;
    this.maximumMarks = null;
    this.percentage = null;
    this.resultStatus = null;
    this.grade = null;
    this.highestMark = null;
    this.lowestMark = null;
  }
}
