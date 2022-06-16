import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Company } from '../../models/company';

@Component({
  selector: 'app-edit-data-dialog',
  templateUrl: './edit-data-dialog.component.html',
  styleUrls: ['./edit-data-dialog.component.scss']
})
export class EditDataDialogComponent {
  dataKeys: string[];
  constructor(
    public dialogRef: MatDialogRef<EditDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { data: any, title: string}
  ) {
    this.dataKeys = Object.keys(data.data)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  inputType(key: string): string {
    switch (typeof(this.data.data[key])) {
      case "number":
        return "number";
      case "string":
        return "text";
      default:
        return "text";
    }
  }

}
