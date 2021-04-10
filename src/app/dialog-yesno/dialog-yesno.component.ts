import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from './model';

@Component({
  selector: 'app-dialog-yesno',
  templateUrl: './dialog-yesno.component.html',
  styleUrls: ['./dialog-yesno.component.scss']
})
export class DialogYesNoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogYesNoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onBttnClick(param: string) {
      this.dialogRef.close(param === 'YES' ? true : false);
    }

  ngOnInit(): void {
  }

}
