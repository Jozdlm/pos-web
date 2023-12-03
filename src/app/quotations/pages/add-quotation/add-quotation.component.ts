import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { SchoolGradeService } from '../../services/school-grade.service';
import { SchoolGrade } from '../../models/school-grades';
import { QuotationStateService } from '../../services/quotation-state.service';
import { Product } from '@app/quotations/models/product';
import { QuotationItem } from '@app/quotations/models/quotation-item';
import { QuotationService } from '@app/quotations/services/quotation.service';
import { ProductMapper } from '@app/catalog/mappers/product.mapper';
import { DbTables } from '@app/core/enums/db-tables';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './add-quotation.component.html',
  styleUrl: './add-quotation.component.scss',
})
export class AddQuotationComponent {
  private readonly _supabaseService = inject(SupabaseService);
  private readonly _schoolGradeService = inject(SchoolGradeService);
  private readonly _quotationState = inject(QuotationStateService);
  private readonly _quotationService = inject(QuotationService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _supabase = this._supabaseService.supabase;
  private _subscriptions = new Subscription();
  public searchControl = new FormControl('');
  public filteredProducts: Product[] = [];
  public schoolGrades: SchoolGrade[] = [];
  public quotationItems$ = this._quotationState.items$;
  public totalAmmount$ = this._quotationState.ammount$;

  public quotationInfo = this._formBuilder.nonNullable.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    studentName: ['', [Validators.required, Validators.minLength(3)]],
    date: [this.getCurrentDate(), Validators.required],
    schoolGrade: ['', [Validators.required, Validators.min(1)]],
    schoolName: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    this.subscribeToSearchChanges();
    this.getSchoolGrades();
    inject(DestroyRef).onDestroy(() => {
      this._subscriptions.unsubscribe();
      this._quotationState.clearQuotationState();
    });
  }

  private getCurrentDate(): string {
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
    const year = currentDate.getFullYear().toString();

    return `${year}-${month}-${day}`;
  }

  private subscribeToSearchChanges(): void {
    this._subscriptions.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe(async (value) => {
          if (value) {
            const products = await this.searchProduct(value);
            this.filteredProducts = products;
          }
        }),
    );
  }

  private async getSchoolGrades(): Promise<void> {
    try {
      const grades = await this._schoolGradeService.getSchoolGrades();
      this.schoolGrades = grades;
    } catch (err) {
      console.error(err);
    }
  }

  public async searchProduct(query: string): Promise<Product[]> {
    const querySanitized = query.toLowerCase().trim();
    let { data: products, error } = await this._supabase
      .from(DbTables.PRODUCTS)
      .select('*')
      .ilike('name', `%${querySanitized}%`)
      .range(0, 7);

    return products?.map((item) => ProductMapper.toEntity(item)) || [];
  }

  public addItemToQuotation(item: Product): void {
    const quotationItem: QuotationItem = {
      productId: item.id,
      description: item.name,
      quantity: 1,
      price: item.sellingPrice,
      ammount: item.sellingPrice,
    };

    this._quotationState.addItem(quotationItem);
  }

  public removeItemOfQuotation(itemId: number): void {
    this._quotationState.removeItem(itemId);
  }

  public increaseQuantity(itemId: number): void {
    this._quotationState.increaseQuantity(itemId);
  }

  public decreaseQuantity(itemId: number): void {
    this._quotationState.decreaseQuantity(itemId);
  }

  public clearSearchControl(): void {
    this.searchControl.reset();
    this.filteredProducts = [];
  }

  public createQuotation(): void {
    const quotationHeader = this.quotationInfo.getRawValue();
    const quotationSnapshot = this._quotationState.getStateSnapshot();

    this._quotationService.createQuotation({
      ...quotationHeader,
      schoolGrade: parseInt(quotationHeader.schoolGrade),
      items: quotationSnapshot.items,
      totalAmmount: quotationSnapshot.totalAmmount,
    });
  }
}
