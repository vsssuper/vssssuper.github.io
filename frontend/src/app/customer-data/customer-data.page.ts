import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

import { AuthService } from '../auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.page.html',
  styleUrls: ['./customer-data.page.scss'],
})
export class CustomerDataPage {
  customersData: any[] = [];
  userAccess: string = "";
  isAdmin = false;
  isLoggedIn = true;
  customer: {
    name: string;
    photo: {
      fileName: string;filePath: string
    } | null;
    video: {
      fileName: string;filePath: string
    } | null;
    pdf: {
      fileName: string;filePath: string
    } | null;
    word: {
      fileName: string;filePath: string
    } | null;
    access: string;
  } = {
    name: '',
    photo: null,
    video: null,
    pdf: null,
    word: null,
    access: ''
  };

  constructor(private http: HttpClient, private authService: AuthService, private alertController: AlertController) {}

  ngOnInit() {
    this.authService.access$.subscribe((data) => {
      this.userAccess = data;
    });
    this.authService.sharedData$.subscribe((data) => {
      this.isAdmin = data;
    });
    if (!this.isAdmin && this.userAccess == '') {
      this.isLoggedIn = false;
    }
    this.displayData();
  }
  
  chooseFile(type: 'photo' | 'video' | 'pdf' | 'word', event: any) {
    const selectedFile = event.target.files[0]; // Get the selected file from the input

    if (selectedFile) {
      const fileName = selectedFile.name;
      // const filePath = URL.createObjectURL(selectedFile); // Create a temporary URL for preview
      const filePath = selectedFile; // for testing purpose
  
      // Save the file details into the customer object
      this.customer[type] = {
        fileName,
        filePath,
      };
    }
  }
  
  // Submit form data to the backend
  submitForm() {
    const formData = new FormData();
    formData.append('name', this.customer.name || '');
    formData.append('photo', this.customer.photo ?.filePath || ''); // if photo is null, it returns ''
    formData.append('video', this.customer.video ?.filePath || '');
    formData.append('pdf', this.customer.pdf ?.filePath || '');
    formData.append('word', this.customer.word ?.filePath || '');
    formData.append('access', this.isAdmin ? 'admin' : this.userAccess);

    this.http.post('http://localhost:3000/api/insertcustomer', formData).subscribe(response => {
      console.log('Data submitted successfully', response);
      this.authService.prompt('提交成功');
      this.clear();
      this.displayData();
    }, error => {
      console.error('Error submitting data', error);
      this.authService.prompt('提交失败');
    });
  }

  displayData() {
    this.http.get < any[] > ('http://localhost:3000/api/customers-data')
      .subscribe(
        (data) => {
          if (this.isAdmin) {
            this.customersData = data;
          } else {
            this.customersData = data.filter(data => data.access == this.userAccess);
          }
          console.log(this.customersData);
          this.customersData.forEach(customer => {
              // customer.photo = 'http://localhost:3000/' + customer.photo;
            });
        },
        (error) => {
          console.error('Error fetching customer data:', error);
        }
      );
  }

  async confirmDelete(customerId: string) {
    const alert = await this.alertController.create({
      message: '确认要删除吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.deleteCustomer(customerId);
          },
        }
      ]
    });
    await alert.present();
  }

  deleteCustomer(customerId: string) {
    this.authService.deleteCustomer(customerId).subscribe(
      response => {
        console.log('User deleted:', response);
        this.customersData = this.customersData.filter(customer => customer.id !== customerId);
      },
      error => {
        console.error('Error deleting user:', error);
      }
    );
  }

  clear() {
    this.customer.name = '';
    this.customer.photo = null;
    this.customer.video = null;
    this.customer.pdf = null;
    this.customer.word = null;
  }
}
