import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})

export class ContactForm {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phones: this.fb.array([
        this.fb.control('', Validators.required)
      ])
    });
  }

  get phones(): FormArray{
    return this.contactForm.get('phones') as FormArray;
  }

  addPhone(): void {
    this.phones.push(this.fb.control('', Validators.required));
  }

  removePhone(index: number): void {
    if(this.phones.length > 1) {
      this.phones.removeAt(index)
    }
  }

  save(): void {
    if(this.contactForm.valid) {
      const newContact: Contact = this.contactForm.value;
      this.contactService.addContact(newContact);
      this.resetForm();
    }
  }

  cancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.contactForm.reset();
    this.phones.clear();
    this.phones.push(this.fb.control('', Validators.required));
  }

}
