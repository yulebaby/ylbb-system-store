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
      label: '客户名称',
      type: 'input',
      key: 'advertiserName'
    },
    {
      label: '类型',
      key: 'advertisingType',
      type: 'select',
      options: [{ name: '图片', id: 1 }, { name: '视频', id: 2 }]
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      options: [{ name: '生效', id: 0 }, { name: '失效', id: -1 }]
    },
    {
      label: '投放日期',
      key: 'launchDate',
      valueKey: ['launchDateStart', 'launchDateEnd'],
      type: 'rangepicker'
    }
  ]

  constructor(
    private http: HttpService,
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
  }

  update(storeInfo = {}) {
    const drawerRef = this.drawer.create({
      nzTitle: '广告信息',
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


  showDiscarded: boolean;
  storeInfo;
  discarded(storeInfo) {
    this.showDiscarded = true;
    this.storeInfo = storeInfo;
  }

}
