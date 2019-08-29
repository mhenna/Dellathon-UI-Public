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

  errorCode = false
  error = false;
  codeValid = false;
  team = false;
  individualFlag = [0];
  team2flag = [0, 1];
  team4flag = [0, 1, 2, 3];
  formCounter = [0];
  numberOfMembers = 1;
  validateForm: FormGroup;
  showCompany = false;
  showUniveristy = false;
  notFinished = true;
  counter = 1;
  emailList = []
  organization= "";
  teamName = "Dell";

  participants = []
  


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
    organization: new FormControl('', [
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

  refreshAndAdd(){
    this.counter+= 1
    if(this.counter == this.numberOfMembers)
    {
      this.notFinished = false

    }

    
    let par: Participant = {
      firstName : this.signupForm.value.firstName,
      lastName:this.signupForm.value.lastName,
      idFullName:this.signupForm.value.fullName,
      birthDate:this.signupForm.value.DoB,
      gender:this.signupForm.value.Gender,
      email:this.signupForm.value.email,
      organization:this.organization,
      nationalID:this.signupForm.value.nationalID
    }
    this.participants.push(par)
    this.emailList.push(par.email)

    

    if(this.counter == this.numberOfMembers+1)
    {
      this.register()

    } else {
      this.signupForm.reset();
    }
    
  }
  async register(){
    
    console.log(this.participants)
    try{
       await this.userservice.registerParticipants(this.participants)
       await this.userservice.registerTeam(this.teamName, this.numberOfMembers, this.emailList)
    }
    catch(error)
    {
    
      console.log("EEEEEERRRRRRRRROOOOOOOOORRRRRRRRRRR", error)
    }
  }

  async loadCode() {
    if(this.signupForm.value.typeOfTeam === "Individual")
    {
      this.team = false;
    }
    if(this.signupForm.value.typeOfTeam === "Team of 2")
    {
      this.team = true;
      this.numberOfMembers = 2;
    }
    if(this.signupForm.value.typeOfTeam === "Team of 4")
    {
      this.team = true;
      this.numberOfMembers = 4
    }

    //if code is valid do this
    var res
    console.log("res", res)
    try{
      res = await this.userservice.validateCode(this.signupForm.value.regCode, this.numberOfMembers)
      if(res.data.name)
        this.codeValid = true
      if(res.data.type === "University")
      {
        this.showUniveristy = true;
        this.organization = res.data.name
      }      
      if(res.data.type === "Company")
        this.organization = res.data.name        
    }catch(error){
      this.errorCode = true
    }




      
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

}

interface Participant {
  firstName: String,
  lastName:String,
  idFullName:String,
  birthDate:Date,
  gender:String,
  email:String,
  organization:String,
  nationalID:String
}
