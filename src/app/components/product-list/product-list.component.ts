import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });

    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Desconhecida';
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.toastr.success('Produto deletado com sucesso!', '', {
          toastClass: 'ngx-toastr custom-toast-success',
          positionClass: 'custom-toast-container'
        });
      },
      error: () => {
        this.toastr.error('Erro ao deletar o produto!', '', {
          toastClass: 'ngx-toastr custom-toast-error',
          positionClass: 'custom-toast-container'
        });
      }
    });
  }

  editProduct(id: number): void {
    this.router.navigate([`/products/edit/${id}`]);
  }

  goBack(): void {
    this.router.navigate([`/`]);
  }
}
