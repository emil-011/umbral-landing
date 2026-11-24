/**
 * Schema de FAQ a partir de las preguntas visibles en la página.
 * Google exige que el marcado coincida con el contenido, así que el texto
 * se genera con la misma lista que renderiza la página.
 */
export interface FaqItem {
  q: string;
  a: string;
}

export function faqSchema(faqs: FaqItem[], pageUrl: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
      },
    })),
  };
}
