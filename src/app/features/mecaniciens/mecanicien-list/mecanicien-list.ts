import { Component, OnInit, signal } from '@angular/core';
import { MecanicienService } from '../services/mecanicien';
import { Mecanicien } from '../../../entities/Mecanicien';

@Component({
  imports: [],
  selector: 'app-mecanicien-list',
  styleUrl: './mecanicien-list.css',
  templateUrl: './mecanicien-list.html',
  standalone: true,
})
export class MecanicienList implements OnInit {
  Mecaniciens= signal< Mecanicien[] > ([]);
  constructor(private MecanocienService: MecanicienService) {}

  ngOnInit(): void {
    this.loadMecaniciens()
  }

  loadMecaniciens(){
    this.MecanocienService.getAllMechanicals().subscribe({
      next : ( response)=>{
        this.Mecaniciens.set(response.data);
        console.log(this.Mecaniciens());
      },
      error : (error)=>{
        console.log("Error de L API" , error);
      }
    })
  }
}
