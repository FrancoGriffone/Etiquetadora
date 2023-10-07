import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-config-local',
  templateUrl: './config-local.component.html',
  styleUrls: ['./config-local.component.scss'],
})
export class ConfigLocalComponent implements OnInit {
  locales: any;
  localesStorage = localStorage.getItem('local');
  constructor(private service: AppService) {
    this.service.getLocales().subscribe((resp) => {
      this.locales = resp;
    });
  }

  ngOnInit(): void {}

  seleccionado(ev: any) {
    localStorage.setItem('local', ev);
    this.localesStorage = localStorage.getItem('local');
    console.log(this.localesStorage);
  }
}
