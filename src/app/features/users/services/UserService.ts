import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../entities/User';
import { ApiResponce } from '../../../entities/ApiResponce';
import { environment } from '../../../environment/environment';
import { Role } from '../../../enums/Role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/api/v1/users`;

  getAllUsers(): Observable<ApiResponce<User[]>> {
    return this.http.get<ApiResponce<User[]>>(`${this.apiUrl}`);
  }

  getUserById(id: number): Observable<ApiResponce<User>> {
    return this.http.get<ApiResponce<User>>(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<ApiResponce<User>> {
    const params = new HttpParams().set('username', username);
    return this.http.get<ApiResponce<User>>(`${this.apiUrl}/username`, { params });
  }

  createUser(user: User): Observable<ApiResponce<User>> {
    return this.http.post<ApiResponce<User>>(`${this.apiUrl}/add`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<ApiResponce<User>> {
    return this.http.put<ApiResponce<User>>(`${this.apiUrl}/update/${id}`, user);
  }

  deleteUser(id: number): Observable<ApiResponce<void>> {
    return this.http.delete<ApiResponce<void>>(`${this.apiUrl}/delete/${id}`);
  }

  activate(id: number): Observable<ApiResponce<User>> {
    return this.http.patch<ApiResponce<User>>(`${this.apiUrl}/activate/${id}`, null);
  }

  deactivate(id: number): Observable<ApiResponce<User>> {
    return this.http.patch<ApiResponce<User>>(`${this.apiUrl}/deactivate/${id}`, null);
  }

  changePassword(
    id: number,
    oldPassword: string,
    newPassword: string,
  ): Observable<ApiResponce<User>> {
    const params = new HttpParams().set('oldPassword', oldPassword).set('newPassword', newPassword);
    return this.http.patch<ApiResponce<User>>(`${this.apiUrl}/change/${id}`, null, { params });
  }

  assignRole(id: number, role: Role): Observable<ApiResponce<void>> {
    return this.http.put<ApiResponce<void>>(
      `${this.apiUrl}/assign-role/${id}`,
      JSON.stringify(role),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
