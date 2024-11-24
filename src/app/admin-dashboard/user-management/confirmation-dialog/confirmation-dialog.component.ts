// components/confirmation-dialog/confirmation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogData } from '../user.types';

@Component({
    selector: 'app-confirmation-dialog',
    imports: [CommonModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}
}
