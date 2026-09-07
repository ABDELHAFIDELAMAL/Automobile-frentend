import { Component } from '@angular/core';
import { MecanicienService } from '../services/mecanicien';

@Component({
  imports: [],
  selector: 'app-mecanicien-detail',
  styleUrl: './mecanicien-detail.css',
  templateUrl: './mecanicien-detail.html',
  standalone: true,
})
export class MecanicienDetail {
  constructor(private MecanicienService: MecanicienService) {}
}
