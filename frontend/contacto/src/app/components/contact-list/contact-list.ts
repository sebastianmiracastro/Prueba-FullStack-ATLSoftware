import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
  standalone: true,
  imports: [CommonModule],
})

export class ContactList implements OnInit {
  contacts$!: Observable<Contact[]>;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
      this.contactService.loadContacts().subscribe();

      this.contacts$ = this.contactService.getContacts();
  }

  /* Metodos para editar contacto */

  editContact(contact: Contact): void {
    this.contactService.setEditingContact(contact);
  }

  /* Metodos para eliminar contacto */

  deleteContact(id: number): void {
    const confirmDelete = confirm('¿Estás seguro de eliminar este contacto?')
    if(confirmDelete) {
      this.contactService.deleteContact(id);
    }
  }
}
