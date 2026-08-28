# Dungestairs — Devlog

Journal des évolutions, du plus récent au plus ancien.

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
