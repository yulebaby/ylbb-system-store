import { MenuConfig } from '../../core/menu-config';
import { AppState } from '../../core/reducers/reducers-config';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { RouterState } from '../../core/reducers/router-reducer';
import { UserInfoState } from '../../core/reducers/userInfo-reducer';

@Component({
  selector: 'ea-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() isCollapsed: boolean = false;
  
  routerState: RouterState;
  shopNameFontSize = 24;

  menuConfig: any[] = MenuConfig;

  roleAllowPath: string;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.select('routerState').subscribe(res => this.routerState = res);
  }

}
