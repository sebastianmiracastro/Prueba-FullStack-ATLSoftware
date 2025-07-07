import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm implements OnInit {
  contactForm: FormGroup;
  editingContactId: number | null = null;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.createEmptyForm();
  }

  ngOnInit(): void {
    this.contactService.getEditingContact().subscribe((contact) => {
      if (contact) {
        this.editingContactId = contact.id;
        this.contactForm.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
        });

        this.phones.clear();
        contact.phones.forEach((phone) => {
          this.phones.push(this.fb.control(phone, Validators.required));
        });
      }
    });
  }

  createEmptyForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phones: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  addPhone(): void {
    this.phones.push(this.fb.control('', Validators.required));
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  save(): void {
    if (this.contactForm.valid) {
      const contact: Contact = {
        ...this.contactForm.value,
        id: this.editingContactId ?? 0,
      };

      if (this.editingContactId) {
        this.contactService.updateContact(contact);
      } else {
        this.contactService.addContact(contact);
      }

      this.resetForm();
    }
  }

  cancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.contactForm.reset();
    this.editingContactId = null;
    this.contactService.setEditingContact(null);
    this.phones.clear();
    this.phones.push(this.fb.control('', Validators.required));
  }
}
