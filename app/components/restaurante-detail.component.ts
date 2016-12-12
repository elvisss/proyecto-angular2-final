import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {RestauranteService} from '../services/restaurante.service';
import {Restaurante} from "../model/restaurante";
 
@Component({
    selector: 'restaurante-detail',
    templateUrl: 'app/view/restaurante-detail.html',
    providers: [
      RestauranteService
    ]
})

export class RestauranteDetailComponent implements OnInit {

  public restaurante:Restaurante;
  public errorMessage:string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _restauranteService:RestauranteService
  ) {}

  ngOnInit() {
    this.getRestaurante();
  }

  getRestaurante() {
    this._route.params.forEach((params: Params) => {
      let id = params["id"];
      let random = params["random"];

      this._restauranteService.getRestaurante(id, random)
        .subscribe(
          response => {
            this.restaurante = response.data;
          }, error => {
            this.errorMessage = <any>error;
            if (this.errorMessage != null) {
              this._router.navigate(['/'])
            }
          }
        );
    });
  }

}