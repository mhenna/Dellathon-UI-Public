import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import {UserService} from '../services/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  errorCode = false
  fileToUpload: any;
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
  waiverAccept = false;
  teamName = "";
  teamNameFlag = false;
  maxReached = false;

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
      Validators.pattern('[0-9]+')
    ]),
    organization: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    phoneNum: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]+')
    ]),
    tshirtSize: new FormControl('', [
      Validators.required,
    ]),

    typeOfTeam: new FormControl('', [
      Validators.required,
      // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
    ]),
    waiverCheck: new FormControl('', [
      Validators.required
    ]),


  });

  constructor(private userservice: UserService, private modalService: NzModalService, private router: Router) {

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
      nationalID:this.signupForm.value.nationalID,
      phoneNumber:this.signupForm.value.phoneNum,
      tshirtSize:this.signupForm.value.tshirtSize
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

    if(this.teamNameFlag){
      this.teamName = this.signupForm.value.firstName + this.signupForm.value.nationalID
    }
    else{
      this.teamName = "teamDell" //should be the one retrieved from the start form of gettingf team name
    }
    
    console.log(this.participants)
    try{
       try{
         await this.userservice.registerParticipants(this.participants)

       }catch(err){
        console.log("EEEEEERRRRRRRRRR", err)
       }

       await this.userservice.registerTeam(this.teamName, this.numberOfMembers, this.emailList)
       this.router.navigate(["/response"])
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
      this.teamNameFlag = true
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
    try{
      res = await this.userservice.validateCode(this.signupForm.value.regCode, this.numberOfMembers)
      if(res.data.name){
        this.codeValid = true
        this.errorCode = false
        this.maxReached = false
      }
      if(res.data.type === "University")
      {
        this.showUniveristy = true;
        this.organization = res.data.name
      }      
      if(res.data.type === "Company")
        this.organization = res.data.name        
    }catch(error){
      console.log("Error", error)
      console.log(error.error.error)
      if(error.error.error === "Organization code reached limit of usage"){
        this.maxReached = true
        this.errorCode = false
      }
      else{
        this.errorCode = true
        this.maxReached = false

      }
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

  waiver(): void {
      this.modalService.info({
        nzTitle: 'Waiver',
        nzContent: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborumLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum..</p>',
        nzOnOk: () => console.log('')
      });
    }

  changeWaiver(){
      this.waiverAccept = this.signupForm.value.waiverCheck
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

interface Participant {
  firstName: String,
  lastName:String,
  idFullName:String,
  birthDate:Date,
  gender:String,
  email:String,
  organization:String,
  nationalID:String,
  phoneNumber: String,
  tshirtSize: String
}
