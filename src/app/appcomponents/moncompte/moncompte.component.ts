import { Component, OnInit } from '@angular/core';
import { AuthService } from "./../../core/auth.service";
import { UsersService } from "./../../service/firestore/users.service";

@Component({
  selector: 'app-moncompte',
  templateUrl: './moncompte.component.html',
  styleUrls: ['./moncompte.component.css']
})
export class MoncompteComponent implements OnInit {
  user;
  constructor
  (
    public auth: AuthService,
    private UserService: UsersService
  ) { }

  ngOnInit() {
    // Récupération utilisateur connecté
    this.auth.user$.subscribe(userConnected => {
      this.UserService.getUserByUid(userConnected.uid).subscribe(user => {
        this.user = user;
        console.log(this.user);
      });
    });
  }


}
