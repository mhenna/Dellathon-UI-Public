import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { ResponseComponent } from './response/response.component';
import { WaiverComponent } from './waiver/waiver.component';

const routes: Routes = [
    {
        path: '',
        component: WaiverComponent
    },
    {
        path: 'signup',
        component: SignupFormComponent
    },
    {
        path: 'response',
        component: ResponseComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }