import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'modal-confirm',
  templateUrl: './modal-default.component.html',
  styleUrls: ['./modal-default.component.css'],
})
export class ModalDefaultComponent implements OnInit {
    public active: boolean = false;
    public body: string;
    public title: string;
    public onClose: Subject<boolean>;

    public constructor(
        private _bsModalRef: BsModalRef
    ) { }

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    public showDefaultModal(title: string, body: string): void {
        this.title = title;
        this.body =  body;
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

    public hideDefaultModal(): void {
        this.active = false;
        this.onClose.next(null);
        this._bsModalRef.hide();
    }
}
