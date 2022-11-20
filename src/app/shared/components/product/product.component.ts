import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Output() addedProduct = new EventEmitter<Product>()
  @Output() showProduct = new EventEmitter<number>()
  @Input() product: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    images: [],
    category: { id: 0, name: '', typeImg: '' }
  }

  constructor() { }

  addToCart() {
    this.addedProduct.emit(this.product);
  }

  onShowDetail(){
    this.showProduct.emit(this.product.id);
  }
}
