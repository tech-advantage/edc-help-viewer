import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfigService } from '../../app/config.service';

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(
    public sanitizer: DomSanitizer,
    public configService: ConfigService
    ) {}

    transform(text: string, search: string): SafeHtml {
      if (search && text) {
        let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        pattern = pattern
          .split(' ')
          .filter((t) => t.length > 0)
          .join('|');
        const regex = new RegExp(pattern, 'gi');
        return this.sanitizer.bypassSecurityTrustHtml(
          text.replace(regex, (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`)
        );
      } else {
        return text;
      }
    }
    // else {

    //   if(this.configService.getConfiguration().httpdServer.url.length == 0){
    //     console.log("heyho dans le 2");

    //     if (search && text) {
          
    //       const regex = new RegExp('(' + search + ')(?!([^<]+)?>)', 'gi');
  
    //       return search.length >= 3
    //         ? this.sanitizer.bypassSecurityTrustHtml(
    //             text.changingThisBreaksApplicationSecurity.replace(
    //               regex,
    //               (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`
    //             )
    //           )
    //         : text;
    //     } else {
    //       return text;
    //     }
        
     // }


      // if(this.configService.getConfiguration().httpdServer.url.length > 0){
      //   if (search && text) {
      //     console.log("heyho dans le 2");
          
      //     const regex = new RegExp('(' + search + ')(?!([^<]+)?>)', 'gi');
  
      //     return search.length >= 3
      //       ? this.sanitizer.bypassSecurityTrustHtml(
      //           text.changingThisBreaksApplicationSecurity.replace(
      //             regex,
      //             (match) => `<span style="font-weight: 600; background: #fff2a8;">${match}</span>`
      //           )
      //         )
      //       : text;
      //   } else {
      //     return text;
      //   }
      // }
   // }
 // }
}
