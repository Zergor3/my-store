import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss'],
})
export class ImgComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  img: string = '';
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('img')
  set changeImg(newImg: string) {
    this.img = newImg;
    // console.log('change just img => ', this.img);
  }
  @Input() alt: string = '';
  @Output() loaded = new EventEmitter<string>();
  imgDefault = '../../../assets/images/default.png';
  // counter = 0;
  // counterFn: number | undefined | NodeJS.Timer;

  constructor() {
    //Antes del render
    //Prohibido cosas asincronas
    //Solo se crea una vez
    // console.log('Constructor', 'imgValue => ', this.img);
  }
  ngOnDestroy(): void {
    //delete
    console.log('ngOnDestroy');
    // clearInterval(this.counterFn);
  }
  ngAfterViewInit(): void {
    //Despues del render
    //Handler hijos
    console.log('ngAfterViewInit');
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Durante el render
    //Cambios en Inputs
    //Se corre muchas veces
    // console.log('ngOnChanges', 'imgValue => ', this.img);
    console.log('changes ', changes);
  }

  ngOnInit(): void {
    //Antes del render
    //Aqui se corre cosas asincronas
    console.log('ngOnInit', 'imgValue => ', this.img);
    // this.counterFn = setInterval(() => {
    //   this.counter++;
    //   console.log("run counter")
    // }, 1000);
  }

  imgError() {
    this.img = this.imgDefault;
  }

  imgLoaded() {
    // console.log('log hijo');
    this.loaded.emit(this.img);
  }
}
