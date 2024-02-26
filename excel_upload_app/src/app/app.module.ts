import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadService } from './file-upload-service.service';

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule 
  ],
  providers: [
    provideClientHydration(),
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
