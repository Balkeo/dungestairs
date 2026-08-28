# Dungestairs — Roadmap produit

Version web (design) : https://claude.ai/code/artifact/4742bc6e-cea4-4fb6-8200-afbcdf359408

Ce qui sépare Dungestairs d'un vrai jeu, ce n'est pas une refonte : c'est de la
**profondeur de contenu**, une **structure de run**, du **game feel** et une
couche de **production** (sauvegardes robustes, réglages, tests).

Priorités : `Critique` · `Important` · `Bonus` · `Plus tard`
Effort : `S` (<1 sem) · `M` (1–2 sem) · `L` (3 sem+)

---

## Phase 0 — Fondations (✅ livré)

- Boucle de donjon (révélation, combat au clic, coffres, clé de sortie)
- Classes / sorts / passifs **data-driven** (config JSON)
- Couche visuelle : glyphes emoji animés, textes flottants, bannière d'étage
- Toolchain **Vite** + déploiement Vercel

## Phase 1 — MVP jouable (« rendre le jeu fun »)

| Feature | Priorité | Effort | Statut |
|---|---|---|---|
| Butin & équipement | Critique | L | ✅ livré (sprint 1) |
| Écran de fin de run | Critique | S | ✅ livré (sprint 1) |
| Activer les cases inertes (allié / piège) | Critique | M | ✅ livré (sprint 1) |
| SFX de base (Web Audio) | Important | M | ✅ livré (sprint 1) |
| Vague de contenu (+monstres, +classes, +sorts) | Critique | M | ⬜ à faire |
| Équilibrage & courbe de difficulté | Critique | M | ⬜ à faire *(voir note ci-dessous)* |
| Boss tous les N étages | Important | M | ⬜ à faire |
| Onboarding / tutoriel | Important | S | ⬜ à faire |
| Feedback de combat avancé | Bonus | S | ⬜ à faire |

> **Note équilibrage** — L'ATQ des monstres ne scale pas avec la profondeur :
> un héros défendu ne prend quasiment aucun dégât en combat (la seule vraie
> menace vient des pièges, d'où des morts autour de l'étage 15+). Le combat
> manque de tension. À traiter en priorité (ATQ/variété des monstres qui
> montent avec la profondeur) pour rendre les runs réellement tendues.

## Phase 2 — Prêt pour la 1.0

- Versionnage des sauvegardes + migration *(Critique, S)*
- Écran de réglages (mute, reset save) *(Critique, S)*
- Polish mobile & responsive *(Critique, M)*
- Méta-progression & déblocages *(Important, M)*
- Passe artistique cohérente *(Important, L)*
- Page d'accueil / itch.io *(Important, S)*
- Succès & statistiques *(Bonus, M)*
- Accessibilité *(Bonus, S)*
- Analytics respectueux *(Bonus, S)*

## Phase 3 — Jeu vivant (rétention)

- Backend + comptes + cloud save *(Important, L)*
- Défi quotidien / runs seedées *(Bonus, M)*
- Classements *(Bonus, M)*
- Cadence de contenu live *(Bonus, continu)*
- Monétisation (à décider) *(Plus tard, M)*

## Chantier transverse (continu)

- Tests automatisés (Vitest sur le combat + smoke e2e)
- Error boundaries + crash reporting
- Refonte de l'état (le `useState` s'étale)
- Budget de performance

## Risques

- **L'équilibrage est le make-or-break** : un jeu bien codé mais mal réglé n'est pas fun.
- Scope creep du back-end : repousser la Phase 3 tant que la boucle n'est pas prouvée.
- Corruption de sauvegarde : prioriser le versionnage avant toute grosse évolution de données.
- Cohérence artistique : trancher tôt le parti pris visuel.
