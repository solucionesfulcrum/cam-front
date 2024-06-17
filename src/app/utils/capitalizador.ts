export function capitalizar(texto: string): string {
    if (!texto) return texto;
  
    const palabras = texto.split(' ');
    const palabrasCapitalizadas = palabras.map(palabra => capitalizarPalabra(palabra));
    return palabrasCapitalizadas.join(' ');
  }
  
  function capitalizarPalabra(palabra: string): string {
    if (!palabra) return palabra;
  
    const primeraLetra = palabra.charAt(0).toLocaleUpperCase();
    const restoLetras = palabra.slice(1).toLocaleLowerCase();
    return primeraLetra + restoLetras;
  }