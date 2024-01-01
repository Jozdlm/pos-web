import { Injectable } from '@angular/core';
import { QuotationItem } from '../models/quotation-item';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotationStateService {
  private _items: QuotationItem[] = [];
  private _ammountEmitter = new BehaviorSubject<number>(0);
  private _stateEmitter = new BehaviorSubject<QuotationItem[]>([]);
  private _discountEmitter = new BehaviorSubject<number>(0);
  private _subtotalEmitter = new BehaviorSubject<number>(0);
  private _quoteWithDiscount: boolean = false;
  public readonly items$ = this._stateEmitter.asObservable();
  public readonly subtotal$ = this._subtotalEmitter.asObservable();
  public readonly discount$ = this._discountEmitter.asObservable();
  public readonly ammount$ = this._ammountEmitter.asObservable().pipe(
    map((value) => {
      if (this._quoteWithDiscount) {
        const discount = value * 0.1;
        this._subtotalEmitter.next(value);
        this._discountEmitter.next(discount);
        return value - discount;
      }

      this._subtotalEmitter.next(value);
      this._discountEmitter.next(0);
      return value;
    }),
  );

  constructor() {}

  private getTotalAmmount(): number {
    const ammount: number = this._items.reduce(
      (prev, curr) => prev * 1 + curr.ammount,
      0.0,
    );

    return ammount;
  }

  private emmitStateChanges(): void {
    this._stateEmitter.next(this._items);
    this._ammountEmitter.next(this.getTotalAmmount());
  }

  private calculateInitialValues(item: QuotationItem): QuotationItem {
    if (this._quoteWithDiscount) {
      item.discount = item.price * 0.1;
      item.ammount = item.price - item.discount;
    }

    return { ...item };
  }

  public addDiscount(): void {
    this._quoteWithDiscount = true;
    this.emmitStateChanges();
  }

  public removeDiscount(): void {
    this._quoteWithDiscount = false;
    this.emmitStateChanges();
  }

  public getStateSnapshot(): { items: QuotationItem[]; totalAmmount: number } {
    return {
      items: this._items,
      totalAmmount: this.getTotalAmmount(),
    };
  }

  private mutateItem(type: '+Qty' | '-Qty', itemIndex: number): void {
    const item = this._items[itemIndex];
    let updatedQty: number = item.quantity;

    if (type === '-Qty') {
      updatedQty = item.quantity > 1 ? item.quantity - 1 : 1;
    } else if (type === '+Qty') {
      updatedQty = item.quantity + 1;
    }

    this._items[itemIndex] = {
      ...item,
      quantity: updatedQty,
      ammount: updatedQty * item.price,
    };
  }

  public addItem(newItem: QuotationItem): void {
    const inArray = this._items.find(
      (item) => item.productId == newItem.productId,
    );

    newItem = this.calculateInitialValues(newItem);

    if (inArray) {
      this.increaseQuantity(newItem.productId);
    } else {
      this._items = [...this._items, newItem];
      this.emmitStateChanges();
    }
  }

  public removeItem(itemId: number): void {
    this._items = [...this._items.filter((item) => item.productId != itemId)];
    this.emmitStateChanges();
  }

  public increaseQuantity(itemId: number): void {
    const itemIndex = this._items.findIndex(
      (item) => item.productId === itemId,
    );

    if (itemIndex !== -1) {
      this.mutateItem('+Qty', itemIndex);
      this.emmitStateChanges();
    }
  }

  public decreaseQuantity(itemId: number): void {
    const itemIndex = this._items.findIndex(
      (item) => item.productId === itemId,
    );

    if (itemIndex !== -1) {
      this.mutateItem('-Qty', itemIndex);
      this.emmitStateChanges();
    }
  }

  public updateSellingPrice(itemId: number, newPrice: number): void {
    if (newPrice < 0.01) return;

    const itemIndex = this._items.findIndex(
      (item) => item.productId === itemId,
    );

    if (itemIndex !== -1) {
      const item = this._items[itemIndex];

      this._items[itemIndex] = {
        ...item,
        price: newPrice,
        ammount: newPrice * item.quantity,
      };

      this.emmitStateChanges();
    }
  }

  public clearQuotationState(): void {
    this._items = [];
    this.emmitStateChanges();
  }
}
