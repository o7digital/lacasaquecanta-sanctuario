export type Language = 'en' | 'es';

export function languageFromPath(pathname: string): Language {
  return pathname.startsWith('/es/') ? 'es' : 'en';
}

export function homeHref(language: Language = 'en') {
  return language === 'es' ? '/es/santuario/' : '/santuario/';
}

export function alternateHref(pathname: string, language: Language) {
  const path = pathname.replace(/^\/es(?=\/)/, '');
  return language === 'es' ? `/es${path}` : path;
}

export const translations = {
  en: {
    pageTitle: 'Stories to find your calm',
    description: 'El Santuario, the journal of La Casa Que Canta. Stories about nature, art, flavours and little rituals to savour at your own pace.',
    skip: 'Skip to content', homeLabel: 'El Santuario, home', mainNav: 'Main navigation',
    journal: 'The journal', perspective: 'Our perspective', discover: 'Discover the house',
    openMenu: 'Open menu', closeMenu: 'Close menu', mobileNav: 'Mobile menu',
    byline: 'A JOURNAL BY LA CASA QUE CANTA', location: 'ZIHUATANEJO, MEXICO',
    tagline: 'STORIES TO FIND YOUR CALM', edition: 'EDITION 01 — OCTOBER 2026',
    coverLabel: 'THE COVER STORY', coverTitle: ['The art of', 'slowing', 'down.'],
    coverIntro: 'Sometimes, all we need is a horizon. And enough time to take it in.',
    enterStory: 'Step inside the story', readCover: 'Read The art of slowing down',
    coverAlt: 'Calm jade-coloured sea and a golden shore at dawn',
    coverCaption: '01 / AN INVITATION TO PAUSE', breathe: 'Breathe.',
    noteLines: ['Small stories. Beautiful pauses.', 'A place to discover everything', 'that makes us'],
    noteEmphasis: 'feel at peace.', welcome: 'Welcome to our world.',
    journalTitle: ['The quieter side', 'of life.'], journalIntro: 'Stories to savour at your own pace.',
    allStories: 'All stories', filterLabel: 'Filter stories by topic', more: 'More stories',
    moment: 'A MOMENT FOR YOU', reread: 'TO READ AND RETURN TO', readStory: 'Read the story',
    minutes: 'MIN READ', storiesIn: 'stories in',
    gardenAlt: 'Frangipani flowers glowing among green leaves', detailCaption: 'BEAUTY IS IN THE DETAILS.',
    manifestoTitle: ['A sanctuary', 'is more than', 'a place.'],
    manifestoBody: ['It is a light that stays with you. A conversation that lingers. The sound of the sea when there is nothing left to say.', 'This journal brings together what inspires our approach to hospitality: nature, beauty and the pleasure of being present.'],
    manifestoLink: 'Discover the spirit of El Santuario',
    closingLabel: 'TAKE THIS FEELING WITH YOU', closingTitle: ['Some stories are read.', 'Others are lived.'],
    discoverFull: 'Discover La Casa Que Canta', footerLines: ['Calm can also be', 'a way of life.'],
    backTop: 'Back to top ↑', demo: 'Editorial concept · Concept stories and images',
    save: 'Save story', saved: 'Story saved', saveError: 'Unable to save in this browser',
    heroCaption: 'A GLIMPSE OF THE ART OF SLOW LIVING · CONCEPT IMAGE',
    asideLines: ['Stories to find', 'your calm.'], backJournal: '← Back to the journal',
    continueReading: 'Keep reading ↗', journey: 'THE JOURNEY CONTINUES', stay: ['Stay', 'a little longer.'],
    categories: { Naturaleza: 'Nature', Rituales: 'Rituals', 'Arte y oficio': 'Art & craft', Sabores: 'Flavours', 'Vida en la casa': 'Life at the house' },
  },
  es: {
    pageTitle: 'Historias para habitar la calma',
    description: 'El Santuario, el diario de La Casa Que Canta. Historias sobre naturaleza, arte, sabores y pequeños rituales para disfrutar sin prisa.',
    skip: 'Ir al contenido', homeLabel: 'El Santuario, inicio', mainNav: 'Navegación principal',
    journal: 'El diario', perspective: 'Nuestra mirada', discover: 'Descubrir la casa',
    openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', mobileNav: 'Menú móvil',
    byline: 'UN DIARIO DE LA CASA QUE CANTA', location: 'ZIHUATANEJO, MÉXICO',
    tagline: 'HISTORIAS PARA HABITAR LA CALMA', edition: 'EDICIÓN 01 — OCTUBRE 2026',
    coverLabel: 'LA HISTORIA DE PORTADA', coverTitle: ['El arte de', 'no tener', 'prisa.'],
    coverIntro: 'A veces, lo único que necesitamos es un horizonte. Y el tiempo suficiente para mirarlo.',
    enterStory: 'Adentrarse en la historia', readCover: 'Leer El arte de no tener prisa',
    coverAlt: 'Mar tranquilo de color jade y una orilla dorada al amanecer',
    coverCaption: '01 / UNA INVITACIÓN A DETENERSE', breathe: 'Respira.',
    noteLines: ['Pequeñas historias. Grandes pausas.', 'Un lugar para descubrir todo aquello', 'que nos hace'],
    noteEmphasis: 'sentir en paz.', welcome: 'Bienvenido a nuestro mundo.',
    journalTitle: ['El lado sereno', 'de la vida.'], journalIntro: 'Lecturas para disfrutar sin prisa.',
    allStories: 'Todas las historias', filterLabel: 'Filtrar historias por tema', more: 'Más historias',
    moment: 'UN MOMENTO PARA TI', reread: 'PARA LEER Y VOLVER A LEER', readStory: 'Leer la historia',
    minutes: 'MIN DE LECTURA', storiesIn: 'historias en',
    gardenAlt: 'Flores de frangipani iluminadas entre hojas verdes', detailCaption: 'LA BELLEZA ESTÁ EN LOS DETALLES.',
    manifestoTitle: ['Un santuario', 'no es solo', 'un lugar.'],
    manifestoBody: ['Es una luz que se queda contigo. Una conversación que se alarga. El sonido del mar cuando ya no hay nada que decir.', 'Este diario reúne lo que inspira nuestra forma de entender la hospitalidad: naturaleza, belleza y el placer de estar presente.'],
    manifestoLink: 'Conoce el espíritu de El Santuario',
    closingLabel: 'LLEVA CONTIGO ESTA SENSACIÓN', closingTitle: ['Hay historias que se leen.', 'Y otras que se viven.'],
    discoverFull: 'Descubrir La Casa Que Canta', footerLines: ['La calma también', 'puede ser una forma de vivir.'],
    backTop: 'Volver arriba ↑', demo: 'Propuesta editorial · Textos e imágenes de concepto',
    save: 'Guardar lectura', saved: 'Lectura guardada', saveError: 'No se pudo guardar en este navegador',
    heroCaption: 'UNA MIRADA AL ARTE DE VIVIR SIN PRISA · IMAGEN DE CONCEPTO',
    asideLines: ['Historias para', 'habitar la calma.'], backJournal: '← Volver al diario',
    continueReading: 'Seguir leyendo ↗', journey: 'EL VIAJE CONTINÚA', stay: ['Quédate', 'un poco más.'],
    categories: { Naturaleza: 'Naturaleza', Rituales: 'Rituales', 'Arte y oficio': 'Arte y oficio', Sabores: 'Sabores', 'Vida en la casa': 'Vida en la casa' },
  },
};

export function getI18n(url: URL) {
  const lang = languageFromPath(url.pathname);
  return { lang, copy: translations[lang], home: homeHref(lang),
    hotel: lang === 'es' ? 'https://www.lacasaquecanta.com/es' : 'https://www.lacasaquecanta.com/' };
}
