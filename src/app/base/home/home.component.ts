import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { AppState } from './../../core/reducers/reducers-config';
import { Store } from '@ngrx/store';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  queryForm: FormGroup;

  advertisingInfo = { advertisingCount: 0, resultList: [], totalTime: '00:00:00'}

  brandList: any[] = [];

  constructor(
    private http: HttpService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) {
    this.http.post('/advertising/listBrand', { id: 36 }, false).then(res => this.brandList = res.result);

    this.queryForm = this.fb.group({
      launchDate: [, [Validators.required]],
      brandCode: [, [Validators.required]],
      shop: [, [Validators.required]]
    });
  }
  
  ngOnInit() {
  }

  submit() {
    if (this.queryForm.invalid) {
      for (let control in this.queryForm.controls) {
        this.queryForm.controls[control].markAsDirty();
        this.queryForm.controls[control].updateValueAndValidity();
      }
    } else {
      let params = this.queryForm.value;
      params.shopId = params.shop[2];
      params.launchDate = this.format.transform(params.launchDate, 'yyyy-MM-dd');
      this.http.post('/advertising/getAdvertisingByCondition', { paramJson: JSON.stringify(params) }, false).then(res => this.advertisingInfo = res.result );
    }
  }


  loadData = (node: any, index: number): PromiseLike<any> => {
    return new Promise((resolve) => {
      let params = index == -1 ? {} :
        index == 0 ?
          { paramJson: JSON.stringify({ provinceCode: node.value }) } :
          { paramJson: JSON.stringify({ cityCode: node.value }) };
      let request = index == -1 ? '/region/listProvince' : index == 0 ? '/region/listCity' : '/advertising/listAdvertiesmentShop';
      this.http.post(request, params, false).then(res => {
        index > 0 && res.result.map(e => {
          e.isLeaf = true;
          e.label = e.shopName;
          e.value = e.shopId;
        });
        node.children = res.result;
        resolve();
      });
    });
  }


  _disabledDate(current: Date): boolean {
    return current && current.getTime() < Date.now() - 24 * 60 * 60;
  }


}
