import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() advertisingInfo;

  formGroup: FormGroup;

  brandList: any[] = [];
  labelList: any[] = [];

  shopList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) {
    this.http.post('/advertising/listBrand', { id: 36 }, false).then(res => this.brandList = res.result);
    this.http.post('/advertising/listAdvertisingLabel', { id: 36 }, false).then(res => this.labelList = res.result);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [],
      advertiserName: [, [Validators.required]],
      advertisingCost: [, [Validators.required]],
      brandCode: [, [Validators.required]],
      advertisingTime: [, [Validators.required]],
      date: [, [Validators.required]],
      isAll: [true],
      labelId: [],
      advertisingStyle: [2, [Validators.required]],
      advertisingType: [1, [Validators.required]],
      sourceUrl: [, [Validators.required]]
    });
    if (this.advertisingInfo.id) {
      this.advertisingInfo.brandCode = this.advertisingInfo.brandCode.split(',').map(res => res = parseInt(res));
      this.advertisingInfo.labelId = this.advertisingInfo.labelId.split(',').map(res => res = parseInt(res));
      this.advertisingInfo.date = [new Date(this.advertisingInfo.launchDate), new Date(this.advertisingInfo.offlineDate)];
      this.advertisingInfo.isAll = this.advertisingInfo.province == 'quanguo';
      this.formGroup.patchValue(this.advertisingInfo);

      if (this.advertisingInfo.province != 'quanguo') {
        let addVal = this.advertisingInfo.id && this.advertisingInfo.province ? [this.advertisingInfo.province, this.advertisingInfo.city] : null;
        this.formGroup.addControl('address', new FormControl(addVal, [Validators.required]));
        let shopVal = this.advertisingInfo.id && this.advertisingInfo.province ? this.advertisingInfo.shopIds.split(',') : null;
        this.formGroup.addControl('shops', new FormControl(shopVal, [Validators.required]));
      }
      if (this.advertisingInfo.advertisingStyle == 1) {
        this.formGroup.addControl('topPicture', new FormControl(this.advertisingInfo.topPicture, [Validators.required]));
        this.formGroup.addControl('downPicture', new FormControl(this.advertisingInfo.downPicture, [Validators.required]));
      }
    }



    this.formGroup.get('isAll').valueChanges.subscribe(res => {
      if (!res) {
        let addVal = this.advertisingInfo.id && this.advertisingInfo.province ? [this.advertisingInfo.province, this.advertisingInfo.city] : null;
        this.formGroup.addControl('address', new FormControl(addVal, [Validators.required]));
        let shopVal = this.advertisingInfo.id && this.advertisingInfo.province ? this.advertisingInfo.shopIds.split(',').map(r => parseInt(r)) : null;
        this.formGroup.addControl('shops', new FormControl(shopVal, [Validators.required]));

        /* ------------------- 根据所选城市查询门店列表 ------------------- */
        this.formGroup.get('address').valueChanges.subscribe(e => {
          if (e && e[1]) {
            this.http.post('/advertising/listAdvertiesmentShop', { paramJson: JSON.stringify({ city: e[1] }) }, false).then(res => this.shopList = res.result);
          }
        })
      } else {
        this.formGroup.removeControl('address');
        this.formGroup.removeControl('shops');
      }
    })

    /* ------------------ 广告样式：如果为横屏 则需要填写上下展示图片 ------------------ */
    this.formGroup.get('advertisingStyle').valueChanges.subscribe(val => {
      if (val == 1) {
        this.formGroup.addControl('topPicture', new FormControl(this.advertisingInfo.topPicture || null, [Validators.required]));
        this.formGroup.addControl('downPicture', new FormControl(this.advertisingInfo.downPicture || null, [Validators.required]));
      } else {
        this.formGroup.removeControl('topPicture');
        this.formGroup.removeControl('downPicture');
      }
    });
  }

  closeDrawer() {
    this.drawerRef.close(false);
  }

  saveLoading: boolean;
  save() {
    if (this.formGroup.invalid) {
      for (let control in this.formGroup.controls) {
        this.formGroup.controls[control].markAsDirty();
        this.formGroup.controls[control].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let request = this.formGroup.get('id').value ? '/advertising/editAdvertising' : '/advertising/createAdvertising';
      let params = this.formGroup.value;

      params.brandCode = params.brandCode.join(',');
      params.labelId = params.labelId ? params.labelId.join(',') : '';
      if (params.isAll) {
        params.province = 'quanguo';
      } else {
        params.province = params.address[0];
        params.city = params.address[1];
        params.shopIds = params.shops.join(',');
      }
      params.launchDate = this.format.transform(params.date[0], 'yyyy-MM-dd');
      params.offlineDate = this.format.transform(params.date[1], 'yyyy-MM-dd');
      this.http.post(request, { paramJson: JSON.stringify(params) }).then(res => {
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }



  loadData = (node: any, index: number): PromiseLike<any> => {
    return new Promise((resolve) => {
        let params = index < 0 ? {} : { paramJson: JSON.stringify({ provinceCode: node.value }) };
        this.http.post(`/region/${index < 0 ? 'listProvince' : 'listCity'}`, params, false).then(res => {
          index > -1 && res.result.map(e => e.isLeaf = true);
          node.children = res.result;
          resolve();
        });
    });
  }


}
