import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CapitalizePipe } from './modules/pipes/capitalize.pipe';
import { ValidateUrlDirective } from './modules/directives/validate-url.directive';
import { AuthGuard } from './modules/auth/auth.guard';
import { LoginComponent } from './components/login/login/login.component';
import { AuthService } from './services/auth.service';
import { RecentlyVisitedComponent } from './components/recently-visited/recently-visited/recently-visited.component';
import { DragAndDropModule, DraggableHelper } from 'angular-draggable-droppable';
import { ManagementApplicationServices } from './services/managementApplication.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] }, 
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' }  
];


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    CapitalizePipe,
    ValidateUrlDirective,
    LoginComponent,
    RecentlyVisitedComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DragAndDropModule
  
  ],
  providers: [AuthGuard,AuthService,DraggableHelper,ManagementApplicationServices,AuthService],
  bootstrap: [AppComponent],
})
export class AppModule { }
