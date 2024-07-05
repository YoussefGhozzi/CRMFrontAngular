import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnipileService {

  private apiUrl = 'https://api2.unipile.com:13237';
  private apiKey = 'bQW7auVm.ny4F+3UGY3WkipGqOx3AEWjSOxS8JGuCDAI2r2oD+08='
  private ACCOUNT_ID = 's1n0MG0sRSuWj5eBcHJKEQ';

  constructor(private http: HttpClient) { }

  sendEmail(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'X-API-KEY': this.apiKey
    });

   
    return this.http.post<any>(this.apiUrl, formData, { headers });
}

getAllEmails(): Observable<any> {
  const headers = new HttpHeaders({
    'X-API-KEY': this.apiKey
  });

  const params = {
    account_id: this.ACCOUNT_ID,
    filter: JSON.stringify({ role: ['inbox', 'sent'] })
  };
  console.log('Headers:', headers);
    console.log('Params:', params);
  return this.http.get<any>(`${this.apiUrl}/api/v1/emails`, { headers, params });
}
}