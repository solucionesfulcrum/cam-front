import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[espDivPropocional]'
})
export class DivProporcionalDirective {

  screenHeight!: number;
  proportionalHeight!: number;
  bottomSpace: number = 120; // Espacio en píxeles que deseas dejar en la parte inferior

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.calculateHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateHeight();
  }

  private calculateHeight() {
    this.screenHeight = window.innerHeight;
    this.proportionalHeight = this.screenHeight * 0.75 - this.bottomSpace; // Calcula la altura con espacio inferior
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.proportionalHeight}px`);
  }

}
