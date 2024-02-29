import { Component } from '@angular/core';
import { FileUploadService } from '../file-upload-service.service';

interface ExcelRow {
  Email: string;
  Estado: string;
  Id: number;
  Nombre: String;
  Telefono: number;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileToUpload: File | null = null;
  excelData: ExcelRow[] = []; // Usamos la interfaz para asegurar el tipo de datos

  constructor(private fileUploadService: FileUploadService) {}

  handleFileInput(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileToUpload = files[0];
    }
  }

  uploadFileToServer() {
    if (!this.fileToUpload) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);

    this.fileUploadService.uploadFile(formData).subscribe(
      (response: any) => {
        console.log('File uploaded successfully', response);
        this.getExcelData();
      },
      (error: any) => {
        console.error('Error uploading file', error);
      }
    );
  }

  getExcelData() {
    this.fileUploadService.getExcelData().subscribe(
      (data: any) => {
        console.log('Received Excel Data:', data); // Verifica los datos en la consola
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          this.excelData = data.data;
        } else {
          console.error('Data format error:', data);
        }
      },
      (error: any) => {
        console.error('Error fetching Excel data', error);
      }
    );
  }
}
