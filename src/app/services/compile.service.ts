import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CompileRequest, response } from '../interface/compile.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompileService {
  constructor(private httpClient: HttpClient) {}
  compileCode(code: string): Observable<response<string>> {
    const body: CompileRequest = {
      code,
    };
    return this.httpClient.post<response<string>>(
      `${environment.api}/compile`,
      body
    );
  }
}
