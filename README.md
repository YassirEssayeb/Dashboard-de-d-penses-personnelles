# 📊 Dashboard de Dépenses Personnelles

Une application web moderne, élégante et réactive permettant de suivre et gérer ses dépenses personnelles au quotidien. Conçue avec une esthétique premium dotée de thèmes sombres et d'effets de flou (glassmorphism), cette application offre une expérience utilisateur fluide tout en gardant vos données privées et locales.

---

## 🚀 Fonctionnalités Clés

1. **💰 Budget Mensuel Personnalisable** : Définissez votre budget mensuel directement depuis l'interface grâce à un champ d'édition rapide et interactif.
2. **✍️ Ajout Rapide de Dépense** : Enregistrez en un clin d'œil vos transactions avec description, montant, catégorie et date.
3. **📈 Graphiques Interactifs (Chart.js)** :
   - Un graphique de **répartition par catégorie** (Doughnut).
   - Un graphique d'**évolution mensuelle** (Line chart) pour observer vos habitudes de consommation dans le temps.
4. **⚠️ Alertes Budgétaires Visuelles** :
   - Bannière orange d'avertissement lorsque vous dépassez **80%** de votre budget.
   - Bannière rouge critique en cas de dépassement total de budget.
5. **🔍 Filtrage et Recherche** : Recherchez par mot-clé ou filtrez par catégorie d'achat. Triez également par date ou par montant.
6. **📂 Sauvegarde Locale** : Toutes vos dépenses et configurations budgétaires sont synchronisées en temps réel dans votre navigateur via `localStorage` (aucune inscription ou base de données externe requise).
7. **📤 Export CSV** : Exportez instantanément l'intégralité de vos dépenses dans un fichier Excel/CSV en un clic.
8. **📱 Responsive Design** : Le tableau se transforme automatiquement en cartes empilées sur les écrans mobiles pour préserver la lisibilité.
9. **🛡️ Sécurité anti-suppression** : Une boîte de dialogue de confirmation vous protège contre les clics accidentels de suppression.

---

## 🛠️ Stack Technique

- **Framework principal** : [React](https://react.dev/) + [Vite](https://vite.dev/) (Build ultra-rapide)
- **Visualisation de Données** : [Chart.js](https://www.chartjs.org/) + [React Chart.js 2](https://react-chartjs-2.js.org/)
- **Iconographie** : [Lucide React](https://lucide.dev/)
- **Stylisation** : CSS Moderne (CSS Variables, Flexbox, CSS Grid, Glassmorphism, animations fluides)

---

## 📦 Démarrage en local

### Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée) sur votre machine.

### Installation

1. Installez les dépendances du projet :
   ```bash
   npm install
   ```

2. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

3. Ouvrez votre navigateur à l'adresse indiquée par Vite (généralement `http://localhost:5173`).

---

## 🚀 Déploiement

### Production Build

Pour compiler l'application en vue d'un déploiement en production, lancez :
```bash
npm run build
```
Cette commande génère un dossier `/dist` contenant les fichiers HTML, CSS et JavaScript optimisés et minifiés.

### Hébergement

Puisque l'application s'appuie uniquement sur des technologies front-end et le stockage local, vous pouvez héberger le dossier `/dist` sur n'importe quel service statique gratuit, tel que :
- **Vercel** (`npx vercel`)
- **Netlify**
- **GitHub Pages**
- **InfinityFree** (en copiant le contenu de `/dist` dans le répertoire `htdocs`)
