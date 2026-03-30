import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../data/auth-data/auth.service';
import { SvgIconComponent } from '../../comon-ui/svg-icon.component';
import { noWhitespaceValidator } from '../../data/validators/noWhitespaceValidator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    login: new FormControl<string | null>(null, [
      Validators.required,
      noWhitespaceValidator(),
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      noWhitespaceValidator(),
    ]),
  });

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { login, password } = this.form.value;

    this.auth
      .login(login!, password!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
  }
}
