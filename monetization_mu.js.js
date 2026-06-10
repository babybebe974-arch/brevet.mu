// ============================================================
// SMART LEARN — MONÉTISATION MAURICE (v1.0)
// Essai 2 jours · 999 Rs · WhatsApp + Juice
// Bannière permanente non fermable
// ============================================================

const MONETIZATION = {
  prix: 999,
  devise: 'Rs',
  dureeAbonnement: 365,
  essaiJours: 2,
  whatsapp: 'https://wa.me/23059459402',
  numeroJuice: '+230 594 59402',
  nomBeneficiaire: 'SMART LEARN',
  STORAGE_KEYS: {
    trialStart:       'brevet_start',
    paidValid:        'brevet_paid',
    lastReminder:     'brevet_last_reminder'
  }
};

// ============================================================
// FONCTIONS D'ÉTAT
// ============================================================

function estEnEssai() {
  var start = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!start) return true;
  var joursEcoules = (Date.now() - parseInt(start)) / (1000 * 60 * 60 * 24);
  return joursEcoules < MONETIZATION.essaiJours;
}

function essaiExpire() {
  var start = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!start) return false;
  var joursEcoules = (Date.now() - parseInt(start)) / (1000 * 60 * 60 * 24);
  return joursEcoules >= MONETIZATION.essaiJours;
}

function aAccesComplet() {
  if (localStorage.getItem(MONETIZATION.STORAGE_KEYS.paidValid) === 'true') return true;
  return estEnEssai();
}

function aAccesPayant() {
  return localStorage.getItem(MONETIZATION.STORAGE_KEYS.paidValid) === 'true';
}

function joursRestantsEssai() {
  var start = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!start) return MONETIZATION.essaiJours;
  var joursEcoules = (Date.now() - parseInt(start)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(MONETIZATION.essaiJours - joursEcoules));
}


// ============================================================
// VALIDATION CODE
// ============================================================

function validerCode(codeSaisi, callback) {
  var PROXY = 'https://script.google.com/macros/s/AKfycbxxQCRDZvKAb9fuXkDslK7LYMXjcIrIi-_EpA8DWT1-tTelSpYcMxPkiSPG5bKheLTY/exec';
  var payload = JSON.stringify({
    userId: localStorage.getItem('user_id') || 'anon',
    action: 'valider_code',
    code: codeSaisi.trim(),
    source: document.title || ''
  });

  var timeout = new Promise(function(_, reject) {
    setTimeout(function() { reject(new Error('Timeout')); }, 10000);
  });

  var req = fetch(PROXY, {
    method: 'POST',
    body: new URLSearchParams({ data: payload })
  }).then(function(r) { return r.json(); });

  Promise.race([req, timeout]).then(function(data) {
    if (data && data.success === true) {
      localStorage.setItem(MONETIZATION.STORAGE_KEYS.paidValid, 'true');
      if (callback) callback({ success: true, message: '✅ Code valide ! Accès débloqué.' });
    } else {
      if (callback) callback({ success: false, message: '❌ ' + (data && data.error ? data.error : 'Code invalide.') });
    }
  }).catch(function() {
    if (callback) callback({ success: false, message: '❌ Vérifiez votre connexion.' });
  });
}

// ============================================================
// BANNIÈRE PERMANENTE NON FERMABLE
// ============================================================

function creerBanniere() {
  if (document.getElementById('monet-banner') || aAccesPayant()) return;

  var banner = document.createElement('div');
  banner.id = 'monet-banner';

  var j = joursRestantsEssai();
  var expire = essaiExpire();

  var bg      = expire ? '#e87a7a' : '#e8c87a';
  var couleur = expire ? '#fff'    : '#09090f';
  var btnBg   = expire ? '#fff'    : '#09090f';
  var btnCol  = expire ? '#e87a7a' : '#e8c87a';

  var texte = expire
    ? '⚠️ Essai gratuit terminé — Corrections IA bloquées'
    : '🆓 Essai gratuit — <strong>J-' + j + '</strong> ' + (j <= 1 ? 'jour restant' : 'jours restants') + ' — Accès complet <strong>999 Rs/an</strong>';

  banner.innerHTML = '<style>' +
    '#monet-banner{position:sticky;top:0;left:0;right:0;background:' + bg + ';color:' + couleur + ';' +
    'font-family:"DM Sans","Segoe UI",Arial,sans-serif;font-size:13px;padding:9px 20px;z-index:9998;' +
    'display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}' +
    '.monet-banner-btn{padding:5px 16px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;' +
    'border:none;background:' + btnBg + ';color:' + btnCol + ';white-space:nowrap;}' +
    '.monet-banner-btn:hover{opacity:0.85;}' +
    '</style>' +
    '<span>' + texte + '</span>' +
    '<button class="monet-banner-btn" onclick="afficherOverlay()">💬 Débloquer via WhatsApp</button>';

  document.body.insertBefore(banner, document.body.firstChild);
}

function mettreAJourBanniere() {
  var banner = document.getElementById('monet-banner');
  if (!banner || aAccesPayant()) return;
  var j = joursRestantsEssai();
  var expire = essaiExpire();
  banner.style.background = expire ? '#e87a7a' : '#e8c87a';
  banner.style.color = expire ? '#fff' : '#09090f';
}

// ============================================================
// OVERLAY BLOQUANT — WHATSAPP JUICE MAURICE
// ============================================================

function afficherOverlay() {
  if (document.getElementById('monet-overlay')) return;

  var canClose = estEnEssai(); // fermable seulement si essai encore en cours

  var overlay = document.createElement('div');
  overlay.id = 'monet-overlay';
  overlay.innerHTML = '<style>' +
    '#monet-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(9,9,15,0.97);' +
    'z-index:99999;display:flex;align-items:center;justify-content:center;' +
    'font-family:"DM Sans","Segoe UI",Arial,sans-serif;backdrop-filter:blur(8px);}' +
    '#monet-overlay.hidden{display:none!important;}' +
    '.monet-card{background:#111118;border:1px solid #2a2a38;border-radius:16px;padding:32px 28px;' +
    'max-width:460px;width:92%;color:#e8e8f0;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);}' +
    '.monet-title{font-size:22px;font-weight:800;margin-bottom:8px;color:#e8c87a;}' +
    '.monet-sub{font-size:14px;color:#9090a8;margin-bottom:16px;line-height:1.6;}' +
    '.monet-price{font-size:40px;font-weight:800;color:#5ecfb1;margin:8px 0;}' +
    '.monet-price small{font-size:16px;color:#9090a8;}' +
    '.monet-steps{background:#0d0d14;border-radius:10px;padding:14px 18px;margin:16px 0;' +
    'text-align:left;font-size:13px;line-height:2;}' +
    '.monet-steps strong{color:#e8e8f0;}' +
    '.monet-wa-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;' +
    'border-radius:12px;font-weight:800;font-size:15px;cursor:pointer;text-decoration:none;' +
    'border:none;background:#25D366;color:#fff;margin:8px 0;width:100%;justify-content:center;' +
    'box-sizing:border-box;}' +
    '.monet-wa-btn:hover{background:#20bd5a;}' +
    '.monet-divider{border:none;border-top:1px solid #2a2a38;margin:18px 0;}' +
    '.monet-input{width:100%;background:#0d0d14;border:1px solid #2a2a38;border-radius:10px;' +
    'color:#e8e8f0;font-size:15px;padding:12px 16px;text-align:center;outline:none;' +
    'box-sizing:border-box;font-family:"DM Mono",monospace;margin-bottom:10px;}' +
    '.monet-input:focus{border-color:#5ecfb1;}' +
    '.monet-btn{padding:11px 24px;border-radius:10px;font-weight:700;font-size:14px;' +
    'cursor:pointer;border:none;margin:4px;background:rgba(94,207,177,0.1);' +
    'color:#5ecfb1;border:1px solid rgba(94,207,177,0.3);}' +
    '.monet-btn:hover{background:rgba(94,207,177,0.2);}' +
    '.monet-btn.ghost{background:transparent;color:#9090a8;border:1px solid #2a2a38;}' +
    '.monet-btn.ghost:hover{border-color:#9090a8;}' +
    '.monet-msg{font-size:13px;margin-top:10px;min-height:32px;}' +
    '.monet-msg.success{color:#5ecfb1;}' +
    '.monet-msg.error{color:#e87a7a;}' +
    '</style>' +
    '<div class="monet-card">' +
    '<div style="font-size:44px;margin-bottom:10px;">⏰</div>' +
    '<div class="monet-title">Essai gratuit terminé</div>' +
    '<div class="monet-sub">Débloquez l\'accès complet pour continuer à utiliser le correcteur IA.</div>' +
    '<div class="monet-price">999 Rs <small>/ an</small></div>' +
    '<div class="monet-steps">' +
    '1️⃣ Envoyez <strong>999 Rs</strong> par Juice au <strong>' + MONETIZATION.numeroJuice + '</strong><br>' +
    '2️⃣ Envoyez la <strong>capture du paiement</strong> sur WhatsApp<br>' +
    '3️⃣ Recevez votre <strong>code d\'activation</strong> par retour' +
    '</div>' +
    '<a href="' + MONETIZATION.whatsapp + '?text=' + encodeURIComponent('Bonjour, je souhaite débloquer Hub Brevet 2026 (999 Rs). Je vous envoie ma capture Juice.') + '" ' +
    'target="_blank" class="monet-wa-btn">💬 Contacter sur WhatsApp</a>' +
    '<hr class="monet-divider">' +
    '<div style="font-size:12px;color:#9090a8;margin-bottom:10px;">Vous avez déjà reçu un code ?</div>' +
    '<input type="text" class="monet-input" id="monet-code-input" placeholder="Entrez votre code d\'accès" maxlength="40">' +
    '<div>' +
    '<button class="monet-btn" id="monet-valider-btn">✓ Valider le code</button>' +
    (canClose ? '<button class="monet-btn ghost" id="monet-close">Continuer l\'essai</button>' : '') +
    '</div>' +
    '<div class="monet-msg" id="monet-msg"></div>' +
    '</div>';

  document.body.appendChild(overlay);

  var validerBtn = document.getElementById('monet-valider-btn');
  var msgDiv     = document.getElementById('monet-msg');
  var codeInput  = document.getElementById('monet-code-input');

  if (validerBtn) {
    validerBtn.onclick = function() {
      var code = codeInput ? codeInput.value.trim() : '';
      if (!code) { msgDiv.className = 'monet-msg error'; msgDiv.textContent = 'Veuillez entrer un code.'; return; }
      validerBtn.disabled = true;
      msgDiv.className = 'monet-msg'; msgDiv.textContent = 'Vérification...';
      validerCode(code, function(result) {
        validerBtn.disabled = false;
        if (result.success) {
          msgDiv.className = 'monet-msg success'; msgDiv.textContent = result.message;
          setTimeout(function() { fermerOverlay(); window.location.reload(); }, 1500);
        } else {
          msgDiv.className = 'monet-msg error'; msgDiv.textContent = result.message;
        }
      });
    };
    if (codeInput) {
      codeInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') validerBtn.click(); });
    }
  }

  var closeBtn = document.getElementById('monet-close');
  if (closeBtn) {
    closeBtn.onclick = function() { fermerOverlay(); };
  }
}

function fermerOverlay() {
  var overlay = document.getElementById('monet-overlay');
  if (overlay) overlay.remove();
}

function afficherBlocageEssaiExpire() { afficherOverlay(); }
function afficherRappelPaiement()     { afficherOverlay(); }

function verifierAccesAvantAction(cb) {
  if (!aAccesComplet()) { afficherOverlay(); return false; }
  if (cb && typeof cb === 'function') cb();
  return true;
}

// ============================================================
// INITIALISATION
// ============================================================

function initialiserEssai() {
  if (!localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart)) {
    localStorage.setItem(MONETIZATION.STORAGE_KEYS.trialStart, Date.now().toString());
    // Notifier le tracker
    setTimeout(function() {
      if (typeof window.track === 'function') {
        window.track('trial_start', { matiere: '', type: 'init' });
      }
    }, 300);
  }
  // Générer userId si absent
  if (!localStorage.getItem('user_id')) {
    var id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'user_' + Date.now();
    localStorage.setItem('user_id', id);
  }
}

function initMonetization() {
  initialiserEssai();
  if (aAccesPayant()) return;

  // Bannière permanente non fermable
  creerBanniere();

  // Si essai expiré → overlay direct
  if (essaiExpire()) {
    setTimeout(function() { afficherOverlay(); }, 500);
  }

  // Mettre à jour la bannière toutes les minutes
  setInterval(mettreAJourBanniere, 60000);
}

// Exposer globalement
window.estEnEssai              = estEnEssai;
window.essaiExpire             = essaiExpire;
window.aAccesComplet           = aAccesComplet;
window.aAccesPayant            = aAccesPayant;
window.joursRestantsEssai      = joursRestantsEssai;
window.validerCode             = validerCode;
window.afficherBlocageEssaiExpire = afficherBlocageEssaiExpire;
window.afficherRappelPaiement  = afficherRappelPaiement;
window.afficherOverlay         = afficherOverlay;
window.fermerOverlay           = fermerOverlay;
window.verifierAccesAvantAction = verifierAccesAvantAction;
window.initMonetization        = initMonetization;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMonetization);
} else {
  initMonetization();
}
