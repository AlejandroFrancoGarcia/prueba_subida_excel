import { Component } from '@angular/core';
import { FileUploadService } from '../file-upload-service.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  fileToUpload: File | null = null;
  excelData: any[] = [];

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
      (data: any[]) => {
        this.excelData = data;
      },
      (error: any) => {
        console.error('Error fetching Excel data', error);
      }
    );
  }
}
