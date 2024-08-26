import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-recently-visited',
  templateUrl: './recently-visited.component.html',
  styleUrls: ['./recently-visited.component.scss']
})
export class RecentlyVisitedComponent implements OnInit {
  // Kullanıcının son ziyaret ettiği linklerin listesi
  visitedLinks: string[] = [];

  // HTML'deki 'visitedContainer' elementine erişmek için ViewChild kullanımı
  @ViewChild('visitedContainer') visitedContainer: ElementRef;

  // Son pozisyonun koordinatları (x, y) - Başlangıç değeri olarak (20, 20) verildi
  lastPosition: { x: number, y: number } = { x: 20, y: 20 }; 

  // Renderer2, DOM manipülasyonları yapmak için kullanılır
  constructor(private renderer: Renderer2) {}

  // Bileşen ilk yüklendiğinde çalıştırılır. Son bilinen container pozisyonunu localStorage'dan yükler.
  ngOnInit(): void {
    // localStorage'da kaydedilen son pozisyonu al ve yükle
    const savedPosition = JSON.parse(localStorage.getItem('lastPosition'));
    if (savedPosition) {
      // Eğer kaydedilmiş bir pozisyon varsa, container elementini bu pozisyona yerleştir
      this.lastPosition = savedPosition;
      this.renderer.setStyle(
        this.visitedContainer.nativeElement,
        'left',
        `${this.lastPosition.x}px`
      );
      this.renderer.setStyle(
        this.visitedContainer.nativeElement,
        'top',
        `${this.lastPosition.y}px`
      );
    } else {
      // Eğer kaydedilmiş bir pozisyon yoksa, container'ı başlangıç pozisyonuna yerleştir
      this.renderer.setStyle(this.visitedContainer.nativeElement, 'left', '20px');
      this.renderer.setStyle(this.visitedContainer.nativeElement, 'bottom', '20px');
    }
    // Kullanıcının son ziyaret ettiği linkleri yükle
    this.loadRecentlyVisitedLinks();
  }

  // LocalStorage'dan son ziyaret edilen linkleri yükler ve bileşende kullanılmak üzere visitedLinks dizisine atar
  loadRecentlyVisitedLinks() {
    const links = JSON.parse(localStorage.getItem('visitedLinks')) || [];
    this.visitedLinks = links;
  }

  // Kullanıcı container'ı sürükleyip bıraktığında çağrılır, yeni pozisyonu hesaplar ve kaydeder
  onDragEnd(event: any): void {
    // Container'ın yeni pozisyonunu hesapla ve sakla
    const rect = this.visitedContainer.nativeElement.getBoundingClientRect();
    this.lastPosition = { x: rect.left, y: rect.top };

    // Container'ı yeni pozisyona taşı
    this.renderer.setStyle(
      this.visitedContainer.nativeElement,
      'left',
      `${this.lastPosition.x}px`
    );
    this.renderer.setStyle(
      this.visitedContainer.nativeElement,
      'top',
      `${this.lastPosition.y}px`
    );

    // Yeni pozisyonu localStorage'a kaydet
    localStorage.setItem('lastPosition', JSON.stringify(this.lastPosition));
  }
}
