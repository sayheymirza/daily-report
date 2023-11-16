import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexdbService {
  private db?: IDBDatabase;

  constructor() {}

  // open the database
  public open() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = window.indexedDB.open('sayheymirza', 1);
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        this.db = request.result;
        
        resolve(event);
      };
      request.onupgradeneeded = (event) => {
        this.db = request.result;

        const objectStore = this.db.createObjectStore('reports', {
          keyPath: 'id',
        });

        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('date', 'text', { unique: false });
        objectStore.createIndex('table', 'text', { unique: false });
      };
    });
  }

  public setTableByDate(date: string, table: any[] = []) {
    return new Promise((resolve, reject) => {
      if (this.db) {
        var _table = JSON.stringify(table);

        // check date exist
        const transaction = this.db.transaction(['reports'], 'readwrite');

        const objectStore = transaction.objectStore('reports');

        const request = objectStore.get(date);

        request.onerror = (event) => {
          reject(event);
        };

        request.onsuccess = (event) => {
          const data = request.result;
          if (data) {
            data.table = _table;
            const requestUpdate = objectStore.put(data);
            requestUpdate.onerror = (event) => {
              reject(event);
            };
            requestUpdate.onsuccess = (event) => {
              resolve(event);
            };
          } else {
            const requestAdd = objectStore.add({
              id: date,
              date,
              table: _table,
            });
            requestAdd.onerror = (event) => {
              reject(event);
            };
            requestAdd.onsuccess = (event) => {
              resolve(event);
            };
          }
        };
      }
    });
  }

  public getTableByDate(date: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        const transaction = this.db.transaction(['reports'], 'readonly');

        const objectStore = transaction.objectStore('reports');

        const request = objectStore.get(date);

        request.onerror = (event) => {
          reject(event);
        };

        request.onsuccess = (event) => {
          const data = request.result;
          if (data) {
            resolve(JSON.parse(data.table));
          } else {
            resolve([]);
          }
        };
      }
    });
  }
}
