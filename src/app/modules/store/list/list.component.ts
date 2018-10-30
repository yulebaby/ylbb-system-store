import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ListPageComponent } from './../../../ng-relax/components/list-page/list-page.component';
import { NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { QueryNode } from 'src/app/ng-relax/components/query/query.component';
import { UpdateComponent } from '../update/update.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent

  queryNode: QueryNode[] = [
    {
      label: '门店名称',
      type: 'input',
      key: 'shopName'
    },
    {
      label: '品牌',
      key: 'brandCode',
      type: 'select',
      optionsUrl: '/advertising/listBrand',
      optionKey: { label: 'brandName', value: 'brandCode'}
    },
    {
      label: '合同状态',
      key: 'contractStatus',
      type: 'select',
      options: [{ name: '正式', id: 1 }, { name: '预置', id: 2 }, { name: '解约', id: 3 }, { name: '废弃', id: 4 }, { name: '已绑定', id: 5 }]
    },
    {
      label: '大屏状态',
      key: 'equipmentStatus',
      type: 'select',
      options: [{ name: '开', id: 1 }, { name: '关', id: 2 }]
    },
  ];

  formGroup: FormGroup;

  recordGroup: FormGroup;
  constructor(
    private http: HttpService,
    private drawer: NzDrawerService,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) { 
    this.formGroup = this.fb.group({
      id: [],
      createUser: [],
      contractNo: [],
      contractStatus: []
    });
    this.recordGroup = this.fb.group({ 
      shopId: [],
      recordContent: [, [Validators.required]]
    })
  }

  ngOnInit() {
  }

  update(storeInfo = {}) {
    const drawerRef = this.drawer.create({
      nzTitle: '门店信息',
      nzContent: UpdateComponent,
      nzWidth: 720,
      nzBodyStyle: {
        'padding-bottom': '53px'
      },
      nzContentParams: {
        storeInfo
      }
    });
    drawerRef.afterClose.subscribe(res => res && this.listPage.EaTable._request());
  }

  delete(id) {

  }


  showModal: boolean;
  /* --------------- 废弃 --------------- */
  discarded(data) {
    let storeInfo = JSON.parse(JSON.stringify(data))
    this.showModal = true;
    storeInfo.contractStatus = 4;
    this.formGroup.addControl('abandonReason', new FormControl(null, [Validators.required]));

    this.formGroup.removeControl('terminateReason');
    this.formGroup.removeControl('equipmentOrder');
    this.formGroup.removeControl('installationDate');
    this.formGroup.patchValue(storeInfo);
  }

  /* --------------- 解约 --------------- */
  dissolution(data) {
    let storeInfo = JSON.parse(JSON.stringify(data))
    this.showModal = true;
    storeInfo.contractStatus = 3;
    this.formGroup.addControl('terminateReason', new FormControl(null, [Validators.required]));

    this.formGroup.removeControl('abandonReason');
    this.formGroup.removeControl('equipmentOrder');
    this.formGroup.removeControl('installationDate');
    this.formGroup.patchValue(storeInfo);
  } 

  /* --------------- 解约 --------------- */
  binding(data) {
    let storeInfo = JSON.parse(JSON.stringify(data))
    this.showModal = true;
    storeInfo.contractStatus = 5; 
    this.formGroup.addControl('equipmentOrder', new FormControl(null, [Validators.required]));
    this.formGroup.addControl('installationDate', new FormControl(null, [Validators.required]));

    this.formGroup.removeControl('abandonReason');
    this.formGroup.removeControl('terminateReason');
    this.formGroup.patchValue(storeInfo);
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
      let params = this.formGroup.value;
      if (this.formGroup.get('contractStatus').value == 5) {
        params.installationDate = this.format.transform(params.installationDate, 'yyyy-MM-dd');
        params.shopId = params.id;
      } 
      this.http.post('/contractShop/operatorContractShop', { paramJson: JSON.stringify(params) }).then(res => {
        this.showModal = false;
        this.listPage.EaTable._request();
        this.saveLoading = false;
      }).catch(err => this.saveLoading = false);
    }
  }

  showPreview: boolean;
  storeInfo = { contractNo: null, equipmentOrder: null, equipmentAccount: null};
  resetPassword() {
    this.http.post('/contractShop/resetPassword', { paramJson: JSON.stringify({ equipmentOrder: this.storeInfo.equipmentOrder }) }).then(res => this.showPreview = false)
  }

  showRecord: boolean;
  recordList: any[] = [];
  record(data) {
    this.showRecord = true;
    data.shopId = data.id;
    this.recordGroup.patchValue(data);
    this.recordGroup.get('recordContent').reset();
    this.http.post('/contractShop/listTrackRecord', { paramJson: JSON.stringify({ shopId: data.id }) }, false).then(res => this.recordList = res.result);
  } 
  createRecord() {
    if (this.recordGroup.invalid) {
      for (let control in this.recordGroup.controls) {
        this.recordGroup.controls[control].markAsDirty();
        this.recordGroup.controls[control].updateValueAndValidity();
      }
    } else {
      this.http.post('/contractShop/createTrackRecord', { paramJson: JSON.stringify(this.recordGroup.value) }).then(res => this.showRecord = false);
    }
  }

}
