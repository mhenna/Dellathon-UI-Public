import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US, zh_CN} from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpModule } from '@angular/http';



import { SignupFormComponent } from './signup-form/signup-form.component';
import { ResponseComponent } from './response/response.component';
import { WaiverComponent } from './waiver/waiver.component';
import { IconModule } from '@ant-design/icons-angular';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SignupFormComponent,
    ResponseComponent,
    WaiverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    IconModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
