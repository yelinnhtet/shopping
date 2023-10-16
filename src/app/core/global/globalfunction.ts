import { DialogRef, DialogCloseResult, DialogService } from '../../../../node_modules/@progress/kendo-angular-dialog';

export class Globalfunction {

    constructor(private dialogService: DialogService ) {
    }

    public messageDialogBox(message: string, title: string) {
        const dialog: DialogRef = this.dialogService.open({
          title: title,
          content: message,
          actions: [
              { text: 'Ok', primary: true }
          ],
          width: 300
        });

        dialog.result.subscribe((result) => {
            if (result instanceof DialogCloseResult) {
                console.log('close');
            }
        });
    }
}
