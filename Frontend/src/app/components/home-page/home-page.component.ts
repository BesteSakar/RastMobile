import { Component } from "@angular/core";
import { ManagementApplicationServices } from "../../services/managementApplication.service";
import { LinkRequest } from "../../models/linkRequest.request";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"],
  providers: [ManagementApplicationServices],
})
export class HomePageComponent {
  links = [];
  isModalVisible = false;
  selectedLink: any;
  message: string | null = null;
  success: boolean = true;
  isAddAccountModalVisible = false;
  selectedUrl: string;
  selectedDescription: string;
  selectedName: string;
  searchTerm: string = "";
  filteredLinks = [];
  rowsOptions = [4, 8, 12, 16, "All"];
  rowsPerPage = 4;
  currentPage = 1;
  paginatedLinks = [];

  constructor(
    private managementApplicationServices: ManagementApplicationServices,
    private authService: AuthService,
    private router: Router
  ) {}

  // Bileşen yüklendiğinde çalışır, linkleri localStorage'dan yükler
  ngOnInit() {
    this.loadLinksFromLocalStorage();
  }

  // Tüm linkleri sunucudan çeker ve localStorage'a kaydeder
  getAllList() {
    this.managementApplicationServices.getLinks().subscribe((data) => {
      this.links = data;
      this.filteredLinks = data;
      localStorage.setItem("links", JSON.stringify(data));
      this.updatePagination();
    });
  }

  // Bir linki günceller ve localStorage'a kaydeder
  updateChanges(link: any) {
    this.managementApplicationServices.updateLink(link.id, link).subscribe(
      (response) => {
        this.message = "Başarıyla güncellendi!";
        this.success = true;
        this.saveLinksToLocalStorage();
        link.isEditing = false;
        setTimeout(() => (this.message = null), 3000);
      },
      (error) => {
        this.message = "Güncellenirken bir hata oluştu.";
        this.success = false;
        setTimeout(() => (this.message = null), 3000);
      }
    );
  }

  // Bir linki siler ve localStorage'ı günceller
  deleteLink(id: number) {
    this.managementApplicationServices.deleteLink(id).subscribe(() => {
      this.links = this.links.filter((link) => link.id !== id);
      this.message = "Başarıyla silindi!";
      this.saveLinksToLocalStorage();
      window.location.reload();
      this.success = true;
      setTimeout(() => (this.message = null), 3000);
    });
  }

  // Yeni bir link ekler ve localStorage'ı günceller
  saveLink() {
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    if (!urlPattern.test(this.selectedUrl)) {
      this.message = "Geçerli bir URL girin (örn. https://example.com)";
      this.success = false;
      setTimeout(() => (this.message = null), 3000);
      return;
    }
    let request = new LinkRequest();
    request.name = this.selectedName;
    request.description = this.selectedDescription;
    request.url = this.selectedUrl;
    this.managementApplicationServices.addLink(request).subscribe(
      (response) => {
        this.message = response.message;
        this.saveLinksToLocalStorage();
        window.location.reload();
        this.success = true;
        setTimeout(() => (this.message = null), 3000);
      },
      (error) => {
        this.message = error.error.message;
        this.success = false;
        setTimeout(() => (this.message = null), 3000);
      }
    );
  }

  // LocalStorage'dan linkleri yükler ve sayfalamayı günceller
  loadLinksFromLocalStorage() {
    this.getAllList();
    const savedLinks = localStorage.getItem("links");
    if (savedLinks) {
      this.links = JSON.parse(savedLinks);
      this.filteredLinks = this.links;
      this.updatePagination();
    }
  }

  // Linkleri localStorage'a kaydeder
  saveLinksToLocalStorage() {
    localStorage.setItem("links", JSON.stringify(this.links));
  }

  // Düzenleme işlemini iptal eder
  cancelEdit(link: any) {
    link.isEditing = false;
  }

  // Hesap ekleme modali açar
  openAddAccountModal() {
    this.isModalVisible = true;
  }

  // Hesap ekleme modalini kapatır
  closeModal() {
    this.isModalVisible = false;
  }

  // Kullanıcı satır sayısı seçiminde değişiklik yaptığında çağrılır
  onRowsChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === "All") {
      this.rowsPerPage = this.filteredLinks.length;
    } else {
      this.rowsPerPage = parseInt(selectedValue, 10);
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  // Sayfalamayı günceller
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;
    this.paginatedLinks = this.filteredLinks.slice(startIndex, endIndex);
  }

  // Kullanıcıyı sistemden çıkış yapar
  logout() {
    this.authService.logout();
  }

  // Linki ziyaret eder ve son ziyaret edilen linklere ekler
  visitLink(link: string) {
    this.addToRecentlyVisited(link);
  }

  // Linki son ziyaret edilen linkler listesine ekler ve localStorage'a kaydeder
  addToRecentlyVisited(link: string) {
    const maxItems = 5;
    let visitedLinks = JSON.parse(localStorage.getItem("visitedLinks")) || [];
    visitedLinks = visitedLinks.filter(
      (visitedLink: string) => visitedLink !== link
    );
    visitedLinks.unshift(link);
    if (visitedLinks.length > maxItems) {
      visitedLinks.pop();
    }
    localStorage.setItem("visitedLinks", JSON.stringify(visitedLinks));
    window.location.reload();
  }

  // Arama kutusuna giriş yapıldığında linkleri filtreler
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filteredLinks = this.links.filter(
      (link) =>
        link.name.toLowerCase().includes(this.searchTerm) ||
        link.url.toLowerCase().includes(this.searchTerm) ||
        link.description.toLowerCase().includes(this.searchTerm)
    );
    this.updatePagination();
  }
}
