import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './usage.component.html',
  styleUrls: ['./usage.component.scss']
})
export class UsageComponent implements OnInit {

  constructor(private http: HttpClient) { }
  objectUrl: string = '';
  ngOnInit(): void {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer wBg0CWmPOIyj4H5T0Z8A0M2ZgVRjRv`)
    }
    this.http.post("https://awx.adshosting.lan/api/v2/workflow_job_templates/17/launch", { "extra_vars": {
      "company": "Komplett",
      "stage": "test",
      "replicas": 2,
      "amountofclusters": 1,
      "vm_datacenter": "ADShosting Datacenter"
   }}, header).subscribe(e => {
    console.log(e);
   })
  }

}
