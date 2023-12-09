import { Routes } from '@angular/router';
import { ItemDetailsComponent } from './products/item-details/item-details.component';
import { ItemShellComponent } from './products/item-shell/item-shell.component';
import { ItemUpdateComponent } from './products/item-update/item-update.component';
import { CategoryListComponent } from './products/pages/category-list/category-list.component';
import { AddQuotationComponent } from './quotations/pages/add-quotation/add-quotation.component';
import { anonClientGuard } from './auth/guards/anon-client.guard';
import { loggedClientGuard } from './auth/guards/logged-client.guard';
import { QuotationDetailsComponent } from './quotations/pages/quotation-details/quotation-details.component';
import { ViewsShellComponent } from './core/layout/views-shell/views-shell.component';

// TODO: Defines guards to prevent an anon client to come in to private pages
export const APP_ROUTES: Routes = [
  {
    path: 'auth',
    // canActivate: [anonClientGuard],
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    component: ViewsShellComponent,
    // canActivate: [loggedClientGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AddQuotationComponent,
      },
      {
        path: 'quotations',
        loadChildren: () => import('./quotations/quotation.routes'),
      },
      { path: 'categories', component: CategoryListComponent },
      { path: 'products', component: ItemShellComponent },
      { path: 'products/edit/:id', component: ItemUpdateComponent },
      { path: 'products/:id', component: ItemDetailsComponent },
    ],
  },
  {
    path: 'print',
    children: [
      {
        path: 'quotation/:id',
        component: QuotationDetailsComponent,
      },
    ],
  },
];
