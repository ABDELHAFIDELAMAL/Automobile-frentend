import { Component } from '@angular/core';
import { MecanicienService } from '../services/mecanicien';

@Component({
  imports: [],
  selector: 'app-mecanicien-list',
  styleUrl: './mecanicien-list.css',
  templateUrl: './mecanicien-list.html',
})
export class MecanicienList {
  constructor(private MecanocienService : MecanicienService) {
  }
}
