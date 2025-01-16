import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[espEstiloLabel]',
  standalone: true
})
export class EstiloLabelDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const classesToAdd = [
      'absolute',
      'text-sm',
      'text-gray-500',
      'dark:text-gray-400',
      'duration-300',
      'transform',
      '-translate-y-4',
      'scale-75',
      'top-2',
      'z-10',
      'origin-[0]',
      'bg-white',
      'dark:bg-gray-900',
      'px-2',
      'peer-focus:px-2',
      'peer-focus:text-blue-600',
      'peer-focus:dark:text-blue-500',
      'peer-placeholder-shown:scale-100',
      'peer-placeholder-shown:-translate-y-1/2',
      'peer-placeholder-shown:top-1/2',
      'peer-focus:top-2',
      'peer-focus:scale-75',
      'peer-focus:-translate-y-4',
      'rtl:peer-focus:translate-x-1/4',
      'rtl:peer-focus:left-auto',
      'start-1'
    ];

    classesToAdd.forEach(className => {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    });

    this.renderer.setStyle(this.elementRef.nativeElement, 'cursor', 'text');
  }
}
