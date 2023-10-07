import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotifService {
  //CAPTURAR SOLICITUDES
  private eventChannels: any = {};
  private subscriptions$: Subscription[] = [];

  constructor() {}

  public sendEvent<T>(eventName: string, data: T) {
    this.registerEvent<T>(eventName);
    (this.eventChannels[eventName] as Subject<T>).next(data);
  }

  public subscribeEvent<T>(
    eventName: string,
    cb: (data: T) => any
  ): Subscription {
    this.registerEvent<T>(eventName);
    let subscribe = this.eventChannels[eventName].subscribe(cb);
    this.subscriptions$.push(subscribe);
    return subscribe;
  }

  ngOnDestroy() {
    // _.forEach(this.eventChannels, (name, subject) => subject.complete());
    this.subscriptions$.forEach((sub) => sub.unsubscribe());
  }

  private registerEvent<T>(eventName: string) {
    if (!(eventName in this.eventChannels)) {
      this.eventChannels[eventName] = new Subject<T>();
    }
  }
  //FIN CAPTURAR SOLICITUDES
}
