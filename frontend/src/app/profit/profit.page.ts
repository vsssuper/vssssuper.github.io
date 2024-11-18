import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profit',
  templateUrl: './profit.page.html',
  styleUrls: ['./profit.page.scss'],
})
export class ProfitPage {
  ins: any[] = [];
  userAccess: string = "";
  isAdmin = false;
  isLoggedIn = true;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadInData();
    this.authService.access$.subscribe((data) => {
      this.userAccess = data;
    });
    this.authService.sharedData$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (!this.isAdmin && this.userAccess == '') {
      this.isLoggedIn = false;
    }
  }

  loadInData() {
    this.http.get<any[]>('http://localhost:3000/api/inData').subscribe(
      (data) => {
        if (this.isAdmin) {
          this.ins = data;
        } else {
          this.ins = data.filter(data => data.access == this.userAccess);
        }
      },
      (error) => {
        console.error('Error fetching customer data', error);
      }
    );
  }

  // Handle importing an Excel file
  importExcel() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        jsonData.shift(); // remove first row

        // Prepare data for API request
        const inData = (jsonData as Array<any[]>).map(row => ({
          access      : row[0] || '',  // 1st column
          id          : row[26] || '',  // 2nd column
          inDate      : row[27] || '',
          name        : row[4] || '',
          ins         : row[28] || '',
          payment     : row[29] || '',
          fees        : row[30] || '',
          income      : row[31] || '',
          receive     : row[32] || '',
          kanzhang    : row[33] || '',
          clear       : row[34] || '',
          total       : row[35] || '',
          account     : row[36] || '',
          next        : row[37] || '',
          note        : row[38] || '',
        })).filter(i => i.access && i.id);  // Remove invalid entries

        this.uploadInData(inData);
      };
      reader.readAsArrayBuffer(file);
    };
    fileInput.click(); // Open the file dialog
  }

  // Upload data to the backend
  uploadInData(ins: any[]) {
    this.http.post('http://localhost:3000/api/import-ins', ins).subscribe(
      response => {
        console.log('In Data imported successfully', response);
        this.loadInData(); // Reload in data after import
      },
      error => {
        console.error('Error importing in data', error);
      }
    );
  }
}
