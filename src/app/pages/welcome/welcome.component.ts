import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor( private http: HttpClient) { }

  ngOnInit(): void {

  }

  open() {
    this.http.get("/api/public").subscribe(e => {
      console.log(e);
    })
  }
  secure() {
    this.http.get("/api/secure").subscribe(e => {
      console.log(e);
    })
  }
  admin() {
    this.http.get("/api/admin").subscribe(e => {
      console.log(e);
    })
  }

}
