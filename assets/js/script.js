const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  });

  function toggleFaq(btn) {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  }

  if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.io-fade').forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.io-fade').forEach(el => el.classList.add('is-visible'));
}


// Carrega e inicia o vídeo automaticamente quando o bloco aparece na tela.
// O autoplay em navegadores modernos precisa começar sem som (mute=1).
(function initAutoplayVideoOnScroll() {
  const iframe = document.querySelector('.youtube-autoplay');
  if (!iframe) return;

  const loadVideo = () => {
    if (iframe.dataset.loaded === 'true') return;
    const src = iframe.getAttribute('data-src');
    if (!src) return;
    iframe.setAttribute('src', src);
    iframe.dataset.loaded = 'true';
    const wrap = iframe.closest('.video-embed');
    if (wrap) wrap.classList.add('is-playing');
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadVideo();
          videoObserver.disconnect();
        }
      });
    }, { threshold: 0.35 });
    videoObserver.observe(iframe.closest('.video-embed') || iframe);
  } else {
    loadVideo();
  }
})();


// ============ TRACKING: META PIXEL, GOOGLE TAG E META CAPI ============
(function initTrackingEvents() {
  const PRODUCT_URL = 'https://glicnutri.com/products/diabeticprotein-450g';
  const PRODUCT_NAME = 'GlicProtein 450g';
  const PRODUCT_CATEGORY = 'Landing Page Glicnutri';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  function getFbc() {
    const existing = getCookie('_fbc');
    if (existing) return existing;
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (!fbclid) return '';
    return `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
  }

  function createEventId(prefix) {
    if (window.glicCreateEventId) return window.glicCreateEventId(prefix);
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  }

  function sendMetaCapi(eventName, eventId, customData) {
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      fbp: getCookie('_fbp'),
      fbc: getFbc(),
      customData: Object.assign({
        content_name: PRODUCT_NAME,
        content_category: PRODUCT_CATEGORY,
        currency: 'BRL'
      }, customData || {})
    };

    if (navigator.sendBeacon) {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        if (navigator.sendBeacon('/api/meta-capi', blob)) return;
      } catch (error) {}
    }

    fetch('/api/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function(error) {
      console.warn('Meta CAPI não enviado:', error);
    });
  }

  function trackViewContent() {
    const eventId = createEventId('viewcontent');
    const metaData = {
      content_name: PRODUCT_NAME,
      content_category: PRODUCT_CATEGORY,
      currency: 'BRL'
    };

    if (window.fbq) {
      fbq('track', 'ViewContent', metaData, { eventID: eventId });
    }

    if (window.gtag) {
      gtag('event', 'view_item', {
        item_name: PRODUCT_NAME,
        item_category: PRODUCT_CATEGORY,
        currency: 'BRL'
      });
    }

    sendMetaCapi('ViewContent', eventId, metaData);
  }

  function trackCtaClick(button) {
    const eventId = createEventId('lead');
    const buttonText = (button.textContent || '').trim().replace(/\s+/g, ' ');
    const metaData = {
      content_name: PRODUCT_NAME,
      content_category: PRODUCT_CATEGORY,
      currency: 'BRL',
      button_text: buttonText,
      destination_url: PRODUCT_URL
    };

    if (window.fbq) {
      fbq('track', 'Lead', metaData, { eventID: eventId });
    }

    if (window.gtag) {
      gtag('event', 'click_cta_glicprotein', {
        event_category: 'engagement',
        event_label: buttonText || 'CTA GlicProtein',
        destination_url: PRODUCT_URL
      });
    }

    sendMetaCapi('Lead', eventId, metaData);
  }

  window.addEventListener('load', function() {
    setTimeout(trackViewContent, 600);
  });

  document.querySelectorAll(`a[href^="${PRODUCT_URL}"]`).forEach(function(button) {
    button.addEventListener('click', function() {
      trackCtaClick(button);
    }, { passive: true });
  });
})();
