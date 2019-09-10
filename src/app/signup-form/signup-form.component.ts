import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { IconModule } from '@ant-design/icons-angular';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UserService } from '../services/user.service';
import { Router } from "@angular/router";
import * as mime from 'mime-types'


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
  organization = "";
  waiverAccept = false;
  teamName = "";
  teamNameFlag = false;
  maxReached = false;
  teamExists = false;
  participants = []
  startOffValid = false;
  memberSignupValid = false;
  files = [];
  registerUserSuccess = true;
  errorMessage = "";
  existingID = false;
  existingIDMessage = "";
  loading = false;
  submittedForm = false;

  startOffForm = new FormGroup({
    regCode: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-z0-9]+')
    ]),
    teamName: new FormControl('', [
      Validators.pattern('[a-zA-Z ]+')
    ]),
    typeOfTeam: new FormControl('', [
      Validators.required
    ])
  })


  signupForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]+')
    ]),
    fullName: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/)
    ]),
    DoB: new FormControl('', [
      Validators.required,
    ]),
    Gender: new FormControl('', [
      Validators.required,
    ]),
    nationalID: new FormControl('', [
      Validators.required,
    ]),
    organization: new FormControl('', [
      Validators.pattern('[a-zA-Z ]+')
    ]),
    phoneNum: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9]+')
    ]),
    tshirtSize: new FormControl('', [
      Validators.required,
    ]),
    idUploadFront: new FormControl('', [
      Validators.required,
    ]),
    idUploadBack: new FormControl('', [
      Validators.required
    ]),
    idUploadPassport: new FormControl('', [
      Validators.required
    ]),
    uniIdUpload: new FormControl('', [
      Validators.required,
    ]),
    radioValue: new FormControl('', [
      Validators.required,
    ])
  });

  constructor(private userservice: UserService, private modalService: NzModalService, private router: Router) {

  }
  submitForm(): void {
    Object.keys(this.validateForm.controls).forEach(key => {
      this.validateForm.get(key).markAsDirty();
      this.validateForm.get(key).updateValueAndValidity();
    });
  }

  checkFormsValidity(): void {
    this.startOffValid = this.startOffForm.valid
    this.memberSignupValid = this.signupForm.valid
  }

  ngOnInit() {
  }

  afterClose() {
    this.error = false;
  }

  refreshAndAdd() {
    this.counter += 1
    if (this.counter == this.numberOfMembers) {
      this.notFinished = false

    }


    let par: Participant = {
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      idFullName: this.signupForm.value.fullName,
      birthDate: this.signupForm.value.DoB,
      gender: this.signupForm.value.Gender,
      email: this.signupForm.value.email,
      organization: this.organization,
      nationalID: this.signupForm.value.nationalID,
      phoneNumber: this.signupForm.value.phoneNum,
      tshirtSize: this.signupForm.value.tshirtSize,
      files: this.files
    }
    for (var i = 0; i < this.files.length; i += 1)
      this.files[i].nationalID = this.signupForm.value.nationalID
    this.participants.push(par)
    this.emailList.push(par.email)
    
    
    
    if (this.counter == this.numberOfMembers + 1) {
      this.register()
      
    } else if(this.registerUserSuccess) {
      this.signupForm.reset();
      this.files = []
      this.fileToUpload = []
      this.memberSignupValid = false;
      this.errorMessage = "";
      this.registerUserSuccess = true;
      this.existingID = false;
      this.existingIDMessage = "";
      window.scroll(0, 0);
    }

  }
  async register() {

    if (this.teamNameFlag) {
      this.teamName = this.signupForm.value.firstName + this.signupForm.value.nationalID
    }
    else {
      this.teamName = this.startOffForm.value.teamName
    }

    try {
      var flag = false
      try {
        this.loading = true
        await this.userservice.registerParticipants(this.participants, this.teamName, this.emailList, this.numberOfMembers)
      } catch (err) {
        flag = true
        this.loading = false
        this.registerUserSuccess = false
        this.errorMessage = "Error during registration, try again later or contact us"
        return
      }
      if (flag == false) {
        try {
          for (var i = 0; i < this.participants.length; i = i + 1) {
            for (var j = 0; j < this.participants[i].files.length; j = j + 1) {
              await this.userservice.postFile(this.participants[i].files[j].file, this.participants[i].files[j].nationalID,
                this.participants[i].files[j].idFullName, this.participants[i].files[j].fileType).subscribe(data => { }, error => {
                  this.registerUserSuccess = false;
                  this.errorMessage = "Error during registration, try again later or contact us"
                  this.loading = false;
                  return
                })
            }
          }

          setTimeout(() => {
            this.loading = false;
            this.router.navigate(['/response']);
          }, 18000);

        } catch (err) {
          throw Error(err);
        }
      }
    }
    catch (error) {

      console.log("EEEEEERRRRRRRRROOOOOOOOORRRRRRRRRRR", error)
    }
  }

  async teamTypeChanged() {
    if (this.startOffForm.value.typeOfTeam === "Individual") {
      this.team = false;
      this.teamNameFlag = true
    }
    if (this.startOffForm.value.typeOfTeam === "Team of 2") {
      this.team = true;
      this.numberOfMembers = 2;
      this.teamName = this.startOffForm.value.teamName
    }
    if (this.startOffForm.value.typeOfTeam === "Team of 4") {
      this.team = true;
      this.numberOfMembers = 4
      this.teamName = this.startOffForm.value.teamName
    }
    this.checkFormsValidity()
  }

  async loadCode() {
    //if code is valid do this
    var res
    try {
      res = await this.userservice.validateCode(this.startOffForm.value.regCode, this.numberOfMembers)
      if (res.data.name) {
        this.codeValid = true
        this.errorCode = false
        this.maxReached = false
      }
      if (res.data.type === "University") {
        this.showUniveristy = true;
        this.organization = res.data.name
      }
      if (res.data.type === "Company") {
        this.organization = res.data.name
        this.signupForm.get('uniIdUpload').setValidators([])
        this.signupForm.get('uniIdUpload').updateValueAndValidity()
      }
    } catch (error) {
      if (error.error.error === "Organization code reached limit of usage" || error.error.error.includes("quota not sufficient to register the number")) {
        this.maxReached = true
        this.errorCode = false
      }
      else {
        this.errorCode = true
        this.maxReached = false
      }
    }

    var res2
    try {
      res2 = await this.userservice.checkTeamName(this.startOffForm.value.teamName)
      this.teamExists = false
    } catch (error) {
      this.teamExists = true
    }

    //if univeristy 
    //
  }
  checkShowComapanyBox() {
    this.showUniveristy = false;
  }
  checkShowUploadUnivID() {
    this.showCompany = false;
  }

  onUpload(event) {
    console.log(event)
  }

  waiver(): void {
    this.modalService.info({
      nzTitle: 'Waiver',
      nzContent: "<p>Dell Technologies/ Marathon 2019 Waiver of Participation<br><br> I hereby confirm that I am at least 18 years old, I certify that I’m in a good health, and that I’m medically fit and properly trained to be participating in Dell Technologies/ Marathon 2019 (“Event”) organized by Dell Technologies (“Organizer”). I also confirm my knowledge that my participation may lead to injuries or fatal accidents.<br><br>I also agree to abide by all the Rules & Regulations as provided and as will be provided to me by The Organizer including the right of any official to deny or suspend my participation for any reason whatsoever. I also attest to abide by any decision of any Event official related to my ability to safely complete the event.<br><br>Having read this waiver and knowing these facts and in consideration of your accepting my participation, I hereby waive and release Dell Technologies, their representatives and successors from all claims or liabilities of any kind arising out of my participation in the Dell Technologies/Marathon 2019.<br><br>Furthermore, I grant permission to the Organizer and any of its agents or service providers ,to use my name, photographs, motion pictures, recordings or any other record taken in the course of this Event for media activities including but not limited to television channels and social media platforms and for any other legitimate purpose in its sole discretion.<br><p>",
      nzOnOk: () => console.log('')
    });
  }

  agenda(): void {
    this.modalService.info({
      nzTitle: '<h3>Important Timings</h3>',
      nzContent:" <br> <ul> <li>Gathering Timings:    06:30 am</li> <br> <li>Warm Up:     06:45 am</li> <br> <li>Race Starts:     07:00 am</li> <br>" 
      + "<li>Cut Off Time:    9:30 am </li><br> <li>Closing Ceremony:  10:00 am </li><br> </ul>",
      nzOnOk: () => console.log('')
    });
  }

  changeWaiver() {
    this.waiverAccept = !this.waiverAccept
    this.checkFormsValidity()
  }

  handleFileInput(files: FileList, fileType) {
    this.fileToUpload = files.item(0);

    const f = {
      "file": files.item(0),
      "extension": '.' + mime.extension(mime.lookup(files.item(0).name)),
      "nationalID": this.signupForm.value.nationalID,
      "idFullName": this.signupForm.value.fullName,
      "fileType": fileType
    }
    var flag = true
    for (var i = 0; i < this.files.length; i += 1) {
      if (this.files[i].fileType == fileType) {
        flag = false
        this.files[i] = {
          "file": files.item(0),
          "extension": '.' + mime.extension(mime.lookup(files.item(0).name)),
          "nationalID": this.signupForm.value.nationalID,
          "idFullName": this.signupForm.value.fullName,
          "fileType": fileType
        }
      }
    }

    if (flag)
      this.files.push(f)
    // this.uploadFileToActivity(fileType)

    if (fileType == "p") {
      this.signupForm.get('idUploadPassport').setValidators([Validators.required])
      this.signupForm.get('idUploadPassport').updateValueAndValidity()
      this.signupForm.get('idUploadFront').setValidators([])
      this.signupForm.get('idUploadFront').updateValueAndValidity()
      this.signupForm.get('idUploadBack').setValidators([])
      this.signupForm.get('idUploadBack').updateValueAndValidity()
    }
    else if (fileType == "idf" || fileType == "idb") {
      this.signupForm.get('idUploadFront').setValidators([Validators.required])
      this.signupForm.get('idUploadFront').updateValueAndValidity()
      this.signupForm.get('idUploadBack').setValidators([Validators.required])
      this.signupForm.get('idUploadBack').updateValueAndValidity()
      this.signupForm.get('idUploadPassport').setValidators([])
      this.signupForm.get('idUploadPassport').updateValueAndValidity()
    }
  }

  async checkIDExists(nationalID) {
    var c = 0;
    try {
      await this.userservice.idExists(nationalID)
      for (var i = 0; i < this.participants.length; i += 1) {
        if (this.participants[i].nationalID === nationalID) {
          this.existingID = true;
          this.existingIDMessage = "One of the previous participants have the same ID"
          c += 1
        }
      }
      if (c == 0)
        this.existingID = false

    } catch (err) {
      this.existingID = true;
      this.existingIDMessage = err.error
    }
  }

  async clearFiles() {
    for (var i = 0; i < this.files.length; i += 1) {
      if (this.files[i].fileType == "idf" || this.files[i].fileType == "idb"
        || this.files[i].fileType == "p") {
        this.files.splice(i, 1)
        i = i - 1
      }
    }
    this.signupForm.get('idUploadFront').reset()
    this.signupForm.get('idUploadBack').reset()
    this.signupForm.get('idUploadPassport').reset()
  }


  submitClicked() {
    this.submittedForm = true;
  }
}

interface Participant {
  firstName: String,
  lastName: String,
  idFullName: String,
  birthDate: Date,
  gender: String,
  email: String,
  organization: String,
  nationalID: String,
  phoneNumber: String,
  tshirtSize: String,
  files: any;
}
