import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './authentication/auth-guard.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { InvoiceDetailComponent } from './invoices/invoice-detail/invoice-detail.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ProductsComponent } from './products/products.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path:'',pathMatch: 'full' ,redirectTo:'login'},
  {path:'login', component: AuthenticationComponent},
  {path:'invoices', component: InvoicesComponent, canActivate: [AuthGuardService]},
  {path:'new-invoice', component: InvoiceDetailComponent, canActivate: [AuthGuardService]},
  {path:'products', component: ProductsComponent, canActivate: [AuthGuardService]},
  {path:'users', component: UsersComponent, canActivate: [AuthGuardService]},
  {path:'roles', component: RolesComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
