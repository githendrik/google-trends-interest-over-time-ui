import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { Papa } from 'ngx-papaparse';
import { ExportToCsv } from 'export-to-csv';

export interface CsvRow {
  keyword: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public startDate: string;
  public endDate: string;
  public keyword: string;
  public manualResponse$: Observable<any> = of(null);
  public csvResponse$: Observable<any> = of(null);

  public csvContents: CsvRow[];

  public csvOutput: any[];

  constructor(private apiHttpService: ApiHttpService, private papa: Papa) {}

  getManualResponse() {
    this.manualResponse$ = this.apiHttpService.getInterestOverTime(this.keyword, this.startDate, this.endDate);
  }

  getCsvResponse() {
    const promises = [];

    this.csvContents.forEach(row => {
      promises.push(this.apiHttpService.getInterestOverTime(row.keyword, row.startDate, row.endDate).toPromise());
    });

    Promise.all(promises).then((responses) => {
      this.csvOutput = [];
      for (let i=0; i<this.csvContents.length; i++) {
        const currentResponse = responses[i];
        const currentValues = currentResponse.map(r => r.value);

        const row = [this.csvContents[i].keyword, this.csvContents[i].endDate, this.csvContents[i].startDate, ...currentValues];
        this.csvOutput.push(row);
      }
    });
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          const reader = new FileReader();
          reader.onload = (e: any) => {
            const rawFile = e.target.result;
            if (typeof rawFile === 'string') {
              this.papa.parse(rawFile,{
                complete: (result) => {
                    const cleanResult = result.data.filter(row => row.length > 1).map(row => row.map(col => col.trim()));

                    console.log(cleanResult);
                    cleanResult.reverse().pop(); // Remove header row
                    this.csvContents = cleanResult.reverse().map(row => ({
                      keyword: row[0],
                      startDate: row[2],
                      endDate: row[1]
                    }));
                }
              });


            }
          };

          reader.readAsText(file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public saveToCsv() {
    console.log('save');

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false,
      showTitle: false,
      useTextFile: false,
      useBom: true
    };

    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.csvOutput);
  }
}
