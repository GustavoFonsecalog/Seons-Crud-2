import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: any = { name: '', quantity: 0, category_id: null };
  categories: any[] = [];
  productId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id !== null ? +id : null;
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(product => {
        this.product = product;
      });
    }
  }

  saveProduct(): void {
    this.product.category_id = Number(this.product.category_id);

    if (this.productId) {
      this.productService.editProduct(this.productId, this.product).subscribe({
        next: () => {
          this.toastr.success('Produto atualizado com sucesso!', '', {
            toastClass: 'ngx-toastr custom-toast-success',
            positionClass: 'custom-toast-container'
          });
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toastr.error('Erro ao atualizar o produto!', '', {
            toastClass: 'ngx-toastr custom-toast-error',
            positionClass: 'custom-toast-container'
          });
        }
      });
    } else {
      this.productService.createProduct(this.product).subscribe({
        next: () => {
          this.toastr.success('Produto cadastrado com sucesso!', '', {
            toastClass: 'ngx-toastr custom-toast-success',
            positionClass: 'custom-toast-container'
          });
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toastr.error('Erro ao cadastrar o produto!', '', {
            toastClass: 'ngx-toastr custom-toast-error',
            positionClass: 'custom-toast-container'
          });
        }
      });
    }
  }


  goBack(): void {
    this.router.navigate(['/products']);
  }
}
