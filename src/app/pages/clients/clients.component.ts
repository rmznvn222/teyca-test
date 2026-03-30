import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PushModalComponent } from '../push/push-modal.component';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientsService } from '../../data/client-data/clients.service';
import { Client } from '../../data/client-data/clients.interface';
import { SvgIconComponent } from '../../comon-ui/svg-icon.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    PushModalComponent,
    RouterModule,
    ReactiveFormsModule,
    SvgIconComponent,
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent {
  private clientsService = inject(ClientsService);
  private destroyRef = inject(DestroyRef);

  private search = signal('');
  page = signal(1);
  limit = signal(10);
  showPush = signal(false);

  clients = signal<Client[]>([]);
  selectedIds = signal<Set<number>>(new Set());
  total = signal(0);

  id = new FormControl<string>('');

  offset = computed(() => (this.page() - 1) * this.limit());

  lastPageitem = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.limit())),
  );

  startItem = computed(() =>
    this.total() ? (this.page() - 1) * this.limit() + 1 : 0,
  );

  endItem = computed(() => Math.min(this.page() * this.limit(), this.total()));

  selectedIdsArray = computed(() => Array.from(this.selectedIds()));

  constructor() {
    effect(() => {
      const limit = this.limit();
      const offset = this.offset();
      const search = this.search();

      this.clientsService
        .getClients(limit, offset, search)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.clients.set(
              Array.isArray(res.passes) ? res.passes : [res.passes],
            );
            this.total.set(res.meta?.size ?? 0);
          },

          error: (err) => {
            console.error('Clients error:', err);
            this.clients.set([]);
            this.total.set(0);
          },
        });
    });

    this.id.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.search.set(value ? `phone=${value}` : '');
        this.page.set(1);
      });
  }

  setLimit(value: string) {
    this.limit.set(+value);
    this.page.set(1);
  }

  toggleClient(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedIds.update((set) => {
      const newSet = new Set(set);

      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }

      return newSet;
    });
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      const allIds = this.clients().map((c) => c.user_id);
      this.selectedIds.set(new Set(allIds));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  nextPage() {
    if (this.page() < this.lastPageitem()) this.page.update((v) => v + 1);
  }

  prevPage() {
    if (this.page() > 1) this.page.update((v) => v - 1);
  }

  firstPage() {
    this.page.set(1);
  }

  lastPage() {
    this.page.set(this.lastPageitem());
  }

  openPush() {
    console.log(this.selectedIds());
    this.showPush.set(true);
  }

  closePush() {
    this.showPush.set(false);
    this.selectedIds.set(new Set());
  }
}
