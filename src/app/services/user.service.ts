import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import "rxjs";
import * as mime from 'mime-types'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
   }

  checkTeamName(name): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');
      this.http.post("http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/checkTeamName", {'teamName':name})
      .subscribe((data) => resolve(data), err => reject(err));
    });
  }

  
  validateCode(code, numOfMembers): Promise<any> {
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');
      this.http.post("http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/validateOrgCode", {'code':code, 'numberOfMembers': numOfMembers})
      .subscribe((data) => resolve(data), err => reject(err));
    });
  }

  registerParticipants(participants, teamName, emails, numberOfMembers):Promise<any>{
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');
      this.http.post("http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/addUser", {'participants':participants, 'teamName':teamName, 'emails':emails, 'numberOfMembers':numberOfMembers})
      .subscribe((data) => resolve(data), err => reject(err));
    });
  }

  registerTeam(teamName, typeOfTeam, members):Promise<any>{
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');
      this.http.post("http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/addTeam", {'typeOfTeam':typeOfTeam, 'members':members, 'name': teamName})
      .subscribe((data) => resolve(data), err => reject(err));
    });
  }
  
  postFile(file, nationalID, idFullName, fileType): Observable<string> {
    return Observable.create(observer => {
      const data = new FormData();
      data.append('file', file)
      if (file ==  undefined || file == null) {
        data.append('extension', '');
      }
      else {
        const ext = '.' + mime.extension(mime.lookup(file.name));
        // const ext = ''
        data.append('extension', ext);
      }
      data.append('nationalID', nationalID);
      data.append('idFullName', idFullName);
      data.append('fileType', fileType)
      const xhr = new XMLHttpRequest();
      xhr.open('POST',  'http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/upload');
      xhr.onload = () => {
        observer.next(xhr.status);
        observer.complete();
      };
      xhr.send(data);
    });
  }

  idExists(nationalID):Promise<any>{
    return new Promise((resolve, reject) => {
      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'application/json');
      reqHeaders.append('Access-Control-Allow-Origin', '*');
      this.http.post("http://ec2-34-222-253-165.us-west-2.compute.amazonaws.com:3200/idExists", {'nationalID':nationalID})
      .subscribe((data) => resolve(data), err => reject(err));
    });
  }

}
