import {
  Component,
  inject,
  Output,
  EventEmitter,
  signal,
  Input,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PushService } from '../../data/push-data/push.service';
import { CustomSelectComponent } from '../../comon-ui/selector-date/custom-select.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SvgIconComponent } from '../../comon-ui/svg-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { noWhitespaceValidator } from '../../data/validators/noWhitespaceValidator';

@Component({
  selector: 'app-push-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    PickerModule,
    SvgIconComponent,
  ],
  templateUrl: './push-modal.component.html',
  styleUrls: ['./push-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushModalComponent {
  private push = inject(PushService);
  private destroyRef = inject(DestroyRef);

  @Output() close = new EventEmitter<void>();
  @Input() userIds: number[] = [];

  loading = signal(false);
  openEmoji = signal(false);

  form = new FormGroup({
    message: new FormControl('', [
      Validators.required,
      noWhitespaceValidator()
    ]),
    mode: new FormControl<'now' | 'scheduled'>('now'),
    date: new FormControl<string | null>(null),
  });

  constructor() {
    this.form
      .get('mode')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe((mode) => {
        if (mode === 'now') {
          this.form.get('date')?.setValue(null);
        }
      });
  }

  onOverlayClick() {
    this.close.emit();
  }

  submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { message, mode, date } = this.form.value;

    const payload: any = {
      user_id: this.userIds.join(','),
      push_message: message!.trim(),
    };

    if (mode === 'scheduled' && date) {
      payload.date_start = new Date(date).toISOString();
    }

    this.push
      .sendPush(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.close.emit(),
        error: (err) => {
          console.error('Modal error:', err);
        },
      });
  }

  addEmoji(event: any) {
    const emoji = event.emoji.native;

    const control = this.form.get('message');
    control?.setValue((control.value || '') + emoji);
  }

  toggleEmoji() {
    this.openEmoji.set(!this.openEmoji());
  }
}
