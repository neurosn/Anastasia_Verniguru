/* Переключатель дневной / ночной темы */
(function(){
  var root = document.documentElement;
  var KEY = 'verniguru-theme';
  function current(){ return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
  function save(t){ try{ localStorage.setItem(KEY, t); }catch(e){} }
  function apply(t){ root.setAttribute('data-theme', t); }

  function build(){
    var b = document.createElement('button');
    b.className = 'theme-toggle';
    b.type = 'button';
    b.innerHTML =
      '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>' +
      '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
    function label(){ var d = current()==='dark'; b.setAttribute('aria-label', d ? 'Включить дневную тему' : 'Включить ночную тему'); b.title = d ? 'Дневная тема' : 'Ночная тема'; }
    label();

    b.addEventListener('click', function(){
      var next = current()==='dark' ? 'light' : 'dark';
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      save(next);
      if (document.startViewTransition && !reduce) {
        var r = b.getBoundingClientRect();
        var x = r.left + r.width/2, y = r.top + r.height/2;
        root.style.setProperty('--tx', x + 'px');
        root.style.setProperty('--ty', y + 'px');
        root.style.setProperty('--tr', Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y)) + 'px');
        root.classList.add('theme-switching');
        var vt = document.startViewTransition(function(){ apply(next); label(); });
        vt.finished.then(function(){ root.classList.remove('theme-switching'); }, function(){ root.classList.remove('theme-switching'); });
      } else {
        root.classList.add('theme-fade');
        apply(next); label();
        setTimeout(function(){ root.classList.remove('theme-fade'); }, 600);
      }
    });
    document.body.appendChild(b);
  }

  // если человек не выбирал тему вручную — следуем настройке телефона/компьютера
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onChange = function(e){ var s=null; try{ s=localStorage.getItem(KEY); }catch(_){} if(!s) apply(e.matches?'dark':'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
