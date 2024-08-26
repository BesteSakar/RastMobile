import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Observable } from "rxjs";
import { LoginRequest } from "../models/loginRequest.request";

@Injectable()
export class ManagementApplicationServices {
  formDataLinks: any;
  private apiUrl = "http://localhost:5000/api/links";

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    const url = `${this.apiUrl}/login`;
    return this.http.post<any>(url, loginRequest, { headers });
  }

  getLinks(): Observable<any> {
    this.formDataLinks = null;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap((response) => {
        this.formDataLinks = response;
      }),
      map((response) => response),
      catchError((error) => {
        console.error("API request error:", error);
        return of(`API request failed: ${error.message}`);
      })
    );
  }

  addLink(link: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<any>(this.apiUrl, link, { headers });
  }

  updateLink(id: number, link: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.put<any>(`${this.apiUrl}/${id}`, link, { headers });
  }

  deleteLink(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
