import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  error = false;
  validateForm: FormGroup;

  signupForm = new FormGroup({

    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    email: new FormControl('', [
      Validators.required,
      // Validators.pattern("^[a-z0-9._%+-]+@(dell|emc)\.com$")
    ]),
    yearsExperience: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),
    yearsOrganization: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),
    yearsInRole: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),
    capacity: new FormControl('', [
      Validators.required,
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),
    department: new FormControl('', [
      Validators.required,
      //Validators.pattern('[a-zA-Z ]+')
    ]),
    position: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    location: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    directManager: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    iscoach: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),


  });
  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach(key => {
      this.validateForm.get(key).markAsDirty();
      this.validateForm.get(key).updateValueAndValidity();
    });
  }
  constructor() { }

  ngOnInit() {
  }

  afterClose() {
    this.error = false;
  }

}