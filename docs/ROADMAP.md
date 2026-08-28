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
| Vague de contenu (+monstres, +classes, +sorts) | Critique | M | ✅ livré (sprint 2) |
| Équilibrage & courbe de difficulté | Critique | M | 🟡 en cours — scaling monstres fait (sprint 2) |
| Boss tous les N étages | Important | M | ✅ livré (sprint 2) |
| Onboarding / tutoriel | Important | S | ⬜ à faire |
| Feedback de combat avancé | Bonus | S | ⬜ à faire |

> **Note équilibrage** — Les monstres montent désormais en PV **et en ATQ**
> avec la profondeur, et les boss verrouillent la sortie tous les 5 étages :
> le combat fait mal (morts en combat dès l'étage 5 en test). Reste à faire un
> vrai passage de tuning (courbe de dégâts/or/prix, variété des menaces) pour
> lisser la difficulté — d'où le statut « en cours » plutôt que « livré ».

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
