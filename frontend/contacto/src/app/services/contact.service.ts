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
  private editingContactSubject = new BehaviorSubject<Contact | null>(null);

  constructor(private http: HttpClient) {}

  loadContacts(): Observable<Contact[]> {
    const saved = localStorage.getItem('contacts');
    if(saved) {
      this.contacts = JSON.parse(saved);
      this.contactsSubject.next(this.contacts);
      return of(this.contacts);
    } else {
      return this.http.get<Contact[]>('/contacts.json').pipe(
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
    contact.id = this.getNextId();
    this.contacts.push(contact);
    this.updateStorage();
  }

  updateContact(updated: Contact) {
    const index = this.contacts.findIndex(c => c.id === updated.id);
    if(index !== -1) {
      this.contacts[index] = updated;
      this.updateStorage();
    }
  }

  deleteContact(id: number) {
    this.contacts = this.contacts.filter(c => c.id !== id);
    this.updateStorage();
  }

  private getNextId(): number {
    return this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.id)) + 1 : 1;
  }

  private updateStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    this.contactsSubject.next(this.contacts);
  }

  /* Metodo para editar contactos */

  setEditingContact(contact: Contact | null) {
    this.editingContactSubject.next(contact);
  }

  getEditingContact(): Observable<Contact | null > {
    return this.editingContactSubject.asObservable();
  }

}
