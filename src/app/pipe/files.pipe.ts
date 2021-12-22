import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { containerEnd } from '@angular/core/src/render3/instructions';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'files'
})
export class FilesPipe implements PipeTransform {

  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];

  constructor(private sanitized: DomSanitizer) {}

  transform(value: any, methode: string, arg1: any = null): any {
    let pipe_content;

    switch (methode) {
      case 'filePreview':
        let thumb_size = arg1 ? arg1.size : 90;
        let render_noimage = arg1 && arg1.hasOwnProperty('renderNoImage') ? arg1.renderNoImage : true;
        console.log('render_noimage',render_noimage)
        let storage = value;
        let is_image = storage.contentType.split("/")[0] == "image" ? true : false;
        let image = is_image ? 
        "<img style=\"min-height:"+thumb_size+"px;height:"+thumb_size+"px;min-width:"+thumb_size+"px;max-width:"+thumb_size+"px\" class=\"img-thumbnail\"  src=\""+storage.downloadURLs[0]+"\">" 
        : "<i class=\"fa fa-minus\"></i>";
        if(render_noimage){
          pipe_content = this.sanitized.bypassSecurityTrustHtml(image);
        }
        else {
          pipe_content = is_image ? this.sanitized.bypassSecurityTrustHtml(image) : '';
        }
        
      break;

      case 'fileSize':
        pipe_content = this.getFriendlySize(value,2);
      break;
    }

    return pipe_content;
  }

  // Fonction retourne taille fichier en unité adéquate/taille
  getFriendlySize(bytes, precision){
    if ( isNaN( parseFloat( bytes )) || ! isFinite( bytes ) ) return '?';
    let unit = 0;
    while ( bytes >= 1024 ) {
      bytes /= 1024;
      unit ++;
    }
    return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
  }
  

}
