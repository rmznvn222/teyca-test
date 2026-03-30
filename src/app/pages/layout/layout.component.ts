import { ChangeDetectionStrategy, Component,  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from "../../shared/topbar/topbar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {

}
