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
    return `${completeHours >= 10 ? completeHours : '0' + completeHours} H ${
      completeMinutes >= 10 ? completeMinutes : '0' + completeMinutes
    } MIN ${seconds >= 10 ? seconds : '0' + seconds} SEC`;
  };

  convertTimeTemplate = (totalTime) => {
    let hours = totalTime / 3600;
    const completeHours = Math.floor(hours);
    hours = hours - completeHours;
    let minutes = hours * 60;
    const completeMinutes = Math.floor(minutes);
    minutes = minutes - completeMinutes;
    const seconds = Math.round(minutes * 60);
    return `${completeHours >= 10 ? completeHours : '0' + completeHours}:${
      completeMinutes >= 10 ? completeMinutes : '0' + completeMinutes
    }:${seconds >= 10 ? seconds : '0' + seconds}`;
  };
}
