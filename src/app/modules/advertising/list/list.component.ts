import { ListPageComponent } from './../../../ng-relax/components/list-page/list-page.component';
import { UpdateComponent } from './../update/update.component';
import { NzModalService, NzDrawerService } from 'ng-zorro-antd';
import { HttpService } from './../../../ng-relax/services/http.service';
import { QueryNode } from './../../../ng-relax/components/query/query.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('listPage') listPage: ListPageComponent;

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
      key: 'advertisingStatus',
      type: 'select',
      options: [{ name: '待投放', id: 1 }, { name: '投放中', id: 2 }, { name: '已下线', id: 3 }]
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
    private modal: NzModalService,
    private drawer: NzDrawerService
  ) { }

  ngOnInit() {
  }

  update(advertisingInfo = {}) {
    const drawerRef = this.drawer.create({
      nzTitle: '广告信息',
      nzContent: UpdateComponent,
      nzWidth: 720,
      nzBodyStyle: {
        'padding-bottom': '53px'
      },
      nzContentParams: {
        advertisingInfo: JSON.parse(JSON.stringify(advertisingInfo))
      }
    });
    drawerRef.afterClose.subscribe(res => res && this.listPage.EaTable._request());
  }
}
