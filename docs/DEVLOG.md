# Dungestairs — Devlog

Journal des évolutions, du plus récent au plus ancien.

---

## Sprint 3 — Onboarding & feedback de combat (Phase 1)

**Livré**

- **Onboarding / tutoriel** (`HowToPlay.js`) — modal « Comment jouer » ouvert
  automatiquement au tout premier lancement (flag `localStorage`), avec les
  règles essentielles ; bouton **?** en haut à droite pour le rouvrir à tout
  moment. Monté au niveau de `App` (menu + jeu).
- **Feedback de combat avancé**
  - Sort armé : les ennemis ciblables affichent un **anneau jaune pulsé**
    (`Cell` + prop `targetable`), et le hint de la barre de sorts nomme le sort
    (« Click an enemy to cast … »).
  - **Badges de buffs actifs** sur le portrait (ex. « DEF +3 · 2 » = bonus et
    rounds restants), pour rendre les effets de sorts lisibles.

**Vérifié** (navigateur headless) — onboarding : ouverture auto, fermeture,
non-réouverture après reload, réouverture via « ? ». Combat : hint dynamique,
anneau de ciblage présent, badge de buff affiché après un sort. Zéro erreur.

> Phase 1 (MVP jouable) terminée hormis le **tuning fin d'équilibrage**
> (courbe dégâts/or/prix), laissé de côté à la demande.

---

## Sprint 2 — Contenu & difficulté (Phase 1)

Objectif : donner de la tension et de la variété. Trois chantiers de la roadmap.

**Livré**

- **Scaling des monstres** — leurs PV **et leur ATQ** montent avec la
  profondeur (niveau = `1 + depth/4`, effets `stats.atq` dans les skills). Le
  combat n'est plus trivial : un héros défendu prend enfin des dégâts.
- **Vague de contenu** — 3 nouveaux monstres (Bat 🦇, Ogre 👹, Ghost 👻),
  2 nouvelles classes **data-driven** (Ranger 🏹, Berserker 🪓) avec portrait
  emoji (fallback dans `Stats` quand pas d'asset PNG), 5 nouveaux sorts
  (arrow_volley, dodge_roll, cleave, blood_rage, second_wind) et 2 passifs
  (berserk, keen_eye).
- **Boss tous les 5 étages** — roster de boss (Dragon 🐉, Ogre King 👑,
  Reaper ☠️) placés à côté de la clé ; **la clé est verrouillée tant que le
  boss est vivant** (vraie porte). Glyphe agrandi + halo rouge.

**Vérifié** (navigateur headless)
- Menu à 5 classes (Ranger/Berserker + portraits emoji). ✅
- Boss présent à l'étage 5, bloque la clé. ✅
- Combat menaçant : PV tombés à 8% ; **mort en combat au boss** (étage 5). ✅
- Alliés mages → « Arcane Boon » équipés (ATQ 2 → 5). ✅
- Zéro erreur console. ✅

---

## Sprint 1 — Boucle jouable (Phase 1)

Objectif : transformer le prototype en cycle « entrer → looter → mourir →
voir son score → relancer ». Meilleur ratio fun/effort de la roadmap.

**Livré**

- **Butin & équipement** — catalogue d'objets data-driven
  (`src/Content/items.json`), drop pondéré par rareté/profondeur
  (`src/Helper/loot.js`). Les coffres lâchent de l'or **et** parfois un objet
  équipé automatiquement (max 8). Les objets modifient les stats via le
  pipeline `jexl` existant (`CharacterCalculator` réécrit en deltas cumulés,
  chemins `stats.*`, idempotent). Inventaire affiché avec glyphe + couleur de
  rareté + tooltip (`Item.js`).
- **Écran de fin de run** (`DeathScreen.js`) — résumé profondeur / kills / or,
  boutons **Rejouer** (remonte le `Game` via `runId`) et **Menu**.
- **Cases actives** — les pièges infligent des dégâts à la révélation ; les
  alliés soignent (healer) ou offrent une bénédiction équipable
  (knight → +DEF, mage → +ATQ). Câblé dans `useGame`.
- **SFX Web Audio** (`src/Helper/sound.js`) — coup, crit, K.O., pièce, loot,
  soin, piège, clé, mort. Synthèse à la volée, aucun fichier, `AudioContext`
  paresseux et tolérant aux erreurs.
- Suivi de run (kills, or) + gestion de la mort dans `useGame`.

**Vérifié** (navigateur headless, autoplay jusqu'à l'étage 19)
- Loot fonctionnel : ATQ 2 → 9, DEF 2 → 5, sac rempli (8 objets). ✅
- Descente d'étages + bannière. ✅
- Pièges / alliés déclenchés sans erreur. ✅
- Écran de fin déclenché (mort par pièges vers l'étage 15+), **Rejouer**
  relance une nouvelle run à l'étage 1, **Menu** retourne au menu. ✅
- Zéro erreur console. ✅

**Constat / dette**
- L'**ATQ des monstres ne scale pas** avec la profondeur → un héros défendu ne
  prend quasiment aucun dégât en **combat** ; la seule vraie menace vient des
  **pièges**. Le combat manque de tension. À traiter en priorité côté
  équilibrage (faire monter l'ATQ/variété des monstres avec la profondeur).

---

## Antérieur

- **Couche visuelle** — glyphes emoji animés (monstres, clé, coffres),
  textes flottants de combat (dégâts, crit, soin, poison, +or, K.O.),
  bannière d'étage, flash sur le portrait. Fix : les cases fermées ne
  révèlent plus leur barre de vie.
- **Fix rendu combat** — `clickOnCell` ne mute plus les cellules en place
  (le plateau ne se re-rendait pas ; PV des monstres figés).
- **Migration CRA → Vite** — build rapide, `import.meta.glob`, Flow retiré,
  lockfile yarn unique.
- **Fix build Vercel** — passage à react-scripts 5 (puis remplacé par Vite).
- **Classes data-driven** — sorts (cooldown) + passifs (stat / seuil /
  déclencheur : crit, vol de vie, riposte, poison), moteur de combat instrumenté.
- **Corrections d'état** — profondeur d'étage, mutations React, doublons.
