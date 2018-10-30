import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/ng-relax/services/http.service';
import { NzDrawerRef } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @Input() storeInfo;

  saveLoading: boolean;

  formGroup: FormGroup;

  brandList: any[] = [];

  constructor(
    private http: HttpService,
    private drawerRef: NzDrawerRef<boolean>,
    private fb: FormBuilder = new FormBuilder(),
    private format: DatePipe
  ) {
    this.http.post('/advertising/listBrand', { id: 36 }, false).then(res => this.brandList = res.result);
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: [],
      brandCode: [, [Validators.required]],
      contractName: [, [Validators.required]],
      contractPhone: [, [Validators.required, Validators.pattern(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/)]],
      shopName: [, [Validators.required]],
      address: [, [Validators.required]],
      shopAddress: [, [Validators.required]],
      signingDate: [, [Validators.required]],
      contractAttachment: [],
    });

    if (this.storeInfo.id) {
      this.storeInfo.address = [this.storeInfo.province, this.storeInfo.city, this.storeInfo.area];
      this.formGroup.patchValue(this.storeInfo);
      this.formGroup.addControl('contractStatus', new FormControl(this.storeInfo.contractStatus))
    }
  }

  save() {
    console.log(this.formGroup)
    if (this.formGroup.invalid) {
      for (let control in this.formGroup.controls) {
        this.formGroup.controls[control].markAsDirty();
        this.formGroup.controls[control].updateValueAndValidity();
      }
    } else {
      this.saveLoading = true;
      let request = this.formGroup.get('id').value ? '/contractShop/editContractShop' : '/contractShop/createContractShop';
      let params = this.formGroup.value;

      params.province = params.address[0];
      params.city = params.address[1];
      params.area = params.address[2];
      params.signingDate = this.format.transform(params.signingDate, 'yyyy-MM-dd');

      this.http.post(request, { paramJson: JSON.stringify(params) }).then(res => {
        this.drawerRef.close(true);
      }).catch(err => this.saveLoading = false);
    }
  }

  close() {
    this.drawerRef.close();
  }

  loadData = (node: any, index: number): PromiseLike<any> => {
    return new Promise((resolve) => {
      let params = index == -1 ? {} : 
                  index == 0 ? 
                  { paramJson: JSON.stringify({ provinceCode: node.value }) } : 
                  { paramJson: JSON.stringify({ cityCode: node.value }) } ;
      let request = index == -1 ? 'listProvince' : index == 0 ? 'listCity' : 'listArea';
      this.http.post(`/region/${request}`, params, false).then(res => {
        index > 0 && res.result.map(e => e.isLeaf = true);
        node.children = res.result;
        resolve();
      });
    });
  }

}
