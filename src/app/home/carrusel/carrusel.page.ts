import { Component, ViewChild, Input } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Carrusel } from '../../objetos';
import {GetterFirebaseService} from '../../serviceGeneral/getter-firebase.service';
import {tap} from 'rxjs';


@Component({
  selector: 'app-carrusel',
  templateUrl: 'carrusel.page.html',
  styleUrls: ['carrusel.page.scss'],
})
export class CarruselPage {

  @ViewChild('slideWithNav', { static: false }) slideWithNav: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;

  @Input() carrusel!: Carrusel;

  data: any;
  imagenes!: Carrusel[];

  sliderOne: any;
  sliderTwo: any;
  sliderThree: any;


  //Configuration for each Slider
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };
  slideOptsTwo = {
    initialSlide: 1,
    slidesPerView: 2,
    loop: true,
    centeredSlides: true,
    spaceBetween: 20
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3
  };

  constructor( private getterJsonService: GetterFirebaseService
  ) {
    //Item object for Nature
    this.sliderOne =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 995
          },
          {
            id: 925
          },
          {
            id: 940
          },
          {
            id: 943
          },
          {
            id: 944
          }
        ]
      };
    //Item object for Food
    this.sliderTwo =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 324
          },
          {
            id: 321
          },
          {
            id: 435
          },
          {
            id: 524
          },
          {
            id: 235
          }
        ]
      };
    //Item object for Fashion
    this.sliderThree =
      {
        isBeginningSlide: true,
        isEndSlide: false,
        slidesItems: [
          {
            id: 643
          },
          {
            id: 532
          },
          {
            id: 232
          },
          {
            id: 874
          },
          {
            id: 193
          }
        ]
      };
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    this.getterJsonService.getImagesCarrusel()
      .pipe(
        tap((image: Carrusel[]) => this.imagenes = image)
      )
      .subscribe();
  }

  //Move to Next slide
  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Move to previous slide
  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  //Method called when slide is changed by drag or navigation
  slideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  //Call methods to check if slide is first or last to enable disbale navigation
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }

  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }

}
