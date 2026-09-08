# Portfolio — Timothee Afonso

Recréation locale en HTML / CSS / JS du site Framer
[timothee-afonso.framer.website](https://timothee-afonso.framer.website).

Aucune dépendance, aucun build : ouvrir `index.html` dans un navigateur suffit.
Pour un serveur local : `python3 -m http.server` puis <http://localhost:8000>.

## Arborescence

```
index.html          Accueil freelance (hero, services, résultats,
                    méthode, à propos, contact) — le détail CV reste
                    dans projects / experience / skill
projects.html       Les 10 projets
experience.html     Les 5 expériences
skill.html          Les 20 compétences
fr/                 Les mêmes 4 pages en français
assets/
  css/style.css     Feuille de styles unique (4 breakpoints, 2 thèmes)
  js/main.js        Apparition au scroll, bascule de thème, formulaire
                    Formspree (ses quelques chaînes existent en FR et en EN)
  fonts/            Poppins (200/400/500/600/700) et Inter — auto-hébergées
  img/              Photo, vignettes de projets, logos, décors SVG
  files/            CV, diplômes et certificat (PDF)
```

## Français / anglais

Le bouton `FR` / `EN` à droite de la pilule de navigation est un simple lien
vers la page équivalente dans l'autre langue : les versions françaises sont des
pages statiques dans `fr/`, pas une traduction par JavaScript. Conséquences :
aucun clignotement au chargement, un `<html lang>` et un `<title>` corrects,
des `<link rel="alternate" hreflang>` exploitables, et un site qui reste lisible
sans JavaScript. La langue se conserve pendant la navigation, puisque tous les
liens d'une page `fr/` pointent vers `fr/`.

Le contenu vit dans deux fichiers du générateur (`gen_data.py` et
`gen_data_fr.py` du dossier de travail) ; dans le site livré, chaque page est
autonome et s'édite directement.

**Contrainte à connaître pour les titres de section** : ils sont en
`white-space: nowrap`, comme sur le site d'origine. Chaque ligne doit donc
rester sous ~695 px, soit environ 12 caractères en capitales à 90 px. C'est la
raison pour laquelle « PROFESSIONNELLES » (865 px) a été remplacé par
« EXPÉRIENCES / ET STAGES ».

## Thème clair / sombre

Le bouton à droite de la pilule de navigation bascule entre les deux thèmes.

- **Par défaut**, le thème suit le réglage du système (`prefers-color-scheme`),
  avec le sombre en repli si aucune préférence n'est exprimée. Pour forcer le
  sombre par défaut, remplacer la ligne du script du `<head>` par
  `if(t!=='light'&&t!=='dark'){t='dark';}`.
- Le choix est mémorisé dans `localStorage` (`theme`). Tant que rien n'a été
  choisi, la page suit les changements de réglage système en direct.
- Le thème est posé sur `<html>` par un petit script du `<head>`, donc **aucun
  clignotement** au chargement. Sans JavaScript, le site reste en sombre.

Les couleurs sont pilotées par des variables CSS regroupées en haut de
`assets/css/style.css` : `:root` pour la marque (orange, lime, encre),
`:root[data-theme="dark"]` et `:root[data-theme="light"]` pour le reste.
L'orange `#f46c38` et le vert `#c5ff41` ne changent pas — ils portent
l'identité. Le thème clair repose sur un blanc cassé chaud `#f5f4f1`, une
encre chaude `#171514` et un gris secondaire `#625b57` (contraste 6,1:1),
la carte profil restant blanche avec une bordure fine et une ombre douce.

## Fidélité

La maquette a été relevée sur le site original via Chrome DevTools Protocol
(positions et styles calculés de chaque élément). Les quatre breakpoints de
Framer sont reproduits — ≥ 1440, 1080–1439, 810–1079 et ≤ 809 px — et la
hauteur de chaque page correspond à l'original à 1 px près, dans les deux
thèmes.

## Deux écarts assumés

1. **Formulaire de contact** — envoi via [Formspree](https://formspree.io/f/xljewzve)
   (AJAX, sans rechargement) vers `timothee.afonso.pro@gmail.com`. Le premier
   envoi peut exiger une confirmation Formspree dans la boîte mail.
2. **Boutons « + »** — inertes sur le site original ; ici ils renvoient vers
   `projects.html` et `skill.html`. Pour retrouver le comportement d'origine,
   remplacer les `<a class="more">` par des `<span class="more">`.

Seule autre différence visible : la pilule de navigation s'élargit pour
accueillir les boutons de thème et de langue (elle se resserre sous 480 px et
sous 360 px pour rester d'un seul bloc). Le badge « Made in Framer » du pied de page
n'est volontairement pas repris.
