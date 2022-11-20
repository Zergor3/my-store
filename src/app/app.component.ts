import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showImg = true;
  imgParent = '';
  token = '';
  imgRta = '';

  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe();
    }
  }

  createUser() {
    this.usersService
      .create({
        name: 'Sebas',
        email: 'sebas@email.com',
        password: '1212',
        role: 'customer',
      })
      .subscribe((rta) => {
        console.log(rta);
      });
  }

  downloadPdf() {
    this.filesService
      .getFile(
        'my.pdf',
        'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
        'application/pdf'
      )
      .subscribe();
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if (file) {
      this.filesService.uploadFile(file).subscribe((rta) => {
        this.imgRta = rta.location;
      });
    }
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  onLoaded(img: string) {
    // console.log('log padre', img);
  }

  widthImg = 10;
  public name = 'Zergor';
  public age = 18;
  img = 'https://www.w3schools.com/howto/img_avatar.png';
  btnDisabled = true;

  register = {
    name: '',
    email: '',
    password: '',
  };

  person = {
    name: 'Zergor',
    age: 18,
    avatar: 'https://www.w3schools.com/howto/img_avatar.png',
  };

  names: string[] = ['Zergor', 'Juli', 'Santi'];
  newName = '';

  box = {
    width: 100,
    height: 100,
    background: 'red',
  };

  // products: Product[] = [
  //   {
  //     name: 'EL mejor juguete',
  //     price: 565,
  //     image: './assets/images/toy.jpg',
  //     category: 'all',
  //   },
  //   {
  //     name: 'Bicicleta casi nueva',
  //     price: 356,
  //     image: './assets/images/bike.jpg'
  //   },
  //   {
  //     name: 'Colleción de albumnes',
  //     price: 34,
  //     image: './assets/images/album.jpg'
  //   },
  //   {
  //     name: 'Mis libros',
  //     price: 23,
  //     image: './assets/images/books.jpg'
  //   },
  //   {
  //     name: 'Casa para perro',
  //     price: 34,
  //     image: './assets/images/house.jpg'
  //   },
  //   {
  //     name: 'Gafas',
  //     price: 3434,
  //     image: './assets/images/glasses.jpg'
  //   }
  // ]

  toggleButton() {
    this.btnDisabled = !this.btnDisabled;
  }

  increaseAge() {
    this.person.age++;
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    // console.log(element.scrollTop);
  }

  changeName(event: Event) {
    const element = event.target as HTMLInputElement;
    this.person.name = element.value;
  }

  addName() {
    this.names.push(this.newName);
    this.newName = '';
  }

  deleteName(index: number) {
    this.names.splice(index, 1);
  }

  onRegister() {
    // console.log(this.register);
  }
}
