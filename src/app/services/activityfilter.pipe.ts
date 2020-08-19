import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activityfilter'
})
export class ActivityfilterPipe implements PipeTransform {

  transform(activities: any, term?: any): any {
    if (term === undefined) { return activities; }
    return activities.filter( activity => {
      return activity.name.toLowerCase().includes(term.toLowerCase());
    });
  }
}
