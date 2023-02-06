// NOTE this is a dual purpose login/register page. Usually you'd split the two obviously but for the sake of time...

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private alert: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    await this.loadingService.create('Logging you in...');
    try {
      const user = await this.auth.login(
        this.form.value as { email: string; password: string }
      );
      this.loadingService.dismiss();
      this.router.navigate(['/']);
    } catch (error) {
      // TODO proper handling of this error, give the Users an explanation/way to resolve
      this.loadingService.dismiss();
      const alert = await this.alert.create({
        message: 'Failed to log you in. Check your credentials.',
        buttons: ['OK'],
      });
      alert.present();
    }
  }

  async register() {
    await this.loadingService.create('Signing you up...');
    try {
      const user = await this.auth.register(
        this.form.value as { email: string; password: string }
      );
      this.loadingService.dismiss();
      this.router.navigate(['/']);
    } catch (error) {
      // TODO proper handling of this error, give the Users an explanation/way to resolve
      this.loadingService.dismiss();
      const alert = await this.alert.create({
        message: 'Failed to register. Try again with a different email.',
        buttons: ['OK'],
      });
      alert.present();
    }
  }
}
