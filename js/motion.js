/* Анимации появления при прокрутке и полоса прогресса */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(){
    // строки прайса (у них нет своего класса, только встроенные стили)
    var prices = document.querySelectorAll('div[style*="padding: 20px 24px"][style*="display: flex"]');
    prices.forEach(function(el){ el.classList.add('m-price'); });

    if (reduce || !('IntersectionObserver' in window)) { document.documentElement.classList.remove('m-js'); return; }

    // что появляется по очереди
    var items = [].slice.call(document.querySelectorAll(
      '.nav-card, .video-card, .m-price, .tag, .cta-box, .form-group, .link-item'
    ));
    // не трогаем то, что внутри модального окна и уже на первом экране
    items = items.filter(function(el){ return !el.closest('.modal-overlay'); });

    items.forEach(function(el){
      var sibs = [].filter.call(el.parentElement.children, function(c){ return items.indexOf(c) > -1; });
      var i = sibs.indexOf(el);
      el.style.setProperty('--m-d', Math.min(i % 6, 5) * 0.08 + 's');
      el.classList.add('m-item');
    });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('m-in');
        io.unobserve(el);
        if (el.classList.contains('m-item')) {
          // после появления возвращаем элементу его родные эффекты наведения
          setTimeout(function(){ el.classList.remove('m-item','m-in'); el.style.removeProperty('--m-d'); }, 1500);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function(el){ io.observe(el); });
    document.querySelectorAll('.section-header').forEach(function(el){ io.observe(el); });

    // полоса прогресса чтения
    var bar = document.createElement('div');
    bar.className = 'm-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function upd(){
      var h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(scrollY / h, 1) : 0) + ')';
      ticking = false;
    }
    addEventListener('scroll', function(){ if(!ticking){ ticking = true; requestAnimationFrame(upd); } }, { passive:true });
    upd();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
