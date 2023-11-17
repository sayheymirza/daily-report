import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import moment from 'jalali-moment';

import { IndexdbService } from './indexdb.service';
import { PdfService } from './pdf.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'w-full h-full flex flex-nowrap',
  },
})
export class AppComponent {
  public Fullname: string = '';
  public Clients: string[] = [];
  public Client: string = '';
  public Today: string = moment().locale('fa').format('jYYYY/jMM/jDD');

  public Reports: IReport[] = [];

  constructor(
    private indexdbService: IndexdbService,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.initFullname();
    this.initClients();

    this.indexdbService.open().then(() => {
      this.initReports();
    });
  }

  // start: manage fullname
  public OnFullnameChange() {
    window.localStorage.setItem('#sayheymirza/fullname', this.Fullname);

    this.setTitle();
  }

  private initFullname() {
    const fullname = window.localStorage.getItem('#sayheymirza/fullname');
    if (fullname) {
      this.Fullname = fullname;
    }

    this.setTitle();
  }
  // end: manage fullname

  // start: manage clients
  public AddClient() {
    if (this.Client && this.Client.length > 3) {
      this.Clients.push(this.Client);
      this.Client = '';
      this.onClientChange();
    }
  }

  public RemoveClientByIndex(index: number) {
    this.Clients.splice(index, 1);
    this.onClientChange();
  }

  private onClientChange() {
    window.localStorage.setItem(
      '#sayheymirza/client',
      JSON.stringify(this.Clients)
    );
  }

  private initClients() {
    const clients = window.localStorage.getItem('#sayheymirza/client');
    if (clients) {
      this.Clients = JSON.parse(clients);
    }
  }
  // end: manage clients

  // start: manage reports

  public NewReport() {
    this.Reports.push({
      client: '',
      content: '',
      result: '',
    });

    this.OnReportChange();
  }

  public RemoveReportByIndex(index: number) {
    this.Reports.splice(index, 1);

    this.OnReportChange();
  }

  public SetReportItemClientByIndex(index: number, client: string = '') {
    if (client.length > 0) {
      this.Reports[index].client = client;
    } else if (this.Client && this.Client.length > 3) {
      this.Reports[index].client = this.Client;
    }

    this.OnReportChange();
  }

  public OnReportChange() {
    this.indexdbService
      .setTableByDate(this.Today, this.Reports)
      .then(console.log)
      .catch(console.error);
  }

  private initReports() {
    this.indexdbService.getTableByDate(this.Today).then((reports) => {
      this.Reports = reports;
    });
  }

  public Generate() {
    this.pdfService.generate({
      fullname: this.Fullname,
      date: this.Today,
      reports: this.Reports,
    });
  }
  // end: manage reports

  // start: handle page title
  private setTitle() {
    let title = '';

    if (this.Fullname && this.Fullname.length > 3) {
      title += this.Fullname;
    } else {
      title += 'همکار بی نام';
    }

    const date = moment(this.Today, 'jYYYY/jMM/jDD')
      .locale('fa')
      .format('jDD jMMMM');

    title += ' - ' + date;

    document.title = title;
  }
  // end: handle page title
}

interface IReport {
  content: string;
  client: string;
  result: string;
}
