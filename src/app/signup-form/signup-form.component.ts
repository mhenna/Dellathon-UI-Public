import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import {UserService} from '../services/user.service'


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  fileToUpload: any;
  error = false;
  codeValid = false;
  team = false;
  individualFlag = [0];
  team2flag = [0, 1];
  team4flag = [0, 1, 2, 3];
  formCounter = [0, 1];
  numberOfMembers = 1;
  validateForm: FormGroup;
  showCompany = false;
  showUniveristy = false;

  signupForm = new FormGroup({
    regCode: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    teamName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    email: new FormControl('', [
      Validators.required,
      // Validators.pattern("^[a-z0-9._%+-]+@(dell|emc)\.com$")
    ]),
    DoB: new FormControl('', [
      Validators.required,
    ]),
    Gender: new FormControl('', [
      Validators.required,
    ]),
    nationalID: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    company_university: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    typeOfTeam: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),



  });

  constructor(private userservice: UserService) {

  }
  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach(key => {
      this.validateForm.get(key).markAsDirty();
      this.validateForm.get(key).updateValueAndValidity();
    });
  }
  ngOnInit() {
  }

  afterClose() {
    this.error = false;
  }

  setCounter(){
    console.log("HHHHH")
  }

  loadCode() {
    if(this.signupForm.value.typeOfTeam === "Individual")
    {
      this.team = false;
      this.formCounter = this.individualFlag
    }
    if(this.signupForm.value.typeOfTeam === "Team of 2")
    {
      this.team = true;
      this.formCounter = this.team2flag
      this.numberOfMembers = 2;
    }
    if(this.signupForm.value.typeOfTeam === "Team of 4")
    {
      this.team = true;
      this.formCounter = this.team4flag
      this.numberOfMembers = 4
    }

    //if code is valid do this
    var res
    res = this.userservice.validateCode(this.signupForm.value.regCode, this.numberOfMembers)
    console.log("res", res)


      this.codeValid = true
    //if univeristy 
    //
  }
  checkShowComapanyBox(){
    this.showUniveristy = false;
  }
  checkShowUploadUnivID(){
    this.showCompany = false;
  }

  onUpload(event) {
    console.log(event)
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity()
  }

  uploadFileToActivity() {
    this.userservice.postFile(this.fileToUpload, this.signupForm.value.nationalID).subscribe(data => {
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }

}
