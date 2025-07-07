import { Component } from '@angular/core';
import { ContactList } from './components/contact-list/contact-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'contacto';
}
