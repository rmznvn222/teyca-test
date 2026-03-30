import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

type ModeValue = 'now' | 'scheduled';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  value: ModeValue = 'now';
  disabled = false;
  isOpen = false;

  private onChange: (value: ModeValue) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: ModeValue | null): void {
    this.value = value ?? 'now';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleOpen(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  selectNow(): void {
    this.updateValue('now');
    this.close();
  }

  selectScheduled(): void {
    this.updateValue('scheduled');
    this.close();
  }

  private updateValue(value: ModeValue): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  close(): void {
    this.isOpen = false;
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-select')) {
      this.isOpen = false;
    }
  }
}