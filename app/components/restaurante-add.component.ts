import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {RestauranteService} from '../services/restaurante.service';
import {Restaurante} from "../model/restaurante";
 
@Component({
    selector: 'restaurante-add',
    templateUrl: 'app/view/restaurante-add.html',
    providers: [
      RestauranteService
    ]
})

export class RestauranteAddComponent implements OnInit {

  public titulo:string = "Crear Nuevo Restaurante";
  public restaurante:Restaurante;
  public errorMessage:string;

  public filesToUpload: Array<File>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _restauranteService:RestauranteService
  ) {}

  ngOnInit() {
    this.restaurante = new Restaurante(0, "", "", "", "null", "bajo");
  }

  onSubmit() {
    this._restauranteService.addRestaurante(this.restaurante)
      .subscribe(
        response => {
          this._router.navigate(['/']);
        }, error => {
          this.errorMessage = <any>error;
          if (this.errorMessage != null) {
            this._router.navigate(['/'])
          }
        }
      );
  }

  callPrecio(value) {
    this.restaurante.precio = value;
  }


  public resultUpload;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.makeFileRequest("http://localhost/slim/restaurantes-api.php/upload-file", [], this.filesToUpload)
      .then((result) => {
        this.resultUpload = result;
        this.restaurante.imagen = this.resultUpload.filename;
        // this.restaurante.imagen = result.image;
        // console.log(result.image)
      }, error => {
        console.log(error)
      });
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();

      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // xhr.status == 200 //
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open("POST", url, true);
      xhr.send(formData);

    });
  }

}