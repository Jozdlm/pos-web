import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '@app/catalog/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '@app/catalog/services/product.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _productService = inject(ProductService);
  public readonly categories$ = inject(CategoryService).getCategories();
  public productId: number | null = null;

  public productForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    barcode: [''],
    sellingPrice: [0, [Validators.required, Validators.min(0.01)]],
    categoryId: [0, [Validators.required, Validators.min(1)]],
    inStock: [true, Validators.required],
    isActive: [true, Validators.required],
  });

  constructor() {
    this._activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (id) {
            this.productId = parseInt(id);
            return this._productService.getProductById(this.productId);
          }

          return of(null);
        }),
      )
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  // TODO: Create a method that allows to create a product
  public onSubmitForm(): void {
    console.log('submitted');
  }

  // TODO: Create a method that cancel the operation and reset values
  public resetAndReturn(): void {
    this._router.navigateByUrl('products');
  }
}
