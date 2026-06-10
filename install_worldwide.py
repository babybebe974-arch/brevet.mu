#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, re

NEW_SCRIPT = r"""<script>
// SMART LEARN — MONÉTISATION WORLDWIDE
// Essai 2 jours · 29€/an · Wise · Email

const MONETIZATION = {
  prix: 29, devise: '€', essaiJours: 2,
  codeMaitre: 'Entrepotes974NawalWassil',
  wiseUrl: 'https://wise.com/pay/r/UeBUFQoUY_B5FYE',
  email: 'smartlearn.mu@gmail.com',
  STORAGE_KEYS: { trialStart: 'brevet_start', paidValid: 'brevet_paid' }
};

function estEnEssai() {
  var s = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!s) return true;
  return (Date.now() - parseInt(s)) / 86400000 < MONETIZATION.essaiJours;
}
function essaiExpire() {
  var s = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!s) return false;
  return (Date.now() - parseInt(s)) / 86400000 >= MONETIZATION.essaiJours;
}
function aAccesComplet() {
  if (localStorage.getItem(MONETIZATION.STORAGE_KEYS.paidValid) === 'true') return true;
  return estEnEssai();
}
function aAccesPayant() {
  return localStorage.getItem(MONETIZATION.STORAGE_KEYS.paidValid) === 'true';
}
function joursRestantsEssai() {
  var s = localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart);
  if (!s) return MONETIZATION.essaiJours;
  return Math.max(0, Math.ceil(MONETIZATION.essaiJours - (Date.now() - parseInt(s)) / 86400000));
}
function validerCode(code, callback) {
  var PROXY = 'https://script.google.com/macros/s/AKfycbxxQCRDZvKAb9fuXkDslK7LYMXjcIrIi-_EpA8DWT1-tTelSpYcMxPkiSPG5bKheLTY/exec';
  var payload = JSON.stringify({ userId: localStorage.getItem('user_id') || 'anon', action: 'valider_code', code: code.trim(), source: document.title || '' });
  fetch(PROXY, { method: 'POST', body: new URLSearchParams({ data: payload }) })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.success) {
        localStorage.setItem(MONETIZATION.STORAGE_KEYS.paidValid, 'true');
        if (callback) callback({ success: true, message: '\u2705 Acc\u00e8s d\u00e9bloqu\u00e9 !' });
      } else {
        if (callback) callback({ success: false, message: '\u274c ' + (data.error || 'Code invalide.') });
      }
    }).catch(function() { if (callback) callback({ success: false, message: '\u274c V\u00e9rifiez votre connexion.' }); });
}
function creerBanniere() {
  if (document.getElementById('monet-banner') || aAccesPayant()) return;
  var j = joursRestantsEssai(), expire = essaiExpire();
  var bg = expire ? '#e87a7a' : '#e8c87a', col = expire ? '#fff' : '#09090f';
  var texte = expire ? '\u26a0\ufe0f Essai termin\u00e9 \u2014 Corrections IA bloqu\u00e9es'
    : '\U0001f4a1 Essai gratuit \u2014 <strong>J-' + j + '</strong> ' + (j <= 1 ? 'jour restant' : 'jours restants') + ' \u2014 Acc\u00e8s complet <strong>29\u20ac/an</strong>';
  var b = document.createElement('div');
  b.id = 'monet-banner';
  b.innerHTML = '<style>#monet-banner{position:sticky;top:0;left:0;right:0;background:' + bg + ';color:' + col + ';font-family:"DM Sans",Arial,sans-serif;font-size:13px;padding:9px 20px;z-index:9998;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;}.monet-banner-btn{padding:5px 16px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;border:none;background:' + col + ';color:' + bg + ';}</style><span>' + texte + '</span><button class="monet-banner-btn" onclick="afficherOverlay()">\U0001f513 D\u00e9bloquer l\'acc\u00e8s</button>';
  document.body.insertBefore(b, document.body.firstChild);
}
function afficherOverlay() {
  if (document.getElementById('monet-overlay')) return;
  var canClose = estEnEssai();
  var o = document.createElement('div');
  o.id = 'monet-overlay';
  o.innerHTML = '<style>#monet-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(9,9,15,0.97);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:"DM Sans",Arial,sans-serif;}.monet-card{background:#111118;border:1px solid #2a2a38;border-radius:16px;padding:32px 28px;max-width:460px;width:92%;color:#e8e8f0;text-align:center;}.monet-wise-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 28px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;background:#00b9ff;color:#fff;margin:12px 0;width:100%;box-sizing:border-box;border:none;cursor:pointer;}.monet-input{width:100%;background:#0d0d14;border:1px solid #2a2a38;border-radius:10px;color:#e8e8f0;font-size:15px;padding:12px 16px;text-align:center;outline:none;box-sizing:border-box;margin-bottom:10px;}.monet-btn{padding:11px 24px;border-radius:10px;font-weight:700;font-size:14px;cursor:pointer;border:1px solid rgba(94,207,177,0.3);background:rgba(94,207,177,0.1);color:#5ecfb1;margin:4px;}.monet-btn.ghost{background:transparent;color:#9090a8;border:1px solid #2a2a38;}.monet-msg{font-size:13px;margin-top:10px;min-height:24px;}</style>'
    + '<div class="monet-card">'
    + '<div style="font-size:44px;margin-bottom:10px;">\u23f0</div>'
    + '<div style="font-size:22px;font-weight:800;color:#e8c87a;margin-bottom:8px;">Essai gratuit termin\u00e9</div>'
    + '<div style="font-size:14px;color:#9090a8;margin-bottom:12px;">D\u00e9bloquez l\'acc\u00e8s complet pour continuer.</div>'
    + '<div style="font-size:40px;font-weight:800;color:#5ecfb1;margin:8px 0;">29\u20ac <span style="font-size:16px;color:#9090a8;">/ an</span></div>'
    + '<div style="background:#0d0d14;border-radius:10px;padding:14px;margin:12px 0;text-align:left;font-size:13px;line-height:2;">1\ufe0f\u20e3 Cliquez sur le bouton Wise ci-dessous<br>2\ufe0f\u20e3 Payez <strong>29\u20ac</strong> par carte ou virement<br>3\ufe0f\u20e3 Envoyez votre confirmation \u00e0 <strong>smartlearn.mu@gmail.com</strong><br>4\ufe0f\u20e3 Recevez votre <strong>code d\'activation</strong> par retour</div>'
    + '<a href="https://wise.com/pay/r/UeBUFQoUY_B5FYE" target="_blank" class="monet-wise-btn">\U0001f4b3 Payer 29\u20ac via Wise</a>'
    + '<hr style="border:none;border-top:1px solid #2a2a38;margin:16px 0;">'
    + '<div style="font-size:12px;color:#9090a8;margin-bottom:8px;">Vous avez d\u00e9j\u00e0 un code ?</div>'
    + '<input type="text" class="monet-input" id="monet-code-input" placeholder="Votre code d\'acc\u00e8s\u2026" maxlength="40">'
    + '<div><button class="monet-btn" id="monet-valider">\u2713 Valider le code</button>'
    + (canClose ? '<button class="monet-btn ghost" id="monet-close">Continuer l\'essai</button>' : '')
    + '</div><div class="monet-msg" id="monet-msg"></div></div>';
  document.body.appendChild(o);
  document.getElementById('monet-valider').onclick = function() {
    var code = document.getElementById('monet-code-input').value.trim();
    var msg = document.getElementById('monet-msg');
    if (!code) { msg.style.color='#e87a7a'; msg.textContent='Entrez un code.'; return; }
    msg.style.color='#9090a8'; msg.textContent='V\u00e9rification...';
    validerCode(code, function(r) {
      if (r.success) { msg.style.color='#5ecfb1'; msg.textContent=r.message; setTimeout(function(){document.getElementById('monet-overlay').remove();location.reload();},1500); }
      else { msg.style.color='#e87a7a'; msg.textContent=r.message; }
    });
  };
  var cl = document.getElementById('monet-close');
  if (cl) cl.onclick = function() { document.getElementById('monet-overlay').remove(); };
}
function afficherBlocageEssaiExpire() { afficherOverlay(); }
function initMonetization() {
  if (!localStorage.getItem(MONETIZATION.STORAGE_KEYS.trialStart))
    localStorage.setItem(MONETIZATION.STORAGE_KEYS.trialStart, Date.now().toString());
  if (!localStorage.getItem('user_id'))
    localStorage.setItem('user_id', (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'user_' + Date.now());
  if (aAccesPayant()) return;
  creerBanniere();
  if (essaiExpire()) setTimeout(afficherOverlay, 500);
  setInterval(function() {
    var b = document.getElementById('monet-banner');
    if (b && !aAccesPayant()) b.style.background = essaiExpire() ? '#e87a7a' : '#e8c87a';
  }, 60000);
}
window.aAccesComplet = aAccesComplet;
window.aAccesPayant = aAccesPayant;
window.essaiExpire = essaiExpire;
window.afficherBlocageEssaiExpire = afficherBlocageEssaiExpire;
window.afficherOverlay = afficherOverlay;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initMonetization);
else initMonetization();
</script>"""

# ── Patterns de suppression ────────────────────────────────────
REMOVE_PATTERNS = [
    # blocs <style> contenant #trial-banner
    (r'<style[^>]*>[\s\S]*?#trial-banner[\s\S]*?</style>\s*', re.IGNORECASE),
    # <div id="trial-banner">...</div>
    (r'<div\s+id\s*=\s*["\']trial-banner["\'][^>]*>[\s\S]*?</div>\s*', re.IGNORECASE),
    # <script> contenant brevet_trial_start
    (r'<script[^>]*>[\s\S]*?brevet_trial_start[\s\S]*?</script>\s*', re.IGNORECASE),
    # <script> contenant brevet_access
    (r'<script[^>]*>[\s\S]*?brevet_access[\s\S]*?</script>\s*', re.IGNORECASE),
    # <script src="monetization.js">
    (r'<script[^>]*src\s*=\s*["\']monetization\.js["\'][^>]*>\s*</script>\s*', re.IGNORECASE),
    # <script src="monetization_mu.js">
    (r'<script[^>]*src\s*=\s*["\']monetization_mu\.js["\'][^>]*>\s*</script>\s*', re.IGNORECASE),
    # ligne : document.getElementById('trial-banner').style.display='flex';
    (r'document\.getElementById\s*\(\s*["\']trial-banner["\']\s*\)\s*\.style\.display\s*=\s*["\']flex["\']\s*;\s*', re.IGNORECASE),
    # ancien script inline MONETISATION MAURICE (entier)
    (r'<script>\s*//\s*SMART LEARN\s*[–-]\s*MON.TISATION\s*MAURICE.*?</script>\s*', re.IGNORECASE | re.DOTALL),
]

def supprimer_anciens_blocs(contenu):
    for pattern, flags in REMOVE_PATTERNS:
        contenu = re.sub(pattern, '', contenu, flags=flags)
    return contenu

def injecter_nouveau_script(contenu):
    if '// SMART LEARN — MONÉTISATION WORLDWIDE' in contenu:
        return contenu
    # Remplacer premiere occurrence de </head> uniquement
    contenu = contenu.replace('</head>', NEW_SCRIPT + '\n</head>', 1)
    return contenu

def traiter_fichier(path):
    with open(path, 'r', encoding='utf-8') as f:
        contenu = f.read()
    contenu = supprimer_anciens_blocs(contenu)
    contenu = injecter_nouveau_script(contenu)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(contenu)

def main():
    dossier = os.path.dirname(os.path.abspath(__file__))
    fichiers = sorted([
        os.path.join(dossier, f)
        for f in os.listdir(dossier)
        if f.lower().endswith('.html') and os.path.isfile(os.path.join(dossier, f))
    ])
    if not fichiers:
        print("AUCUN FICHIER HTML TROUVE")
        return
    for path in fichiers:
        nom = os.path.basename(path)
        try:
            traiter_fichier(path)
            print("%s OK" % nom)
        except Exception as e:
            print("%s ERREUR: %s" % (nom, str(e)))

if __name__ == '__main__':
    main()
