import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { LoginRequest } from "../models/loginRequest.request";
import { tap } from "rxjs/operators";

@Injectable()
export class AuthService {
  private apiUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient, private router: Router) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem("userToken");
    return token !== null;
  }

  login(loginRequest: LoginRequest): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const url = `${this.apiUrl}/login`;

    return this.http.post<any>(url, loginRequest, { headers }).pipe(
      tap((response) => {
        let token = response.token || "fake-token-12345";
        localStorage.setItem("userToken", token);
        this.router.navigate(["home"]);
      })
    );
  }

  logout(): void {
    localStorage.removeItem("userToken");
    this.router.navigate(["login"]);
  }
}
