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

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [],
      advertiserName: [this.advertisingInfo.advertiserName, [Validators.required]],
      advertisingCost: [this.advertisingInfo.advertisingCost, [Validators.required]],
      brandCode: [],
      date: [, [Validators.required]],
      address: [, [Validators.required]],
      labelId: [this.advertisingInfo.labelId ? this.advertisingInfo.labelId.split(',') : null],
      advertisingStyle: [this.advertisingInfo.advertisingStyle || 2, [Validators.required]],
      advertisingType: [this.advertisingInfo.advertisingType || 1, [Validators.required]],
      sourceUrl: [, [Validators.required]]
    });

    /* ------------------ 广告样式：如果为横屏 则需要填写上下展示图片 ------------------ */
    this.formGroup.get('advertisingStyle').valueChanges.subscribe(val => {
      if (val == 1) {
        this.formGroup.addControl('topPicture', new FormControl(null, [Validators.required]));
        this.formGroup.addControl('downPicture', new FormControl(null, [Validators.required]));
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
      this.http.post(request, params).then(res => {

      })
    }
  }

}
