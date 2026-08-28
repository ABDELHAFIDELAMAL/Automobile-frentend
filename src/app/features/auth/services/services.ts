import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  login() {}
}
