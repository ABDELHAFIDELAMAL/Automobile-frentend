import { inject, Service } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';


@Service()
export class AuthService {

  isAuthenticated: boolean = false ;
  AccessToken!: string ;
  private ApiUrl: string = 'http://localhost:8080/api/v1/auth';
  private readonly http = inject(HttpClient);
  email: any ;
  roles : any ;

  constructor() {
  }


  login(email: string, password: string) {
    const body = { email, password };
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post(`${this.ApiUrl}/login`, body, headers);
  }

  register(nom: string, prenom: string, email: string, password: string) {
    const body = { nom, prenom, email, password };
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post(`${this.ApiUrl}/register`, body, headers);
  }

  loadProfile(data: any) {
    this.isAuthenticated = true;
    this.AccessToken = data['Access-Token'];
    let decodedJwt : any = jwtDecode(this.AccessToken);
    this.email = decodedJwt.sub;
    this.roles = decodedJwt.roles;
  }

  loadJwtTokenFromLocalStorage(data: any) {

  }
}
