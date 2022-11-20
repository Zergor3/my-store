import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { switchMap, zip } from 'rxjs';
import { CreateProductDTO, Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products: Product[] = [];
  @Input() set productId(id: string | null) {
    if (id) {
      this.onShowDetail(Number(id));
    }
  }
  @Output() loadMore = new EventEmitter();
  today = new Date();
  date = new Date(2021, 1, 21);
  showProductDetail = false;
  productChosen: Product = {
    id: 0,
    title: '',
    price: 0,
    description: '',
    images: [],
    category: { id: 0, name: '', typeImg: '' },
  };
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: number) {
    this.statusDetail = 'loading';
    if (!this.showProductDetail) {
      this.showProductDetail = true;
    }
    this.productsService.getOne(id).subscribe(
      (data) => {
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      (errorMsg) => {
        alert(errorMsg);
        this.statusDetail = 'error';
      }
    );
  }

  readAndUpdate(id: number) {
    this.productsService
      .getOne(id)
      .pipe(
        switchMap((product) =>
          this.productsService.update(product.id, { title: 'change' })
        )
      )
      .subscribe((data) => {
        console.log(data);
      });
    this.productsService
      .fetchReadAndUpdate(id, { title: 'change' })
      .subscribe((response) => {
        const read = response[0];
        const update = response[1];
      });
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'bla bla bla',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId: 2,
    };
    this.productsService.create(product).subscribe((data) => {
      console.log('created', data);
      this.products.unshift(data);
    });
  }

  updateProduct() {
    const changes = {
      title: 'Nuevo titulo',
    };
    const id = this.productChosen.id;
    this.productsService.update(id, changes).subscribe((data) => {
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products[productIndex] = data;
    });
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.delete(id).subscribe(() => {
      const productIndex = this.products.findIndex(
        (item) => item.id === this.productChosen.id
      );
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
