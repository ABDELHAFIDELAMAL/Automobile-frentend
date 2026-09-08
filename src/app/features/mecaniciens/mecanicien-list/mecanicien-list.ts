import { Component, OnInit } from '@angular/core';
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
  Mecaniciens: Mecanicien[] = [];
  constructor(private MecanocienService: MecanicienService) {}

  ngOnInit(): void {
    this.loadMecanicien()
  }

  loadMecanicien(){
    this.MecanocienService.getAllMechanicals().subscribe({
      next : ( response)=>{
        this.Mecaniciens = response.data;
        console.log(this.Mecaniciens);
      },
      error : (error)=>{
        console.log("Error de L API" , error);
      }
    })
  }
}
