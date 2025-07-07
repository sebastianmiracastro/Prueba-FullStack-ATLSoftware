import { Component } from '@angular/core';
import { ContactList } from './components/contact-list/contact-list';
import { ContactForm } from './components/contact-form/contact-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactList, ContactForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'contacto';
}
