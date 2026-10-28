import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { cartOutline } from 'ionicons/icons';
import { ApiService, Order } from '../../service/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonAvatar,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonModal,
    IonButtons,
    IonButton,
  ],
})
export class HomePage implements OnInit {
  // Servicios usados para consultar órdenes y mostrar alertas/toasts.
  private readonly apiService = inject(ApiService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  // Datos originales y valores escritos en los controles del filtro.
  readonly cartOutline = cartOutline;
  orders: Order[] = [];
  minAmount: number | string | null = null;
  maxAmount: number | string | null = null;
  isLoadingOrders = true;
  apiError: string | null = null;

  // Estado y datos de la factura que se muestra en el modal.
  isInvoiceOpen = false;
  selectedOrder: Order | null = null;

  ngOnInit(): void {
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoadingOrders = false;
        console.log('Órdenes cargadas con éxito:', this.orders);
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        this.isLoadingOrders = false;
        this.apiError = 'No se pudieron cargar las órdenes. Revisa tu conexión e inténtalo de nuevo.';
        console.error('Error al cargar las órdenes:', error);
        this.changeDetector.markForCheck();
      },
    });
  }

  // Indicadores calculados sobre todas las órdenes recibidas.
  get totalAmount(): number {
    return this.orders.reduce((sum, order) => sum + order.amount, 0);
  }

  get criticalStockCount(): number {
    return this.orders.filter((order) => order.stock < 5).length;
  }

  // Mensaje de validación calculado en tiempo real mientras se editan los montos.
  get filterErrorMessage(): string | null {
    const minText = String(this.minAmount ?? '').trim();
    const maxText = String(this.maxAmount ?? '').trim();
    const min = this.parseAmount(this.minAmount);
    const max = this.parseAmount(this.maxAmount);

    if ((minText !== '' && min === null) || (maxText !== '' && max === null)) {
      return 'Ingresa montos enteros sin puntos ni comas.';
    }

    if (min !== null && max !== null && min > max) {
      return 'El monto mínimo no puede superar al máximo.';
    }

    return null;
  }

  // Filtra en tiempo real; los campos vacíos no limitan los resultados.
  get filteredOrders(): Order[] {
    if (this.filterErrorMessage !== null) {
      return [];
    }

    const min = this.parseAmount(this.minAmount);
    const max = this.parseAmount(this.maxAmount);

    return this.orders.filter(
      (order) =>
        (min === null || order.amount >= min) &&
        (max === null || order.amount <= max),
    );
  }

  // Convierte el valor a entero; vacío significa que no hay límite.
  private parseAmount(value: number | string | null): number | null {
    const text = String(value ?? '').trim();
    if (text === '') {
      return null;
    }

    if (!/^\d+$/.test(text)) {
      return null;
    }

    const amount = Number(text);
    return Number.isInteger(amount) && amount >= 0 ? amount : null;
  }

  // Calcula los valores de la factura de la orden seleccionada.
  get invoiceSubtotal(): number {
    return this.selectedOrder?.amount ?? 0;
  }

  get invoiceTax(): number {
    return this.invoiceSubtotal * 0.19;
  }

  get invoiceTotal(): number {
    return this.invoiceSubtotal + this.invoiceTax;
  }

  // Abre la factura con los datos de la orden elegida.
  openInvoice(order: Order): void {
    this.selectedOrder = order;
    this.isInvoiceOpen = true;
  }

  closeInvoice(): void {
    this.isInvoiceOpen = false;
  }

  onInvoiceDismiss(): void {
    this.isInvoiceOpen = false;
    this.selectedOrder = null;
  }

  // Confirma la factura, descuenta una unidad y avisa si no hay stock.
  async completeInvoice(): Promise<void> {
    const order = this.selectedOrder;
    if (!order) return;

    if (order.stock <= 0) {
      const alert = await this.alertController.create({
        header: 'Stock agotado',
        message: 'No hay unidades disponibles para esta orden.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    order.stock -= 1;
    this.closeInvoice();

    const toast = await this.toastController.create({
      message: `Factura completada. Stock restante: ${order.stock}.`,
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }
}
