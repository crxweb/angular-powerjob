import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.css'],
})
export class ModalConfirmComponent implements OnInit {
    public active: boolean = false;
    public body: string;
    public image: string;
    public title: string;
    public onClose: Subject<boolean>;

    public constructor(
        private _bsModalRef: BsModalRef
    ) {
        //this.image = '<img src="https://image.flaticon.com/teams/slug/google.jpg">';
     }

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    public showConfirmationModal(title: string, body: string, image = null): void {
        this.title = title;
        this.body =  body;
        this.image = image;
        this.active = true;
    }

    public onConfirm(): void {
        this.active = false;
        this.onClose.next(true);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this.active = false;
        this.onClose.next(false);
        this._bsModalRef.hide();
    }

    public hideConfirmationModal(): void {
        this.active = false;
        this.onClose.next(null);
        this._bsModalRef.hide();
    }
}
