import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'resizeImage'
})
export class ResizeImagePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: SafeResourceUrl | string, size: number): string {
    let urlString: string = '';

    if (typeof url === 'string') {
      urlString = url;
    } else {
      urlString = url.toString(); // Conversion en chaîne de caractères sécurisée
    }

    // Logique pour redimensionner l'image (exemple simplifié)
    // Ici, vous pouvez manipuler l'URL de l'image pour ajuster la taille
    // Par exemple, ajouter un suffixe ou un paramètre de taille dans l'URL
    return `${urlString}?size=${size}`; // Exemple simplifié
  }
}
