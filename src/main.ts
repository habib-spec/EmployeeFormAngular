// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // Corrected import name and path

bootstrapApplication(AppComponent, appConfig) // Bootstrap AppComponent
  .catch((err) => console.error(err));