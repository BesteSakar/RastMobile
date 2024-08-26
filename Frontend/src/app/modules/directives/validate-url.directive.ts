import { Directive, ElementRef, Renderer2, HostListener } from "@angular/core";

@Directive({
  selector: "[appValidateUrl]",
})
export class ValidateUrlDirective {
  private urlPattern = /^(http|https):\/\/[^ "]+$/;
  private errorMessage: HTMLElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.errorMessage = this.renderer.createElement('span');
    this.renderer.setStyle(this.errorMessage, 'color', 'red');
    this.renderer.setStyle(this.errorMessage, 'fontSize', '12px');
    this.renderer.setStyle(this.errorMessage, 'display', 'none');
    this.renderer.setProperty(this.errorMessage, 'innerText', 'Geçerli bir URL girin (örn. https://example.com)');
    this.renderer.appendChild(this.el.nativeElement.parentNode, this.errorMessage);
  }

  @HostListener("input") onInputChange() {
    const value = this.el.nativeElement.value;
    if (!this.urlPattern.test(value)) {
      this.el.nativeElement.style.borderColor = "red";
      this.renderer.setStyle(this.errorMessage, 'display', 'block');
    } else {
      this.el.nativeElement.style.borderColor = "green";
      this.renderer.setStyle(this.errorMessage, 'display', 'none');
    }
  }
}
