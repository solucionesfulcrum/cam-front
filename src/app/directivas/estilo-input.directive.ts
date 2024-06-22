import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[espEstiloInput]'
})
export class EstiloInputDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  ngOnInit() {
    this.addPlaceHolder();
    const classesToAdd = [
      'block',
      'px-2.5',
      'pb-2.5',
      'pt-4',
      'w-full',
      'text-sm',
      'text-gray-900',
      'bg-transparent',
      'rounded-lg',
      'border-1',
      'border-gray-300',
      'appearance-none',
      'dark:text-white',
      'dark:border-gray-600',
      'dark:focus:border-blue-500',
      'focus:border-blue-600',
      'peer'
    ];

    classesToAdd.forEach(className => {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    });
  }

  addPlaceHolder(){
    const inputElement = this.elementRef.nativeElement;
    this.renderer.setAttribute(inputElement, 'placeholder', ' ');
  }

}
