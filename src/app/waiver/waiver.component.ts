import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiver',
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.css']
})
export class WaiverComponent implements OnInit {
  waiver = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeWaiver() {
    this.waiver = !this.waiver
  }

  next() {
    this.router.navigate(['/signup'])
  }
}
