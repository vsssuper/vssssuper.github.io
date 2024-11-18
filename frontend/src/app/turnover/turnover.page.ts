import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-turnover',
  templateUrl: './turnover.page.html',
  styleUrls: ['./turnover.page.scss'],
})
export class TurnoverPage {
  outs: any[] = [];
  userAccess: string = "";
  isAdmin = false;
  isLoggedIn = true;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadOutData();
    this.authService.access$.subscribe((data) => {
      this.userAccess = data;
    });
    this.authService.sharedData$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (!this.isAdmin && this.userAccess == '') {
      this.isLoggedIn = false;
    }
    // if (!this.isAdmin && this.userAccess == '') {
    //   this.router.navigate(['/login']);
    // } else {
    //   this.loadOutData();
    // }
  }

  loadOutData() {
    this.http.get<any[]>('http://localhost:3000/api/outData').subscribe(
      (data) => {
        if (this.isAdmin) {
          this.outs = data;
        } else {
          this.outs = data.filter(data => data.access == this.userAccess);
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
        const outData = (jsonData as Array<any[]>).map(row => ({
          access      : row[0] || '',  // 1st column
          id          : row[1] || '',  // 2nd column
          new         : row[2] || '',  // 3rd column
          outDate     : row[3] || '',
          name        : row[4] || '',
          nickName    : row[5] || '',
          ic          : row[6] || '',
          phone       : row[7] || '',
          income      : row[8] || '',
          occupation  : row[9] || '',
          pic         : row[10] || '',
          divide      : row[11] || '',
          source      : row[12] || '',
          account     : row[13] || '',
          owe         : row[14] || '',
          take        : row[15] || '',
          ins         : row[16] || '',
          fees        : row[17] || '',
          open        : row[18] || '',
          deposit     : row[19] || '',
          pay         : row[20] || '',
          dueDate     : row[21] || '',
          dueTime     : row[22] || '',
          duration    : row[23] || '',
          keep        : row[24] || '',
          note        : row[25] || '',
        })).filter(o => o.access && o.id);  // Remove invalid entries

        this.uploadOutData(outData);
      };
      reader.readAsArrayBuffer(file);
    };
    fileInput.click(); // Open the file dialog
  }

  // Upload data to the backend
  uploadOutData(outs: any[]) {
    this.http.post('http://localhost:3000/api/import-outs', outs).subscribe(
      response => {
        console.log('Out Data imported successfully', response);
        this.loadOutData(); // Reload out data after import
      },
      error => {
        console.error('Error importing out data', error);
      }
    );
  }
}
