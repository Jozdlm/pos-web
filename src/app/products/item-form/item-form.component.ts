import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent {
  private _productService = inject(ProductService);
  private _formBuilder = inject(FormBuilder);

  public categories$ = this._productService.getCategories();

  public itemForm = this._formBuilder.group({
    barcode: [''],
    product_name: ['', Validators.required],
    category_id: [0, [Validators.required, Validators.min(1)]],
    min_stock: [0, [Validators.required, Validators.min(0)]],
    selling_price: [0, [Validators.required, Validators.min(0)]],
  });

  public handleSubmit() {
    if (this.itemForm.valid) {
      const newProduct = {
        ...this.itemForm.value,
        category_id: parseInt(`${this.itemForm.value.category_id}`),
        img_url: '',
        active: true,
        barcode: this.itemForm.value.barcode!,
        product_name: this.itemForm.value.product_name!,
        min_stock: this.itemForm.value.min_stock!,
        selling_price: this.itemForm.value.selling_price!,
      };

      this._productService.createProduct(newProduct).subscribe({
        next: (value) => console.log(value),
      });
      this.itemForm.reset({ category_id: 0 });
    }
  }
}
