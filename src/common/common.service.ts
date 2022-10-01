import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  convertTime = (totalTime) => {
    let hours = totalTime / 3600;
    const completeHours = Math.floor(hours);
    hours = hours - completeHours;
    let minutes = hours * 60;
    const completeMinutes = Math.floor(minutes);
    minutes = minutes - completeMinutes;
    const seconds = Math.round(minutes * 60);
    return `${completeHours} H ${completeMinutes} MIN ${seconds} SEC`;
  };
}
