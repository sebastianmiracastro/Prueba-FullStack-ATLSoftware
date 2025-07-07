import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../models/contact.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  private contacts: Contact[] = [];
  private contactsSubject = new BehaviorSubject<Contact[]>([]);

  constructor(private http: HttpClient) {}

  loadContacts(): Observable<Contact[]> {
    const saved = localStorage.getItem('contacts');
    if(saved) {
      this.contacts = JSON.parse(saved);
      this.contactsSubject.next(this.contacts);
      return of(this.contacts);
    } else {
      return this.http.get<Contact[]>('assets/contacts.json').pipe(
        tap(data => {
          this.contacts = data;
          this.contactsSubject.next(this.contacts);
          localStorage.setItem('contacts', JSON.stringify(this.contacts));
        })
      )
    }
  }

  getContacts(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  addContact(contact: Contact) {
    this.contacts.push(contact);
  }
}
