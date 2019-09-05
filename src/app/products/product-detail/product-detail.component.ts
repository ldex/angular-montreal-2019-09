import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;
  product$: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    
    this.product$ =
                this
                  .productService
                  .products$
                  .pipe(
                    map(products => products.find(p => p.id == id))
                  );

  }

  deleteProduct(id: number) {
    if (window.confirm('Are you sure to delete this product ?')) {
      this.productService
          .deleteProduct(id)
          .subscribe(
              () => {
                  this.productService.loadProducts();
                  this.router.navigateByUrl("/products");
              },
              error => console.error('Could not delete product. ' + error)
          );
    }
  }

}
