import { Injectable } from '@angular/core';
import moment from 'jalali-moment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  public generate(params: IPDFGenerateParams) {
    // remove all iframes from the DOM
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      document.body.removeChild(iframe);
    });

    // create an iframe element in the DOM
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // add every font to iframe from the DOM
    const fonts = document.querySelectorAll('link[rel="stylesheet"]');

    fonts.forEach((font) => {
      iframe.contentDocument!.head.appendChild(font.cloneNode(true));
    });

    // create a style to set font to Vazirmatn
    const style = document.createElement('style');
    style.innerText = `
      body {
        font-family: Vazirmatn !important;
      }
    `;
    iframe.contentDocument!.head.appendChild(style);

    // create a script for https://cdn.tailwindcss.com
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    iframe.contentDocument!.head.appendChild(script);

    // set iframe body className to m-20
    iframe.contentDocument!.body.className = 'm-20';

    // set iframe html dir to rtl
    iframe.contentDocument!.documentElement!.dir = 'rtl';

    const titleText = 'گزارش روزانه';
    const title = document.createElement('strong');
    title.innerText = titleText;
    title.className = 'text-2xl text-center block my-4';
    iframe.contentDocument!.body.appendChild(title);

    // create a row
    const row = document.createElement('div');
    row.className = 'flex flex-nowrap items-center justify-between';
    iframe.contentDocument!.body.appendChild(row);

    // set fullname
    const fullname = document.createElement('span');
    fullname.innerText = 'نام و نام خانوادگی : ' + params.fullname;
    fullname.className = 'text-base';
    row.appendChild(fullname);

    // set date
    const date = document.createElement('span');
    date.innerText = 'تاریخ : ' + params.date;
    date.className = 'text-base';
    row.appendChild(date);

    // create a table
    const table = document.createElement('table');
    table.className = 'w-full border-collapse border border-black mt-10';
    iframe.contentDocument!.body.appendChild(table);

    // create a table head
    const thead = document.createElement('thead');
    table.appendChild(thead);

    // create a table head row
    const theadRow = document.createElement('tr');
    thead.appendChild(theadRow);

    const heads = [
      {
        text: '',
        width: 65,
      },
      {
        text: 'شرح',
      },
      {
        text: 'به سفارش',
        width: 100,
      },
      {
        text: 'نتیجه',
        width: 100,
      },
    ];

    heads.forEach((head) => {
      const th = document.createElement('th');
      th.innerText = head.text;
      th.className = 'border border-black text-center';
      if (head.width) {
        th.style.width = head.width + 'px';
      }
      theadRow.appendChild(th);
    });

    // create a table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    params.reports.forEach((report, index) => {
      // create a table body row
      const tbodyRow = document.createElement('tr');
      tbody.appendChild(tbodyRow);

      // create a table body row cell
      const tbodyRowCell = document.createElement('td');
      tbodyRowCell.innerText = (index + 1).toString();
      tbodyRowCell.className = 'border border-black text-center';
      tbodyRow.appendChild(tbodyRowCell);

      // create a table body row cell
      const tbodyRowCell1 = document.createElement('td');
      tbodyRowCell1.innerText = report.content;
      tbodyRowCell1.className = 'border border-black text-center';
      tbodyRow.appendChild(tbodyRowCell1);

      // create a table body row cell
      const tbodyRowCell2 = document.createElement('td');
      tbodyRowCell2.innerText = report.client;
      tbodyRowCell2.className = 'border border-black text-center';
      tbodyRow.appendChild(tbodyRowCell2);

      // create a table body row cell
      const tbodyRowCell3 = document.createElement('td');
      tbodyRowCell3.innerText = report.result;
      tbodyRowCell3.className = 'border border-black text-center';
      tbodyRow.appendChild(tbodyRowCell3);
    });

    // set iframe title
    let iframeTitle = params.fullname;

    const iframeDate = moment(params.date, 'jYYYY/jMM/jDD')
      .locale('fa')
      .format('jDD jMMMM');

    iframeTitle += ' - ' + iframeDate;

    iframe.title = iframeTitle;

    // print iframe
    setTimeout(() => {
      iframe.contentWindow!.focus();
      iframe.contentWindow!.print();
    }, 1000);
  }
}

interface IPDFGenerateParams {
  fullname: string;
  date: string;
  reports: any[];
}
