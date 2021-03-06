import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from "../../core/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    trigger('overlayState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ]),

    trigger('notificationTopbar', [
      state('hidden', style({
        height: '0',
        opacity: 0
      })),
      state('visible', style({
        height: '*',
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
})
export class NavigationComponent implements OnInit {
  menuActive: boolean;
  activeMenuId: string;
  notification: boolean = false;

  constructor(public auth: AuthService) { }

  ngOnInit() {
    setTimeout(() => this.notification = true, 1000)
  }

  changeTheme(event: Event, theme: string) {
    let themeLink: HTMLLinkElement = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.href = 'assets/components/themes/' + theme + '/theme.css';
    event.preventDefault();
  }

  onMenuButtonClick(event: Event) {
    this.menuActive = !this.menuActive;
    event.preventDefault();
  }

  closeNotification(event) {
    this.notification = false;
    event.preventDefault();
  }

}
