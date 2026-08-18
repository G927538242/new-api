/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import type { DocPage } from './content'

export const docCategoriesFr = [
  "Prise en main",
  "Guide d'intégration",
  "Référence API",
  "Plateforme",
] as const

export const docPagesFr: DocPage[] = [
  {
    id: "introduction",
    title: "Présentation du produit",
    category: "Prise en main",
    content: `# Présentation du produit

LingyiYun（零一云）est une plateforme nationale de passerelle de modèles IA, compatible avec les normes d'interface IA grand public.

**Quel problème résout-elle ?**

| Problème | Solution LingyiYun |
|---|---|
| Accès instable aux services IA étrangers depuis la Chine | Accès direct via des nœuds domestiques, stable et fiable |
| Différents modèles nécessitent différentes API | Une seule adresse, format d'interface standard, aucun changement de code |
| Modèles étrangers chers | Intégration des modèles nationaux DeepSeek / Qwen, coût plusieurs fois inférieur |
| Gestion complexe de plusieurs modèles | Une seule clé pour appeler tous les modèles, gestion centralisée des quotas |
| Risque de conformité pour l'exportation de données | Données transitant par des canaux nationaux, conformes et contrôlés |

**Fonctionnalités clés**

**Compatibilité des interfaces standard** : compatible avec les formats d'interface IA grand public, il suffit de modifier \`base_url\`, aucun changement de code

**Couverture complète des modèles** : Chat / Embedding / Image / Audio / Vidéo / Modération / Rerank, 11 interfaces

**Priorité aux modèles nationaux** : DeepSeek, Qwen, GLM et autres modèles nationaux prêts à l'emploi, excellent rapport qualité-prix

**Gestion multi-clés** : créez plusieurs clés API dans le panneau d'administration, contrôlez séparément les quotas, les autorisations et les modèles accessibles

**Facturation à l'usage** : facturation précise au niveau du Token, payez uniquement ce que vous consommez, sans minimum de consommation

**Intégration en une ligne**

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)
\`\`\`

**Outils pris en charge :** Cursor, Windsurf, Continue, JetBrains AI, VS Code Copilot, ChatBox, LobeChat, NextChat, Open WebUI et tous les outils prenant en charge les API IA standard.`,
  },
  {
    id: "quick-start",
    title: "Démarrage rapide",
    category: "Prise en main",
    content: `# Démarrage rapide

Ce guide vous permet de configurer votre intégration en 5 minutes.

## Étape 1 : Obtenir une clé API

Toutes les méthodes d'intégration nécessitent une clé API pour l'authentification.

1. Accédez / connectez-vous à la **console d'administration LingyiYun** (/dashboard)
2. Créez et copiez votre clé API sur la page **Gestion des clés API** (ou « API Keys »)
3. Conservez-la précieusement et ne la divulguez à personne

La clé API est un identifiant nécessaire pour toutes les méthodes d'intégration et sera utilisée à plusieurs reprises dans la configuration. Il est recommandé d'obtenir la clé avant de poursuivre.

## Étape 2 : Choisir une méthode d'intégration

LingyiYun prend en charge l'intégration de nombreux clients et outils. Choisissez la méthode adaptée à vos habitudes d'utilisation :

| Méthode d'intégration | Public concerné | Difficulté |
|---|---|---|
| **CC Switch** (recommandé) | Besoin de gérer plusieurs outils IA (Claude Code / Codex / Claude Desktop, etc.), préférence pour une interface graphique avec bascule en un clic | Facile |
| Client Claude Code | Utilisateurs de l'application de bureau / version terminal de Claude | Facile |
| Codex en ligne de commande | Développeurs préférant le terminal, utilisateurs d'OpenAI Codex | Facile |
| Appel direct de l'API | Développeurs intégrant via leur propre code | Moyen |
| Outils de programmation IA (Cursor / Windsurf, etc.) | Utilisateurs d'assistance IA dans leur IDE | Facile |

---

## Méthode 1 : CC Switch (recommandé)

CC Switch est un outil open source à interface graphique qui permet de gérer de manière unifiée les fournisseurs de plusieurs outils IA (Claude Code, Claude Desktop, Codex, etc.) et de basculer en un clic. C'est la solution la plus pratique.

### Installer CC Switch (version v3.16.5 ou supérieure)

**Utilisateurs macOS (Homebrew recommandé) :**

\`\`\`bash
brew install --cask cc-switch
\`\`\`

**Autres systèmes :** visitez [CC Switch Releases](https://github.com/farion1231/cc-switch/releases) pour télécharger le programme d'installation correspondant à votre plateforme :

- macOS : \`.dmg\` / \`.zip\`
- Windows : version d'installation \`.msi\` / version portable \`.zip\`
- Linux : \`.deb\` / \`.rpm\` / \`.AppImage\`

> Si Gatekeeper de macOS bloque la première ouverture, allez dans « Réglages système → Confidentialité et sécurité » et cliquez sur « Ouvrir quand même ».

### Configurer LingyiYun comme fournisseur

#### Intégration à Claude Desktop

1. Ouvrez CC Switch, passez à l'onglet **Claude Desktop** en haut de l'interface principale.
2. Cliquez sur le bouton « plus orange » en haut à droite, la boîte de dialogue « Ajouter un nouveau fournisseur » s'affiche.
3. Sélectionnez « Configuration personnalisée » dans « Fournisseurs prédéfinis ».
4. Renseignez les informations suivantes :
   - **Nom du fournisseur** : par exemple \`LingyiYun\`
   - **URL de requête API** : \`{{BASE_URL}}\`
   - **Clé API** : collez la clé obtenue dans la console
   - **Sélection du modèle** : par exemple \`deepseek-v3\` / \`qwen-max\` / \`glm-4\`, etc.
5. Cliquez sur « + Ajouter » pour enregistrer.
6. Cliquez sur « Activer » sur la carte du fournisseur.
7. Redémarrez complètement l'application Claude Desktop pour l'utiliser.

#### Intégration à Codex

1. Ouvrez CC Switch, passez à l'onglet **Codex** en haut de l'interface principale.
2. Cliquez sur « Ajouter un fournisseur » en haut à droite, sélectionnez « Configuration personnalisée ».
3. Renseignez :
   - **URL de requête API** : \`{{BASE_URL}}\`
   - **Clé API** : la clé obtenue dans la console
   - **Sélection du modèle** : recommandé \`deepseek-r1\`, \`glm-4\`
4. Cliquez sur « + Ajouter » → activez ce fournisseur.
5. Redémarrez le processus du terminal Codex en cours d'exécution pour appliquer les changements (Codex ne prend pas en charge le changement à chaud).

---

## Méthode 2 : Client Claude Code

Claude Code est l'assistant de programmation IA officiel en ligne de commande de Claude. Il est recommandé de le gérer via CC Switch (voir Méthode 1), mais vous pouvez aussi l'intégrer manuellement.

### Installer le client Claude Code

Visitez le [site officiel de Claude](https://claude.ai/code/family) pour télécharger et installer la version correspondant à votre système.

### Intégration via CC Switch (recommandé)

Référez-vous aux étapes « Intégration à Claude Desktop » de la Méthode 1 et sélectionnez l'onglet **Claude Code**.

> **Attention utilisateurs Windows :** si vous rencontrez l'erreur \`Virtual Machine Platform not available\`, vous devez activer la « Plateforme de machine virtuelle » :
> 1. \`Win + R\`, saisissez \`optionalfeatures\` et appuyez sur Entrée
> 2. Cochez « Plateforme de machine virtuelle (Virtual Machine Platform) » → OK
> 3. Redémarrez l'ordinateur puis rouvrez le client Claude

---

## Méthode 3 : Codex en ligne de commande

Codex est l'assistant de programmation IA officiel en ligne de commande d'OpenAI.

### Installer Codex

- Il est recommandé d'installer d'abord [Node.js](https://nodejs.org/zh-cn/download/) 22+
- Les utilisateurs macOS peuvent aussi exécuter directement : \`brew install codex\`
- Ou installer via npm :

\`\`\`bash
npm install -g @openai/codex
codex --version  # 显示版本号即安装成功
\`\`\`

### Configurer le fournisseur (configuration à partir de zéro)

**Utilisateurs macOS / Linux :** ouvrez le terminal et exécutez :

\`\`\`bash
mkdir -p ~/.codex && cat > ~/.codex/config.toml <<'EOF'
model_provider = "lingyiyun"
model = "deepseek-r1"
model_reasoning_effort = "high"
[model_providers.lingyiyun]
name = "零一云"
base_url = "{{BASE_URL}}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
EOF
\`\`\`

**Utilisateurs Windows (PowerShell) :**

\`\`\`powershell
New-Item -ItemType Directory -Force -Path "$HOME\.codex" | Out-Null
@'
model_provider = "lingyiyun"
model = "deepseek-r1"
model_reasoning_effort = "high"
[model_providers.lingyiyun]
name = "零一云"
base_url = "{{BASE_URL}}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"
'@ | Set-Content -Path "$HOME\.codex\config.toml" -Encoding UTF8
\`\`\`

### Définir la variable d'environnement de la clé API

Remplacez \`<votre-clé-API>\` par la clé copiée dans la console :

**macOS :**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.zshrc
source ~/.zshrc
\`\`\`

**Linux :**

\`\`\`bash
echo 'export OPENAI_API_KEY="<你的-API-key>"' >> ~/.bashrc
source ~/.bashrc
\`\`\`

**Windows PowerShell :**

\`\`\`powershell
[Environment]::SetEnvironmentVariable("OPENAI_API_KEY", "<你的-API-key>", "User")
\`\`\`
> Après exécution, fermez puis rouvrez PowerShell pour appliquer les changements.

Une fois terminé, exécutez \`codex\` dans le terminal, les requêtes passeront par LingyiYun.

### Codex déjà installé, modifier la configuration

Le fichier de configuration et les variables d'environnement sont identiques à la « configuration à partir de zéro », il suffit de les écraser.

---

## Méthode 4 : Appel direct de l'API

Si vous écrivez votre propre code, il suffit de modifier une ligne \`base_url\` :

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-key",
    base_url="{{BASE_URL}}/v1"  # 只改这一行
)

resp = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "你好"}]
)
print(resp.choices[0].message.content)
\`\`\`

La description complète des interfaces se trouve dans le chapitre « Référence API » plus loin.

---

## Méthode 5 : Outils de programmation IA

Pour la configuration de Cursor, Windsurf, Continue, JetBrains AI, etc., reportez-vous au chapitre suivant « Utilisation avec les outils de programmation IA ».

---

## Foire aux questions

| Question | Solution |
|---|---|
| Où obtenir la clé API ? | Connectez-vous à la console → Gestion des clés API → Créer une clé |
| La configuration ne prend pas effet ? | Vérifiez que le client a bien été redémarré / que le terminal a été rouvert / que la page a été actualisée |
| Comment changer de modèle ? | Utilisez CC Switch pour basculer en un clic ; ou modifiez le champ \`model\` dans le fichier de configuration / le code |
| Message de quota insuffisant (402) ? | Rechargez ou utilisez une clé avec du quota |
| Message de limite de débit (429) ? | Réessayez plus tard, ou contactez l'administrateur pour augmenter le quota |

Pour plus d'aide, contactez l'équipe de support technique.

---

## 1. Liste des modèles et guide de sélection

### Consulter les modèles disponibles

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`
Dans le résultat, \`data[].id\` correspond à la valeur du paramètre model disponible.

### Modèles Chat

| Modèle | Contexte | Caractéristiques | Cas d'utilisation |
|---|---|---|---|
| \`deepseek-v3\` | 64K | Excellent rapport qualité-prix, fortes capacités en chinois | Conversations quotidiennes, génération de contenu |
| \`deepseek-r1\` | 64K | Modèle à chaîne de raisonnement, processus de pensée visible | Mathématiques, raisonnement logique, débogage de code |
| \`gpt-4o\` | 128K | Multimodal, fortes capacités globales | Tâches complexes, compréhension texte-image |
| \`gpt-4o-mini\` | 128K | Rapide et économique | Scénarios à forte concurrence, conversations simples |
| \`gpt-4.1\` | 1M | Contexte ultra-long | Traitement de documents longs, analyse de codebases |
| \`gpt-4.1-mini\` | 1M | Contexte long + faible coût | Résumé de documents longs |
| \`gpt-4.1-nano\` | 1M | Le plus rapide et le moins cher | Tâches légères : classification, extraction |
| \`o3\` | 200K | Raisonnement renforcé | Raisonnement complexe, problèmes scientifiques |
| \`o4-mini\` | 200K | Raisonnement + faible coût | Tâches de raisonnement quotidiennes |
| \`claude-sonnet-4-20250514\` | 200K | Fort en programmation et raisonnement | Génération de code, analyse |
| \`qwen-max\` | 32K | Optimisé pour le chinois | Scénarios métier en chinois |
| \`qwen-plus\` | 128K | Excellent rapport qualité-prix | Tâches générales en chinois |
| \`glm-4\` | 128K | Bonne compréhension du chinois | Conversations et rédaction en chinois |
| \`gemini-2.5-pro\` | 1M | Contexte ultra-long + multimodal | Documents longs, analyse multimodale |

### Modèles Embedding

| Modèle | Dimensions | Description |
|---|---|---|
| \`text-embedding-3-large\` | 3072 (réductibles) | Haute précision, recommandé en production |
| \`text-embedding-3-small\` | 1536 (réductibles) | Rapide et économique |
| \`text-embedding-ada-002\` | 1536 | Compatible avec les anciennes versions |

### Modèles d'image

| Modèle | Taille maximale | Fonctionnalités |
|---|---|---|
| \`gpt-image-1\` | 1536x1024 | Fond transparent, contrôle du niveau de modération |
| \`dall-e-3\` | 1792x1024 | Haute résolution, choix du style |
| \`dall-e-2\` | 1024x1024 | Génération de base, sorties multiples |

### Modèles vocaux

| Modèle | Utilisation | Description |
|---|---|---|
| \`tts-1\` | Synthèse vocale | Qualité standard |
| \`tts-1-hd\` | Synthèse vocale | Qualité audio HD |
| \`gpt-4o-mini-tts\` | Synthèse vocale | Prise en charge des instructions de style |
| \`whisper-1\` | Reconnaissance vocale / traduction | Multilingue |

### Modèles vidéo

| Modèle | Description |
|---|---|
| \`kling-v2\` | Kuaishou Kling, texte-à-vidéo / image-à-vidéo |
| \`veo-2\` | Génération vidéo Google |
| \`cerve\` | Génération vidéo |

### Modèles Rerank

| Modèle | Description |
|---|---|
| \`cohere-rerank-v3\` | Réordonnancement Cohere, recommandé pour les scénarios RAG |

### Modèles Moderation

| Modèle | Description |
|---|---|
| \`omni-moderation-latest\` | Modération multimodale, prend en charge texte + image |

**Astuce** : les modèles réellement disponibles font foi sur le résultat de \`GET /v1/models\`, la plateforme ajoute régulièrement de nouveaux modèles.

## 2. Quotas et facturation

### Mode de facturation

LingyiYun facture en fonction de l'**utilisation de Tokens**, chaque modèle ayant un prix différent.

**Token d'entrée** (prompt_tokens) : le contenu que vous envoyez au modèle

**Token de sortie** (completion_tokens) : le contenu généré par le modèle

En général, le prix unitaire des tokens de sortie est plus élevé que celui des tokens d'entrée.

### Qu'est-ce qu'un Token

Le Token est l'unité de base du traitement du texte par les modèles. Conversion approximative :

| Langue | 1 Token ≈ |
|---|---|
| Anglais | 4 caractères / 0,75 mot |
| Chinois | 1 à 2 caractères |

### Multiplicateurs des modèles

Chaque modèle a un prix différent, converti via des multiplicateurs. En prenant GPT-4o-mini comme référence (multiplicateur 1x) :

| Modèle | Multiplicateur d'entrée | Multiplicateur de sortie | Description |
|---|---|---|---|
| gpt-4o-mini | 1x | 1x | Référence |
| deepseek-v3 | 0.5x | 0.5x | Moins cher |
| gpt-4o | 5x | 15x | Capacités élevées, prix élevé |
| gpt-4.1 | 10x | 30x | Contexte long |
| claude-sonnet-4 | 6x | 30x | Fort en programmation |

Les multiplicateurs sont donnés à titre indicatif, la configuration réelle du backend fait foi. Les administrateurs peuvent les ajuster dans **Paramètres d'exploitation → Tarifs des modèles**.

### Consulter le quota

Connectez-vous au panneau d'administration, consultez le quota utilisé et le quota restant de la clé dans **Gestion des clés API**.

Ou obtenez la consommation en temps réel via le champ \`usage\` de la réponse.

### Quota épuisé

Lorsque le quota d'une clé est épuisé, la requête renvoie :

\`\`\`json
{
  "error": {
    "message": "Insufficient quota",
    "type": "insufficient_quota",
    "code": "insufficient_quota"
  }
}
\`\`\`
Le code de statut HTTP est \`402\`. Dans ce cas, vous devez recharger ou utiliser une clé avec du quota.

### Facturation selon les interfaces

| Interface | Base de facturation |
|---|---|
| Chat / Responses | Tokens d'entrée + de sortie |
| Embeddings | Tokens d'entrée |
| Images | Facturation par image et par modèle, pas en Tokens |
| Audio TTS | Facturation par nombre de caractères en entrée |
| Audio STT / Translation | Facturation par durée audio |
| Video | Facturation à l'utilisation |
| Moderation | Tokens d'entrée (généralement très peu) |
| Rerank | Tokens d'entrée |

## 3. Limites de débit

### Dimensions des limites

| Dimension | Signification |
|---|---|
| RPM | Requests Per Minute, nombre de requêtes par minute |
| TPM | Tokens Per Minute, nombre de Tokens par minute |

### Règles de limitation

Les limites sont basées sur la clé **API Key**, chaque clé est calculée indépendamment.

L'administrateur peut définir des limites différentes pour chaque groupe de clés dans le panneau d'administration.

Les limites par défaut varient selon la configuration du déploiement, contactez l'administrateur pour connaître les valeurs exactes.

### Réponse en cas de dépassement

\`\`\`json
{
  "error": {
    "message": "Rate limit reached for default",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
\`\`\`
Code de statut HTTP \`429\`.

### En-têtes de réponse

Les informations de limitation de débit sont renvoyées via les en-têtes de réponse HTTP :

| Header | Signification |
|---|---|
| \`X-RateLimit-Limit\` | Limite totale de la période en cours |
| \`X-RateLimit-Remaining\` | Nombre de requêtes restantes de la période en cours |
| \`X-RateLimit-Reset\` | Heure de réinitialisation de la limite (timestamp Unix) |

### Stratégies d'adaptation

1. **Lire les en-têtes de réponse** : vérifiez \`X-RateLimit-Remaining\` après chaque requête pour anticiper
2. **Limiter avant d'envoyer** : effectuez une limitation locale côté client, n'attendez pas le 429 pour ralentir
3. **Backoff exponentiel** : après un 429, attendez 1s → 2s → 4s → 8s avant de réessayer
4. **Rotation de plusieurs clés** : configurez plusieurs clés et utilisez-les en alternance pour augmenter le débit global
5. **Réduire les tokens inutiles** : simplifiez le prompt, évitez les contextes répétés

#### Appels par lots

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input=["人工智能", "机器学习", "深度学习"]
)
for item in response.data:
    print(f"索引 {item.index}: {len(item.embedding)} 维")
\`\`\`

#### Réduction de dimension

La série \`text-embedding-3\` prend en charge la spécification de la dimension de sortie pour réduire les coûts de stockage :

\`\`\`python
response = client.embeddings.create(
    model="text-embedding-3-large",
    input="人工智能改变世界",
    dimensions=512  # 默认3072维降到512维
)
\`\`\`
La réduction de dimension entraîne une perte de précision. Il est recommandé de partir d'une dimension élevée et de réduire progressivement selon les résultats.

| Paramètre | Recommandation |
|---|---|
| \`model\` | Par défaut \`cohere-rerank-v3\`, le plus polyvalent actuellement |
| \`top_n\` | En général 3 à 5, pas besoin d'en retourner trop |
| \`return_documents\` | Définir \`true\` pour éviter de rechercher le texte original par index |`,
  },
  {
    id: "ai-tools",
    title: "Utilisation avec les outils de programmation IA",
    category: "Prise en main",
    content: `# Utiliser LingyiYun avec les outils de programmation IA

Ce document explique comment intégrer LingyiYun dans les outils de programmation IA populaires tels que Cursor, Windsurf, Continue, afin que ces outils utilisent vos propres modèles et quotas.

## 1. Utiliser LingyiYun dans Cursor

Cursor est l'un des outils de programmation IA les plus populaires et prend en charge les API compatibles personnalisées. LingyiYun est entièrement compatible avec le format d'interface standard ; une fois configuré, il est utilisable.

### 1.1 Ajouter des modèles

1. Ouvrez Cursor, accédez à **Settings → Models**
2. Dans le champ de saisie en bas de **Models Names**, saisissez le nom du modèle souhaité, cliquez sur \`Add model\`

Modèles recommandés :

| Utilisation | Nom du modèle | Description |
|---|---|---|
| Programmation quotidienne | \`deepseek-v3\` | Meilleur rapport qualité-prix, bonne compréhension du chinois, fortes capacités de codage |
| Raisonnement complexe | \`deepseek-r1\` | Modèle à chaîne de raisonnement, adapté au débogage, aux maths, à la logique |
| Conversations générales | \`qwen-max\` | Alibaba Tongyi, excellent en contexte chinois |
| Textes longs | \`qwen-plus\` | Contexte 128K, excellent rapport qualité-prix |
| Rédaction en chinois | \`glm-4\` | Zhipu, bonne compréhension et génération en chinois |

3. Après l'ajout, **activez l'interrupteur du modèle correspondant** dans la liste

### 1.2 Configurer la clé API et l'URL de base

Sur la même page Settings → Models, trouvez la zone de configuration de la clé API :

| Élément de configuration | Contenu à saisir |
|---|---|
| **API Key** | \`sk-your-key\` (votre clé LingyiYun) |
| **Base URL** | \`{{BASE_URL}}/v1\` |

Après avoir rempli, cliquez sur \`Verify\` ; un message de succès indique que la configuration est terminée.

### 1.3 Utiliser les modèles dans Cursor

Une fois la configuration terminée :

1. Ouvrez le panneau Chat de Cursor (raccourci \`Cmd+L\` / \`Ctrl+L\`)
2. Dans la liste déroulante de sélection du modèle, choisissez le modèle que vous venez d'ajouter
3. Dialoguez normalement, toutes les requêtes passeront par LingyiYun

### 1.4 Configurer le contexte documentaire @Docs

La fonctionnalité \`@Docs\` de Cursor permet d'injecter des documents externes comme contexte dans la conversation, afin que le modèle réponde en s'appuyant sur votre documentation API.

Étapes de configuration :

1. Ouvrez Cursor Settings → Features → Docs
2. Cliquez sur \`Add new doc\`
3. Renseignez la configuration :

| Élément de configuration | Valeur |
|---|---|
| **Name** | \`LingyiYun Docs\` |
| **URL** | L'adresse de votre site de documentation |
| **Start URL** (facultatif) | L'adresse de la page d'accueil de la documentation |

4. Cliquez sur \`Save\` pour enregistrer

### 1.5 Utiliser @Docs pour référencer la documentation

Dans Cursor Chat :

1. Saisissez \`@Docs\`, sélectionnez \`LingyiYun Docs\`
2. Saisissez ensuite votre question, par exemple :

\`\`\`
@零一云 Docs 如何使用 Function Calling？
\`\`\`

Cursor récupère automatiquement le contenu de la documentation comme contexte, et le modèle fournit une réponse précise en s'appuyant sur la documentation.

## 2. Utiliser LingyiYun dans Windsurf

Windsurf (anciennement Codeium) prend également en charge les API compatibles standard.

### Étapes de configuration

1. Ouvrez Windsurf Settings → AI Provider
2. Sélectionnez **OpenAI Compatible** ou **Custom Provider**
3. Renseignez la configuration :

| Élément de configuration | Valeur |
|---|---|
| **API Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` ou un autre modèle disponible |

4. Après enregistrement, vous pouvez l'utiliser dans Cascade et Chat

### Configuration via fichier Windsurf

Vous pouvez également modifier directement le fichier de configuration \`~/.windsurf/settings.json\` :

\`\`\`json
{
  "aiProvider": "openai-compatible",
  "openaiCompatible": {
    "baseUrl": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key",
    "models": [
      { "id": "deepseek-v3", "name": "DeepSeek V3" },
      { "id": "deepseek-r1", "name": "DeepSeek R1" },
      { "id": "qwen-max", "name": "Qwen Max" },
      { "id": "glm-4", "name": "GLM-4" }
    ]
  }
}
\`\`\`

## 3. Utiliser LingyiYun dans Continue

Continue est un assistant de programmation IA open source prenant en charge VS Code et JetBrains.

### Étapes de configuration

Modifiez le fichier de configuration Continue \`~/.continue/config.json\` :

\`\`\`json
{
  "models": [
    {
      "title": "零一云 DeepSeek V3",
      "provider": "openai",
      "model": "deepseek-v3",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 DeepSeek R1",
      "provider": "openai",
      "model": "deepseek-r1",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 Qwen Max",
      "provider": "openai",
      "model": "qwen-max",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    },
    {
      "title": "零一云 GLM-4",
      "provider": "openai",
      "model": "glm-4",
      "apiBase": "{{BASE_URL}}/v1",
      "apiKey": "sk-your-key"
    }
  ],
  "tabAutocompleteModel": {
    "title": "零一云 Autocomplete",
    "provider": "openai",
    "model": "deepseek-v3",
    "apiBase": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key"
  },
  "embeddingsProvider": {
    "provider": "openai",
    "model": "text-embedding-3-large",
    "apiBase": "{{BASE_URL}}/v1",
    "apiKey": "sk-your-key"
  }
}
\`\`\`

### Description de la configuration

| Champ | Description |
|---|---|
| \`models\` | Liste des modèles de conversation, apparaîtra dans la liste déroulante de sélection des modèles de Continue |
| \`tabAutocompleteModel\` | Modèle d'auto-complétion de code, un modèle rapide est recommandé (deepseek-v3) |
| \`embeddingsProvider\` | Modèle Embedding pour l'indexation de la base de code |

Après la configuration, redémarrez VS Code / JetBrains ; vous pourrez sélectionner les modèles LingyiYun dans le panneau Continue.

## 4. Utiliser LingyiYun dans VS Code Copilot

GitHub Copilot prend en charge l'intégration d'API tierces via la fonctionnalité de modèles personnalisés de Copilot Chat.

### Étapes de configuration

1. Installez les extensions **GitHub Copilot** et **GitHub Copilot Chat**
2. Ouvrez VS Code Settings → recherchez \`github.copilot.chat\`
3. Configurez un point de terminaison personnalisé (nécessite VS Code 1.90+ et la prise en charge des modèles personnalisés de Copilot)

### Configuration via variables d'environnement

Définissez les variables d'environnement dans le terminal puis lancez VS Code :

\`\`\`bash
export OPENAI_API_KEY=sk-your-key
export OPENAI_BASE_URL={{BASE_URL}}/v1
code .
\`\`\`

**Remarque** : la prise en charge des modèles personnalisés par Copilot évolue en permanence ; la méthode de configuration peut varier selon les versions. Si les modèles personnalisés ne sont pas pris en charge, il est recommandé d'utiliser Cursor ou Continue en alternative.

## 5. Utiliser LingyiYun dans JetBrains AI

L'AI Assistant des IDE JetBrains (IntelliJ IDEA / PyCharm / WebStorm, etc.) prend en charge les points de terminaison personnalisés.

### Étapes de configuration

1. Ouvrez **Settings → Tools → AI Assistant → Providers**
2. Sélectionnez **OpenAI Compatible** ou **Custom Provider**
3. Renseignez :

| Élément de configuration | Valeur |
|---|---|
| **Server URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |
| **Model** | \`deepseek-v3\` ou autre |

4. Cliquez sur \`Test Connection\` pour vérifier
5. Après enregistrement, vous pouvez l'utiliser dans l'AI Assistant

## 6. Utilisation avec des outils de conversation

Si vous souhaitez utiliser les modèles LingyiYun uniquement dans une interface de conversation (plutôt que dans des outils de programmation), vous pouvez procéder comme suit :

### Utiliser des clients tiers

Tous les clients prenant en charge les API personnalisées conviennent :

| Client | Plateforme | Méthode de configuration |
|---|---|---|
| ChatBox | Bureau | Paramètres → API Base URL + Key |
| NextChat | Web | Paramètres → Adresse de l'interface + Key |
| LobeChat | Web/Bureau | Paramètres → Service de modèles → Adresse du proxy + Key |
| Open WebUI | Web | Paramètres → API URL + Key |
| Cherry Studio | Bureau | Paramètres → Adresse API + Key |

Configuration générale :

| Élément de configuration | Valeur |
|---|---|
| API Base URL | \`{{BASE_URL}}/v1\` |
| API Key | \`sk-your-key\` |

## 7. Foire aux questions

### Q : Que faire si la vérification Verify échoue dans Cursor ?

Vérifiez les points suivants :

| Élément à vérifier | Valeur correcte |
|---|---|
| Base URL | \`{{BASE_URL}}/v1\` (avec \`/v1\` à la fin) |
| API Key | Commence par \`sk-\`, sans espaces superflus |
| Nom du modèle | Doit être l'id retourné par \`GET /v1/models\`, attention à la casse |
| Connectivité réseau | \`curl {{BASE_URL}}/v1/models\` doit répondre normalement |

### Q : Le modèle n'apparaît pas dans Cursor ?

- Vérifiez que l'interrupteur du modèle est bien activé
- Quittez Cursor et rouvrez-le
- Vérifiez l'orthographe du nom du modèle (tout en minuscules, par exemple \`deepseek-v3\` et non \`DeepSeek-V3\`)

### Q : L'auto-complétion de code est lente ?

L'auto-complétion de code est sensible à la latence, il est recommandé de :

- Utiliser un modèle rapide : \`deepseek-v3\`
- Éviter les modèles de raisonnement (\`deepseek-r1\`) pour l'auto-complétion
- Les utilisateurs de Continue peuvent configurer un modèle rapide séparé dans \`tabAutocompleteModel\`

### Q : Le modèle renvoie l'erreur \`model_not_found\` dans la conversation ?

Ce modèle n'est pas activé pour votre compte LingyiYun. Contactez l'administrateur pour l'activer, ou utilisez un autre modèle disponible.

### Q : Plusieurs outils peuvent-ils partager la même clé ?

Oui, mais attention :

- Tous les outils partagent le quota de la clé, surveillez la consommation
- Les requêtes simultanées partagent la limite de débit de la clé
- Il est recommandé d'utiliser des clés différentes pour différents outils, afin de faciliter la gestion et le suivi

### Q : Peut-on configurer à la fois d'autres services et LingyiYun ?

**Cursor** : ne prend pas en charge la configuration simultanée de deux points de terminaison ; la configuration la plus récente écrase la précédente. Pour une utilisation simultanée, il est recommandé de passer par Continue ou un autre outil.

**Continue** : oui, il suffit d'ajouter des configurations avec des \`apiBase\` différents dans le tableau \`models\`.

### Q : Le contenu n'est pas référencé après la configuration @Docs ?

- Vérifiez que l'URL de la documentation est accessible publiquement
- Essayez d'ouvrir l'URL configurée dans un navigateur pour confirmer que la page fonctionne
- S'il s'agit d'un site de documentation interne, Cursor pourrait ne pas pouvoir le crawler

### Q : L'indexation Embedding de Continue renvoie une erreur ?

Vérifiez que \`embeddingsProvider\` est correctement configuré :

\`\`\`json
{
  "provider": "openai",
  "model": "text-embedding-3-large",
  "apiBase": "{{BASE_URL}}/v1",
  "apiKey": "sk-your-key"
}
\`\`\`
Si l'erreur persiste, vérifiez que la clé dispose de la permission d'utiliser l'interface Embedding.

## Tableau récapitulatif des configurations

La configuration essentielle de tous les outils ne comporte que deux éléments :

| Élément de configuration | Valeur |
|---|---|
| **Base URL** | \`{{BASE_URL}}/v1\` |
| **API Key** | \`sk-your-key\` |

Points d'entrée de configuration de chaque outil :

| Outil | Point d'entrée de configuration | Description |
|---|---|---|
| Cursor | Settings → Models → API Key | Renseigner Base URL + Key |
| Windsurf | Settings → AI Provider | Sélectionner Compatible |
| Continue | \`~/.continue/config.json\` | Modifier le fichier de configuration |
| JetBrains | Settings → Tools → AI Assistant | Sélectionner Custom Provider |
| ChatBox | Paramètres → API | Renseigner l'adresse + Key |
| LobeChat | Paramètres → Service de modèles | Renseigner l'adresse du proxy + Key |
| NextChat | Paramètres → Interface | Renseigner l'adresse + Key |
| Open WebUI | Paramètres → API | Renseigner API URL + Key |`,
  },
  {
    id: "api-quick-start",
    title: "Démarrage rapide",
    category: "Guide d'intégration",
    content: `# Démarrage rapide

Appel minimal (cURL) :

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}]
  }'
\`\`\`

**Point essentiel** : il suffit de modifier \`base_url\` et \`api_key\` ; le reste du code est identique à l'API officielle d'OpenAI.

### Liste des interfaces prises en charge

| Interface | Méthode | Chemin | Description |
|---|---|---|---|
| Liste des modèles | GET | \`/v1/models\` | Consulter les modèles disponibles |
| Complétion de conversation | POST | \`/v1/chat/completions\` | Interface Chat, prend en charge le streaming |
| Responses | POST | \`/v1/responses\` | OpenAI Responses API, prend en charge le streaming |
| Vectorisation de texte | POST | \`/v1/embeddings\` | Interface Embedding |
| Génération d'images | POST | \`/v1/images/generations\` | Texte-à-image |
| Synthèse vocale | POST | \`/v1/audio/speech\` | TTS, renvoie un flux audio |
| Reconnaissance vocale | POST | \`/v1/audio/transcriptions\` | STT, téléversement d'un fichier audio |
| Traduction vocale | POST | \`/v1/audio/translations\` | Traduction audio vers l'anglais |
| Génération vidéo | POST | \`/v1/video/generations\` | Texte-à-vidéo / image-à-vidéo |
| Modération de contenu | POST | \`/v1/moderations\` | Contrôle de sécurité texte / image |
| Réordonnancement | POST | \`/v1/rerank\` | Classement de pertinence des documents |`,
  },
  {
    id: "get-api-key",
    title: "Obtenir une clé API",
    category: "Guide d'intégration",
    content: `# Obtenir une clé API

1. Connectez-vous au panneau d'administration LingyiYun
2. Accédez à la page des clés API
3. Cliquez sur【Nouvelle clé API】, renseignez le nom et le quota
4. Après création, copiez la clé commençant par \`sk-\`

**Remarque** : la clé n'est affichée qu'une seule fois à la création, enregistrez-la immédiatement. Si vous l'oubliez, vous devrez la supprimer et en créer une nouvelle.

### Format de la clé

\`\`\`
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`
Elle commence par \`sk-\`, suivie d'une chaîne de caractères aléatoires. Lors de l'appel, placez-la dans le champ \`Authorization\` de l'en-tête HTTP.`,
  },
  {
    id: "auth",
    title: "Méthode d'authentification",
    category: "Guide d'intégration",
    content: `# Méthode d'authentification

LingyiYun utilise l'authentification par **Bearer Token** ; toutes les interfaces doivent l'inclure.

### Format de l'en-tête

\`\`\`
Authorization: Bearer sk-your-api-key
\`\`\`

### Exemple cURL

\`\`\`bash
curl {{BASE_URL}}/v1/models \\
  -H "Authorization: Bearer sk-your-api-key"
\`\`\`

### Configuration dans les SDK

\`\`\`python
# Python
client = OpenAI(api_key="sk-your-api-key", base_url="{{BASE_URL}}/v1")
\`\`\`

\`\`\`javascript
// Node.js
const client = new OpenAI({ apiKey: "sk-your-api-key", baseURL: "{{BASE_URL}}/v1" });
\`\`\`

### Comportement en cas d'échec d'authentification

Renvoie le code de statut HTTP \`401\`

Corps de la réponse :

\`\`\`json
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

Causes fréquentes :

- Clé erronée ou préfixe \`sk-\` manquant
- Clé supprimée ou désactivée
- Format d'en-tête incorrect (un seul espace entre \`Bearer\` et \`sk-\`)`,
  },
  {
    id: "request-url",
    title: "Adresse de requête",
    category: "Guide d'intégration",
    content: `# Adresse de requête

### Base URL

\`\`\`
{{BASE_URL}}
\`\`\`

### Règle d'adresse complète

\`\`\`
{Base URL}{Chemin de l'interface}
\`\`\`

Exemples :

| Interface | Adresse complète |
|---|---|
| Chat | \`{{BASE_URL}}/v1/chat/completions\` |
| Responses | \`{{BASE_URL}}/v1/responses\` |
| Embeddings | \`{{BASE_URL}}/v1/embeddings\` |
| Images | \`{{BASE_URL}}/v1/images/generations\` |
| TTS | \`{{BASE_URL}}/v1/audio/speech\` |
| STT | \`{{BASE_URL}}/v1/audio/transcriptions\` |
| Translation | \`{{BASE_URL}}/v1/audio/translations\` |
| Video | \`{{BASE_URL}}/v1/video/generations\` |
| Moderation | \`{{BASE_URL}}/v1/moderations\` |
| Rerank | \`{{BASE_URL}}/v1/rerank\` |
| Models | \`{{BASE_URL}}/v1/models\` |

### Définir la Base URL dans les SDK

Il suffit de définir \`base_url\` sur \`{{BASE_URL}}/v1\` (notez le \`/v1\` à la fin), le SDK concatènera automatiquement les chemins suivants.`,
  },
  {
    id: "error-codes",
    title: "Codes d'erreur",
    category: "Guide d'intégration",
    content: `# Codes d'erreur

### Codes de statut HTTP

| Statut | Signification | Recommandation |
|---|---|---|
| 200 | Succès | Traiter la réponse normalement |
| 400 | Erreur de paramètres de requête | Vérifier le format du corps de la requête et les paramètres obligatoires |
| 401 | Échec d'authentification | Vérifier que la clé API est correcte |
| 402 | Quota insuffisant | Recharger ou utiliser une clé avec du quota |
| 403 | Aucune permission | Cette clé n'a pas le droit d'accéder à ce modèle ou à cette interface |
| 404 | Interface inexistante | Vérifier que le chemin de la requête est correct |
| 429 | Limite de débit dépassée | Réduire la fréquence des requêtes, ou contacter l'administrateur pour augmenter la limite |
| 500 | Erreur interne du serveur | Réessayer plus tard ; si persistant, contacter l'exploitation |
| 502 | Erreur de passerelle | Anomalie du service en amont, réessayer plus tard |
| 503 | Service indisponible | Surcharge temporaire du service, réessayer plus tard |

### Format de réponse d'erreur

Toutes les erreurs suivent un format unifié :

\`\`\`json
{
  "error": {
    "message": "具体错误描述",
    "type": "错误类型",
    "code": "错误码"
  }
}
\`\`\`

### Codes d'erreur courants

| code | Signification | Scénario de déclenchement |
|---|---|---|
| \`invalid_api_key\` | Clé API invalide | Clé erronée, supprimée ou désactivée |
| \`insufficient_quota\` | Quota insuffisant | Solde de la clé épuisé |
| \`model_not_found\` | Modèle inexistant | Paramètre model inexistant transmis |
| \`context_length_exceeded\` | Entrée trop longue | La longueur totale des messages dépasse la fenêtre de contexte du modèle |
| \`rate_limit_exceeded\` | Limite de débit dépassée | Trop de requêtes sur une courte période |
| \`invalid_request_error\` | Erreur de format de requête | Paramètre obligatoire manquant, type incorrect, etc. |
| \`server_error\` | Erreur serveur | Anomalie interne, généralement récupérable en réessayant |

### Recommandations de nouvelle tentative

**429 / 500 / 502 / 503** : réessayable, backoff exponentiel recommandé (1s → 2s → 4s → 8s)

**400 / 401 / 402 / 403 / 404** : ne pas réessayer, corriger d'abord la requête

Maximum 3 nouvelles tentatives pour la même requête`,
  },
  {
    id: "streaming",
    title: "Sortie en streaming",
    category: "Guide d'intégration",
    content: `# Sortie en streaming

Le streaming est utilisé par les interfaces Chat et Responses : le contenu est renvoyé par morceaux, offrant une meilleure expérience utilisateur (pas besoin d'attendre la génération complète pour l'afficher).

### Activer le streaming

Définissez \`stream: true\` dans le corps de la requête :

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "写一首诗"}],
  "stream": true
}
\`\`\`

### Format de réponse (SSE)

La réponse en streaming utilise le protocole **Server-Sent Events (SSE)**, avec un Content-Type de \`text/event-stream\`.

Format de chaque bloc de données :

\`\`\`
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"你"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{"content":"好"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1713833628,"model":"deepseek-v3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
\`\`\`

**Points clés :**

- Chaque donnée commence par \`data: \`, suivie du JSON
- La dernière ligne est \`data: [DONE]\`, indiquant la fin du flux
- Le \`delta.content\` de chaque chunk est le fragment de texte nouvellement ajouté ; en les concaténant, vous obtenez la réponse complète
- \`finish_reason\` égal à \`stop\` indique une fin normale

### Appel streaming en cURL

\`\`\`bash
curl {{BASE_URL}}/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v3",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true
  }'
\`\`\`

### Appel streaming avec le SDK Python

\`\`\`python
from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="{{BASE_URL}}/v1"
)

stream = client.chat.completions.create(
    model="deepseek-v3",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
# 输出：逐字打印的完整回复
\`\`\`

### Appel streaming avec le SDK Node.js

\`\`\`javascript
const stream = await client.chat.completions.create({
    model: "deepseek-v3",
    messages: [{ role: "user", content: "写一首诗" }],
    stream: true,
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
}
\`\`\`

### Informations Usage en streaming

Par défaut, la réponse en streaming **n'inclut pas** usage (consommation de Tokens). Si nécessaire, définissez \`stream_options\` :

\`\`\`json
{
  "model": "deepseek-v3",
  "messages": [{"role": "user", "content": "你好"}],
  "stream": true,
  "stream_options": {"include_usage": true}
}
\`\`\`

Une fois défini, le dernier chunk contiendra le champ usage complet :

\`\`\`json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion.chunk",
  "choices": [{"index": 0, "delta": {}, "finish_reason": "stop"}],
  "usage": {"prompt_tokens": 10, "completion_tokens": 20, "total_tokens": 30}
}
\`\`\`

### Streaming de l'interface Responses

L'API Responses prend également en charge \`stream: true\`, avec un format similaire au Chat, également en protocole SSE, se terminant par \`data: [DONE]\`.

### Points d'attention pour l'analyse manuelle du SSE

Si vous n'utilisez pas de SDK et analysez le flux SSE vous-même, notez les points suivants :

1. **Lire ligne par ligne** : chaque donnée occupe une ligne, commençant par \`data: \`
2. **Ignorer les lignes vides** : dans le protocole SSE, les lignes vides sont des séparateurs d'événements, sans effet sur les données
3. **Détecter la fin** : arrêtez la lecture dès que vous rencontrez \`data: [DONE]\`
4. **Gérer les déconnexions** : en cas d'interruption réseau, vous pouvez réessayer, mais il est impossible de reprendre depuis le point d'arrêt ; vous devez relancer la requête
5. **Réglage du délai d'expiration** : il est recommandé de définir un délai d'expiration HTTP d'au moins 60 secondes, la génération de textes longs pouvant être longue

### Comparaison streaming vs non-streaming

| Dimension | Non-streaming (\`stream: false\`) | Streaming (\`stream: true\`) |
|---|---|---|
| Mode de réponse | Résultat complet renvoyé en une fois | Fragments de texte renvoyés par morceaux |
| Perception utilisateur | Temps d'attente plus long | Apparition progressive, sensation plus rapide |
| Format de réponse | \`chat.completion\` | \`chat.completion.chunk\` |
| Usage | Inclus par défaut | Nécessite \`stream_options\` |
| Cas d'utilisation | Traitement backend par lots, chaînage API | Conversations frontend, interaction en temps réel |
| Difficulté d'analyse | Simple, lecture directe du JSON | Nécessite une analyse SSE |`,
  },
  {
    id: "chat-completions",
    title: "Complétion de conversation",
    category: "Référence API",
    content: `# Complétion de conversation

> **POST** \`/v1/chat/completions\`

Crée une complétion de conversation. Prend en charge les modes streaming (SSE) et non-streaming.

- Non-streaming : définissez \`stream: false\` (par défaut), renvoie une réponse complète
- Streaming : définissez \`stream: true\`, renvoie des ChatCompletionChunk par morceaux en SSE

## Paramètres de la requête

### Paramètres d'en-tête

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`Authorization\` | string | Oui | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | Non | Identifiant unique de la requête, pour le traçage de bout en bout |
| \`X-Tenant-Id\` | string | Non | Identifiant du locataire, pour l'isolation dans les scénarios multi-locataires |
| \`X-Channel\` | enum | Non | Identifiant du canal d'appel (web/app/api/miniapp), défaut api |

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | ID du modèle, ex. \`deepseek-v3\` |
| \`messages\` | array | Oui | Liste des messages de conversation |
| \`temperature\` | number | Non | Température d'échantillonnage, 0~2, défaut 0.7 |
| \`top_p\` | number | Non | Probabilité d'échantillonnage par noyau, 0~1, défaut 1 |
| \`max_tokens\` | integer | Non | Nombre maximal de Tokens générés |
| \`stream\` | boolean | Non | Sortie en streaming ou non, défaut false |
| \`stream_options\` | object | Non | Options de streaming, ex. \`{"include_usage": true}\` |
| \`tools\` | array | Non | Liste des outils appelables |
| \`tool_choice\` | string/object | Non | Stratégie de choix des outils (none/auto/required) |
| \`response_format\` | object | Non | Format de réponse, ex. \`{"type": "json_object"}\` |
| \`stop\` | string/array | Non | Séquence d'arrêt |
| \`presence_penalty\` | number | Non | Pénalité de présence, défaut 0 |
| \`frequency_penalty\` | number | Non | Pénalité de fréquence, défaut 0 |
| \`n\` | integer | Non | Nombre de candidats générés, défaut 1 |
| \`user\` | string | Non | Identifiant utilisateur |

### Exemple de requête

\`\`\`json
{
    "model": "deepseek-v3",
    "messages": [
        {
            "role": "system",
            "content": "你是一个有帮助的助手"
        },
        {
            "role": "user",
            "content": "你好"
        }
    ],
    "stream": false,
    "temperature": 0.7
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/chat/completions' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "deepseek-v3",
    "messages": [
        {
            "role": "system",
            "content": "你是一个有帮助的助手"
        },
        {
            "role": "user",
            "content": "你好"
        }
    ],
    "stream": false,
    "temperature": 0.7
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1713833628,
    "model": "deepseek-v3",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "你好！有什么可以帮你的吗？"
            },
            "finish_reason": "stop"
        }
    ],
    "usage": {
        "prompt_tokens": 15,
        "completion_tokens": 8,
        "total_tokens": 23
    }
}
\`\`\`

### 401 Échec d'authentification`,
  },
  {
    id: "models",
    title: "Lister les modèles disponibles",
    category: "Référence API",
    content: `# Lister les modèles disponibles

> **GET** \`/v1/models\`

Renvoie la liste des modèles actuellement disponibles

## Paramètres de la requête

### Paramètres d'en-tête

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`Authorization\` | string | Oui | \`Bearer sk-your-api-key\` |
| \`X-Request-Id\` | string | Non | Identifiant unique de la requête |
| \`X-Tenant-Id\` | string | Non | Identifiant du locataire |
| \`X-Channel\` | enum | Non | Identifiant du canal d'appel, défaut api |

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/models' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "object": "list",
    "data": [
        {
            "id": "deepseek-v3",
            "object": "model",
            "created": 1700000000,
            "owned_by": "零一云"
        },
        {
            "id": "qwen-plus",
            "object": "model",
            "created": 1700000000,
            "owned_by": "零一云"
        }
    ]
}
\`\`\``,
  },
  {
    id: "responses",
    title: "Responses API",
    category: "Référence API",
    content: `# Responses API

> **POST** \`/v1/responses\`

OpenAI Responses API. Prend en charge les entrées texte et les tableaux de messages, renvoie un objet Response structuré contenant les messages de sortie (output) et l'usage.

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | ID du modèle, ex. \`qwen-plus\` |
| \`input\` | string/array | Oui | Contenu d'entrée, prend en charge une chaîne ou un tableau de messages |
| \`instructions\` | string | Non | Instructions système |
| \`temperature\` | number | Non | Température d'échantillonnage |
| \`max_output_tokens\` | integer | Non | Nombre maximal de Tokens de sortie |
| \`stream\` | boolean | Non | Sortie en streaming ou non, défaut false |
| \`tools\` | array | Non | Liste des outils appelables |
| \`user\` | string | Non | Identifiant utilisateur |

### Exemple de requête

\`\`\`json
{
    "model": "qwen-plus",
    "input": "介绍北京"
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/responses' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "qwen-plus",
    "input": "介绍北京"
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "id": "resp-abc123",
    "object": "response",
    "created_at": 1713833628,
    "model": "qwen-plus",
    "status": "completed",
    "output": [
        {
            "type": "message",
            "id": "msg-001",
            "role": "assistant",
            "content": [
                {
                    "type": "output_text",
                    "text": "北京是中国的首都，拥有超过3000年的建城史和800余年的建都史……"
                }
            ]
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "completion_tokens": 50,
        "total_tokens": 60
    }
}
\`\`\``,
  },
  {
    id: "embeddings",
    title: "Vectorisation de texte",
    category: "Référence API",
    content: `# Vectorisation de texte

> **POST** \`/v1/embeddings\`

Convertit le texte en représentation vectorielle, prend en charge les entrées par lots

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | ID du modèle, ex. \`text-embedding-3-large\` |
| \`input\` | string/array | Oui | Texte d'entrée, prend en charge un élément ou un tableau |
| \`encoding_format\` | enum | Non | Format d'encodage (float/base64), défaut float |
| \`dimensions\` | integer | Non | Dimension du vecteur (uniquement pour la série text-embedding-3) |

### Exemple de requête

\`\`\`json
{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/embeddings' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "text-embedding-3-large",
    "input": "人工智能"
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "object": "list",
    "data": [
        {
            "object": "embedding",
            "index": 0,
            "embedding": [0.0023, -0.0094, 0.0151]
        }
    ],
    "model": "text-embedding-3-large",
    "usage": {
        "prompt_tokens": 4,
        "total_tokens": 4
    }
}
\`\`\``,
  },
  {
    id: "images",
    title: "Générer des images",
    category: "Référence API",
    content: `# Générer des images

> **POST** \`/v1/images/generations\`

Génère une image à partir d'une invite textuelle.

**Correspondance des tailles :**

| Modèle | Tailles prises en charge |
|---|---|
| wanx-v2 | 1024x1024 / 720x1280 / 1280x720 / auto |
| cogview-4 | 1024x1024 / 768x1344 / 1344x768 |
| cogview-3-plus | 1024x1024 / 768x1344 / 1344x768 |

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | Modèle de génération d'images (wanx-v2 / cogview-4 / cogview-3-plus) |
| \`prompt\` | string | Oui | Texte de description de l'image |
| \`n\` | integer | Non | Nombre d'images (1~10, cogview-3-plus ne prend en charge que 1) |
| \`size\` | string | Non | Taille de l'image |
| \`quality\` | enum | Non | Qualité de l'image (low/medium/high/auto) |
| \`background\` | enum | Non | Transparence du fond (transparent/opaque/auto), uniquement wanx-v2 |
| \`moderation\` | enum | Non | Niveau de modération du contenu (low/auto), uniquement wanx-v2 |
| \`response_format\` | enum | Non | Format de retour (url/b64_json), défaut url |
| \`style\` | enum | Non | Style de l'image (vivid/natural), uniquement cogview-3-plus |
| \`user\` | string | Non | Identifiant utilisateur |

### Exemple de requête

\`\`\`json
{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/images/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "wanx-v2",
    "prompt": "未来科技城市",
    "size": "1024x1024",
    "quality": "high",
    "n": 1
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "created": 1713833628,
    "data": [
        {
            "url": "https://cdn.example.com/img-001.png"
        }
    ],
    "usage": {
        "total_tokens": 100,
        "input_tokens": 50,
        "output_tokens": 50
    }
}
\`\`\``,
  },
  {
    id: "tts",
    title: "Synthèse vocale (TTS)",
    category: "Référence API",
    content: `# Synthèse vocale (TTS)

> **POST** \`/v1/audio/speech\`

Synthétise le texte en parole, renvoie un flux audio

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | ID du modèle TTS, ex. \`cosyvoice-v2\` |
| \`voice\` | enum | Oui | Timbre de la voix |
| \`input\` | string | Oui | Texte à synthétiser |
| \`response_format\` | enum | Non | Format audio de sortie (mp3/opus/aac/flac/wav/pcm), défaut mp3 |
| \`speed\` | number | Non | Vitesse de parole (0.25~4), défaut 1 |
| \`instructions\` | string | Non | Instructions de style vocal (uniquement cosyvoice-v2) |

### Exemple de requête

\`\`\`json
{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/speech' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "cosyvoice-v2",
    "voice": "longxiaochun",
    "input": "欢迎使用零一云"
}'
\`\`\`

## Réponse

### 200 Succès

Renvoie le flux audio (binaire), Content-Type: audio/mpeg`,
  },
  {
    id: "stt",
    title: "Reconnaissance vocale (STT)",
    category: "Référence API",
    content: `# Reconnaissance vocale (STT)

> **POST** \`/v1/audio/transcriptions\`

Transcrit un fichier audio en texte

## Paramètres de la requête

### Paramètres du corps (multipart/form-data)

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`file\` | file | Oui | Fichier audio |
| \`model\` | string | Oui | Modèle de reconnaissance vocale, ex. \`sensevoice-v1\` |
| \`language\` | string | Non | Langue de l'audio (ISO 639-1, ex. zh, en) |
| \`response_format\` | enum | Non | Format de sortie (json/text/srt/verbose_json/vtt), défaut json |
| \`temperature\` | number | Non | Température d'échantillonnage |

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/transcriptions' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'language="zh"' \\
--form 'response_format="json"'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "text": "你好，欢迎使用语音识别服务。"
}
\`\`\``,
  },
  {
    id: "translation",
    title: "Traduction vocale",
    category: "Référence API",
    content: `# Traduction vocale

> **POST** \`/v1/audio/translations\`

Traduit un fichier audio en texte anglais

## Paramètres de la requête

### Paramètres du corps (multipart/form-data)

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`file\` | file | Oui | Fichier audio |
| \`model\` | string | Oui | Modèle de traduction vocale, ex. \`sensevoice-v1\` |
| \`response_format\` | enum | Non | Format de sortie (json/text/srt/verbose_json/vtt), défaut json |
| \`temperature\` | number | Non | Température d'échantillonnage |

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/audio/translations' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@audio.mp3' \\
--form 'model="sensevoice-v1"' \\
--form 'response_format="json"'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "text": "Hello, welcome to the speech translation service."
}
\`\`\``,
  },
  {
    id: "video",
    title: "Générer des vidéos",
    category: "Référence API",
    content: `# Générer des vidéos

> **POST** \`/v1/video/generations\`

Génère une vidéo à partir d'une invite textuelle, prend en charge deux modes : texte-à-vidéo et image-à-vidéo. Compatible avec le protocole de génération vidéo Doubao Seedance (Sendance).

- Texte-à-vidéo : fournir uniquement le prompt
- Image-à-vidéo : fournir prompt + image_url (Seedance prend en charge plusieurs images : first_frame / last_frame / reference_image)

## Modèles pris en charge

### Série Seedance

| Modèle | Description |
|---|---|
| \`doubao-seedance-1-0-pro-250528\` | 1.0 Pro, génération vidéo haute qualité |
| \`doubao-seedance-1-0-lite-t2v\` | 1.0 Lite, texte-à-vidéo |
| \`doubao-seedance-1-0-lite-i2v\` | 1.0 Lite, image-à-vidéo |
| \`doubao-seedance-1-5-pro-251215\` | 1.5 Pro, performances améliorées |
| \`doubao-seedance-2-0-260128\` | 2.0 Édition standard |
| \`doubao-seedance-2-0-fast-260128\` | 2.0 Édition rapide, faible latence |
| \`doubao-seedance-2-0-mini-260615\` | 2.0 Mini, léger et économique |
| \`doubao-seedance-2-5-260628\` | 2.5 Dernière version, jusqu'à 30 s, 21:9, références multimodales (30 images + 10 vidéos + 10 audio) |

### Autres modèles

\`kling-v1\` / \`kling-v2\` / \`cogvideox-2\` / \`vidu-1\` / \`jimeng\` / \`sora\`

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Oui | Modèle de génération vidéo (série Seedance recommandée) |
| \`prompt\` | string | Oui | Texte de description de la vidéo |
| \`image_url\` | string | Non | URL de l'image de référence (mode image-à-vidéo) |
| \`images\` | array | Non | Entrée multi-images (Seedance image-à-vidéo, mappée dans l'ordre à first_frame / last_frame / reference_image) |
| \`resolution\` | string | Non | Résolution de sortie (Seedance : 480p / 720p / 1080p / 4k) |
| \`ratio\` | string | Non | Format d'image (Seedance 2.5 : 21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16 ; autres : 16:9 / 9:16 / 1:1) |
| \`size\` | string | Non | Taille de la vidéo, ex. 1280x720 |
| \`duration\` | integer | Non | Durée de la vidéo (secondes). Seedance 2.5 : 4–30, série 2.0 : 4–15, 1.5 : 4–12, 1.0 : 2–12 |
| \`n\` | integer | Non | Nombre de vidéos, défaut 1 |
| \`metadata\` | object | Non | Paramètres étendus, prend en charge l'entrée multimodale (video_url / audio_url) ainsi que negative_prompt, style, watermark, etc. |

### Exemple de requête (texte-à-vidéo)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}
\`\`\`

### Exemple de requête (image-à-vidéo)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "在首帧基础上添加烟花效果",
    "images": [
        "https://example.com/first-frame.jpg",
        "https://example.com/last-frame.jpg"
    ]
}
\`\`\`

### Exemple de requête (continuation vidéo / multimodal)

\`\`\`json
{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "让视频中的人物转身看向镜头",
    "metadata": {
        "content": [
            {
                "type": "video_url",
                "video_url": {
                    "url": "https://example.com/input.mp4"
                }
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "https://example.com/bgm.mp3"
                }
            }
        ]
    }
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/video/generations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "doubao-seedance-2-5-260628",
    "prompt": "宇航员漫步月球",
    "resolution": "1080p",
    "ratio": "16:9",
    "duration": 5
}'
\`\`\`

## Réponse

### 200 Succès (tâche soumise)

\`\`\`json
{
    "id": "task_xxxxxxxx",
    "task_id": "task_xxxxxxxx",
    "object": "video",
    "model": "doubao-seedance-2-5-260628",
    "status": "queued",
    "progress": 0,
    "created_at": 1713833628
}
\`\`\`

## Interroger l'état de la tâche

> **GET** \`/v1/video/generations/{task_id}\`

Après la soumission de la tâche, interrogez cet endpoint pour obtenir la progression et le résultat.

### État de la tâche

| Statut | Description |
|---|---|
| \`QUEUED\` | En file d'attente, en attente de génération |
| \`IN_PROGRESS\` | Génération en cours ; progress indique la progression |
| \`SUCCESS\` | Terminé ; result_url est l'URL de la vidéo |
| \`FAILURE\` | Échec ; fail_reason indique la cause |

### Exemple de réponse (terminé)

\`\`\`json
{
    "code": "success",
    "message": "",
    "data": {
        "id": 123,
        "task_id": "task_xxxxxxxx",
        "status": "SUCCESS",
        "progress": "100%",
        "result_url": "https://example.com/video.mp4",
        "model": "doubao-seedance-2-5-260628",
        "fail_reason": ""
    }
}
\`\`\`

> **Remarque** : Seedance 2.0 / 2.5 prend en charge les entrées multimodales (vidéo + audio + image), qui peuvent être transmises via \`metadata.content\` ; Seedance 2.5 prend en charge jusqu'à 30 images, 10 vidéos et 10 fichiers audio en référence par tâche, avec une génération en un seul passage jusqu'à 30 secondes et des extensions multi-tours. Après soumission de la tâche, interrogez l'état de la tâche via \`GET /v1/video/generations/{task_id}\`.`,
  },
  {
    id: "asset-library",
    title: "Bibliothèque de ressources",
    category: "Référence API",
    content: `# Bibliothèque de ressources

La bibliothèque de ressources sert à gérer les ressources multimodales nécessaires à la génération vidéo. Les clients peuvent téléverser des images / vidéos / audios via des interfaces externes, puis référencer ces ressources sous forme d'URL comme entrées multimodales de Seedance (Sendance) lors de l'appel de l'interface de génération vidéo (\`/v1/video/generations\`).

## Liste des interfaces

| Méthode | Chemin | Description |
|---|---|---|
| \`POST\` | \`/api/asset\` | Téléverser une ressource |
| \`GET\` | \`/api/asset\` | Obtenir la liste des ressources (paginée) |
| \`GET\` | \`/api/asset/search\` | Rechercher des ressources |
| \`GET\` | \`/api/asset/{id}\` | Obtenir les détails d'une ressource |
| \`DELETE\` | \`/api/asset/{id}\` | Supprimer une ressource |

Toutes les interfaces de la bibliothèque de ressources doivent inclure \`Authorization: Bearer <token>\` (jeton utilisateur de la plateforme). Les utilisateurs ordinaires ne peuvent accéder qu'à leurs propres ressources ; les administrateurs peuvent consulter / gérer toutes les ressources.

## Téléverser une ressource

> **POST** \`/api/asset\`

Téléversez un fichier de ressource en \`multipart/form-data\`.

### Paramètres de la requête

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| \`file\` | file | Oui | Fichier de ressource |
| \`group_id\` | integer | Oui | ID du groupe de ressources (la ressource doit appartenir à un groupe) |
| \`model\` | string | Oui | Identifiant du modèle de génération, ex. \`sendance-2.0\` / \`sendance-2.5\` |
| \`channel_id\` | integer | Non | ID du canal en amont (défaut : le canal du groupe) |

### Limites de taille de fichier (alignées sur Volcano Engine Seedance)

| Type | Limite de taille |
|---|---|
| Image (image) | 30MB |
| Vidéo (video) | 200MB |
| Audio (audio) | 15MB |

Le type de ressource est détecté automatiquement selon le type MIME du fichier : \`image/*\` → image, \`video/*\` → video, \`audio/*\` → audio ; les autres types sont refusés.

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset' \\
--header 'Authorization: Bearer <token>' \\
--form 'file=@/path/to/video.mp4' \\
--form 'group_id=1' \\
--form 'model=sendance-2.0'
\`\`\`

### Exemple de réponse

\`\`\`json
{
    "success": true,
    "message": "",
    "data": {
        "id": 1,
        "user_id": 3,
        "user_name": "user01",
        "tenant_id": null,
        "model": "sendance-2.0",
        "type": "video",
        "name": "开场视频.mp4",
        "storage_key": "video/uuid.mp4",
        "url": "https://storage.example.com/video/uuid.mp4",
        "size": 10485760,
        "mime_type": "video/mp4",
        "duration": null,
        "width": null,
        "height": null,
        "created_time": 1713833628
    }
}
\`\`\`

> Le champ \`url\` renvoyé après le téléversement est l'adresse d'accès à la ressource, utilisable directement par l'interface de génération vidéo.

## Obtenir la liste des ressources

> **GET** \`/api/asset\`

Récupère la liste paginée des ressources, avec filtrage par type et par modèle.

### Paramètres de requête

| Paramètre | Type | Description |
|---|---|---|
| \`type\` | string | Type de ressource (image / video / audio) |
| \`model\` | string | Identifiant du modèle de génération (ex. \`sendance-2.0\`) |
| \`page\` | integer | Numéro de page, défaut 0 |
| \`page_size\` | integer | Nombre d'éléments par page, défaut 10 |
| \`user_id\` | integer | ID utilisateur (administrateurs uniquement) |
| \`tenant_id\` | integer | ID du locataire (administrateurs uniquement) |

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset?type=video&model=sendance-2.0&page=0&page_size=20' \\
--header 'Authorization: Bearer <token>'
\`\`\`

### Exemple de réponse

\`\`\`json
{
    "success": true,
    "message": "",
    "data": [
        {
            "id": 1,
            "user_id": 3,
            "type": "video",
            "name": "开场视频.mp4",
            "url": "https://storage.example.com/video/uuid.mp4",
            "model": "sendance-2.0",
            "size": 10485760,
            "created_time": 1713833628
        }
    ],
    "total": 1
}
\`\`\`

## Rechercher des ressources

> **GET** \`/api/asset/search\`

Recherche des ressources par mot-clé ; paramètres identiques à l'obtention de la liste, avec en plus :

| Paramètre | Type | Description |
|---|---|---|
| \`keyword\` | string | Mot-clé de recherche (correspond au nom de la ressource) |

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/search?keyword=开场' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Obtenir les détails d'une ressource

> **GET** \`/api/asset/{id}\`

\`\`\`bash
curl --location '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Supprimer une ressource

> **DELETE** \`/api/asset/{id}\`

Seul le propriétaire de la ressource ou un administrateur peut la supprimer.

\`\`\`bash
curl --location --request DELETE '{{BASE_URL}}/api/asset/1' \\
--header 'Authorization: Bearer <token>'
\`\`\`

## Utiliser les ressources pour la génération vidéo Seedance

Après le téléversement, utilisez l'\`url\` renvoyée comme entrée multimodale de l'interface de génération vidéo :

> **Remarque** : lors de la soumission d'une tâche de génération vidéo, la plateforme lit automatiquement les ressources **image** de la bibliothèque et les convertit en encodage Base64 (\`data:image/...;base64,...\`) avant de les transmettre au fournisseur en amont Volcano Ark ; vous n'avez pas besoin de préparer d'adresses statiques accessibles publiquement. Pour les URL publiques hébergées par le client lui-même et absentes de la bibliothèque de ressources, les encodages Base64 et les identifiants de ressources \`asset://\` sont transmis tels quels. Les ressources **vidéo / audio** ne prennent en charge que les URL publiques ; veuillez utiliser des adresses publiques hors bibliothèque de ressources (par exemple un hébergeur d'images, un CDN d'object storage). Une image seule ne doit pas dépasser 25MB.

### Image-à-vidéo (image de référence)

\`\`\`json
{
    "model": "doubao-seedance-1-0-lite-i2v",
    "prompt": "将第一帧作为起始画面",
    "metadata": {
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": "/api/asset/file/image/uuid.jpg"
                },
                "role": "first_frame"
            }
        ]
    }
}
\`\`\`

### Continuation vidéo / entrée audio

\`\`\`json
{
    "model": "doubao-seedance-2-0-260128",
    "prompt": "让视频中的人物转身看向镜头",
    "metadata": {
        "content": [
            {
                "type": "video_url",
                "video_url": {
                    "url": "/api/asset/file/video/uuid.mp4"
                }
            },
            {
                "type": "audio_url",
                "audio_url": {
                    "url": "/api/asset/file/audio/music.mp3"
                }
            }
        ]
    }
}
\`\`\`

> **Astuce** : \`metadata.content\` prend en charge quatre types : \`text\` / \`image_url\` / \`video_url\` / \`audio_url\`. Pour \`image_url\`, le rôle peut être spécifié via \`role\` : \`first_frame\` / \`last_frame\` / \`reference_image\`.`,
  },
  {
    id: "moderation",
    title: "Modération de contenu",
    category: "Référence API",
    content: `# Modération de contenu

> **POST** \`/v1/moderations\`

Détecte si un texte ou un contenu texte-image viole les politiques de sécurité

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Non | Modèle de modération, ex. \`content-moderation-latest\` |
| \`input\` | string/array | Oui | Contenu à modérer (texte ou tableau texte+image) |

### Exemple de requête

\`\`\`json
{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/moderations' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "content-moderation-latest",
    "input": "这是一条测试文本"
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "id": "modr-abc123",
    "model": "content-moderation-latest",
    "results": [
        {
            "flagged": false,
            "categories": {
                "violence": false,
                "hate": false,
                "sexual": false
            },
            "category_scores": {
                "violence": 0.001,
                "hate": 0.0001,
                "sexual": 0.0002
            }
        }
    ]
}
\`\`\``,
  },
  {
    id: "rerank",
    title: "Réordonnancement",
    category: "Référence API",
    content: `# Réordonnancement

> **POST** \`/v1/rerank\`

Réordonne une liste de documents selon la pertinence par rapport à un texte de requête

## Paramètres de la requête

### Paramètres du corps

| Paramètre | Type | Obligatoire | Description |
|---|---|---|---|
| \`model\` | string | Non | Modèle de réordonnancement, ex. \`bge-rerank-v3\` |
| \`query\` | string | Oui | Texte de requête |
| \`documents\` | array | Oui | Liste des documents à ordonner |
| \`top_n\` | integer | Non | Renvoyer les N premiers résultats |
| \`return_documents\` | boolean | Non | Renvoyer ou non le texte original des documents, défaut true |

### Exemple de requête

\`\`\`json
{
    "model": "bge-rerank-v3",
    "query": "零一云是什么",
    "documents": [
        "零一云是一个企业级AI网关平台",
        "今天天气不错",
        "零一云支持多种AI模型的统一接入"
    ],
    "top_n": 3,
    "return_documents": true
}
\`\`\`

### Exemple cURL

\`\`\`bash
curl --location '{{BASE_URL}}/v1/rerank' \\
--header 'Authorization: Bearer <token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "bge-rerank-v3",
    "query": "零一云是什么",
    "documents": [
        "零一云是一个企业级AI网关平台",
        "今天天气不错",
        "零一云支持多种AI模型的统一接入"
    ],
    "top_n": 3,
    "return_documents": true
}'
\`\`\`

## Réponse

### 200 Succès

\`\`\`json
{
    "id": "rerank-abc123",
    "model": "bge-rerank-v3",
    "results": [
        {
            "index": 0,
            "relevance_score": 0.95,
            "document": {
                "text": "零一云是一个企业级AI网关平台"
            }
        },
        {
            "index": 2,
            "relevance_score": 0.88,
            "document": {
                "text": "零一云支持多种AI模型的统一接入"
            }
        },
        {
            "index": 1,
            "relevance_score": 0.12,
            "document": {
                "text": "今天天气不错"
            }
        }
    ],
    "usage": {
        "prompt_tokens": 30,
        "total_tokens": 30
    }
}
\`\`\``,
  },
  {
    id: "faq",
    title: "Foire aux questions",
    category: "Plateforme",
    content: `# Foire aux questions

### Questions générales

**Q : Quelle est la différence entre LingyiYun et OpenAI officiel ?**

R : LingyiYun est une passerelle compatible avec le format OpenAI, avec en plus la prise en charge des modèles nationaux (DeepSeek/Qwen/GLM, etc.) et des prix plus flexibles. Le format des interfaces est entièrement compatible ; le SDK OpenAI fonctionne directement.

**Q : Quels langages de programmation sont pris en charge ?**

R : Tout langage prenant en charge HTTP peut être utilisé. Python et Node.js disposent de SDK officiels, c'est le plus pratique. Pour les autres langages (Go/Java/PHP/Rust), utilisez directement un client HTTP.

**Q : Peut-on essayer gratuitement ?**

R : Contactez l'administrateur pour obtenir une clé de test, généralement avec un quota initial.

### Questions d'appel

**Q : Que faire si \`context_length_exceeded\` est renvoyé ?**

R : L'entrée est trop longue. Simplifiez le contenu des messages, ou utilisez un modèle avec un contexte plus long (par exemple gpt-4.1 prend en charge 1M).

**Q : Que faire si \`model_not_found\` est renvoyé ?**

R : Le paramètre model est incorrect. Appelez \`GET /v1/models\` pour consulter la liste des modèles disponibles, attention à la casse.

**Q : Le streaming est interrompu, que faire ?**

R : Un problème réseau a provoqué la déconnexion SSE ; il est impossible de reprendre, vous devez relancer la requête. Il est recommandé d'implémenter une logique de concaténation côté client et de relancer la requête en cas d'interruption.

**Q : Pourquoi le contenu de la réponse est-il tronqué ?**

R : Le \`max_tokens\` est peut-être trop petit, ou le modèle a atteint sa limite de sortie. Vérifiez \`finish_reason\` ; s'il vaut \`length\`, la réponse a été tronquée, augmentez \`max_tokens\`.

**Q : La qualité des réponses en chinois est mauvaise, que faire ?**

R : Essayez d'exiger explicitement « répondre en chinois » dans le message system, ou utilisez un modèle avec de meilleures capacités en chinois (DeepSeek/Qwen/GLM).

### Questions de facturation

**Q : Combien de Tokens une requête consomme-t-elle ?**

R : Consultez le champ \`usage\` de la réponse. Le total des Tokens d'entrée + de sortie correspond à la consommation.

**Q : Comment compter les Tokens en streaming ?**

R : Définissez \`stream_options: {"include_usage": true}\`, le dernier chunk contiendra l'usage. Les requêtes non-streaming renvoient l'usage par défaut.

**Q : La facturation est-elle identique à celle d'OpenAI officiel ?**

R : La logique de facturation est identique (par Token), mais les multiplicateurs diffèrent ; les modèles nationaux de LingyiYun sont moins chers. Consultez la configuration du backend pour les multiplicateurs exacts.

### Questions de fonctionnalités

**Q : Function Calling est-il pris en charge ?**

R : Oui. Les modèles DeepSeek / GPT / Claude le prennent en charge, avec une utilisation identique à OpenAI.

**Q : L'entrée d'images (Vision) est-elle prise en charge ?**

R : Oui. Utilisez des modèles multimodaux comme gpt-4o / claude-sonnet-4, et transmettez l'URL de l'image ou le Base64 dans le content.

**Q : La sortie JSON est-elle prise en charge ?**

R : Oui. Définissez \`response_format: {"type": "json_object"}\`.

**Q : Peut-on affiner (fine-tuning) les modèles ?**

R : Pas pour le moment. Vous pouvez utiliser directement les modèles pré-entraînés fournis par la plateforme et obtenir des effets personnalisés grâce à l'ingénierie de prompt et au few-shot.

**Q : Combien de temps faut-il attendre pour la génération vidéo ?**

R : En général de 30 secondes à plusieurs minutes, selon le modèle et la durée de la vidéo.

### Questions de déploiement

**Q : Comment configurer le CORS (partage de ressources entre origines) ?**

R : Si le frontend appelle l'API directement, vous rencontrerez des problèmes de CORS. Il est recommandé de passer par un proxy backend, ou de contacter l'administrateur pour configurer la liste blanche CORS.

**Q : Peut-on appeler l'API depuis un réseau interne ?**

R : LingyiYun est déployé sur l'internet public ; le réseau interne doit pouvoir accéder à l'extérieur. En cas d'isolation totale, un déploiement privé est nécessaire.

**Q : Un déploiement privé est-il pris en charge ?**

R : Contactez le service commercial ; un déploiement privé dans les locaux du client est pris en charge.

**Q : Comment consulter les journaux d'appels API ?**

R : Panneau d'administration → page Journaux, filtrable par clé / modèle / période.`,
  },
  {
    id: "terms",
    title: "Accord de la plateforme",
    category: "Plateforme",
    content: `# Accord de la plateforme

Le présent accord (« l'Accord ») est conclu entre vous (« personne ou organisation enregistrée sur la plateforme en tant qu'utilisateur et utilisant nos services, s'engageant à respecter nos accords, la politique de confidentialité et les autres conditions de service ») et Beijing Chuangshi Huacai Technology Co., Ltd. et ses sociétés affiliées (« **Huacai** » ou « nous »).

Vous reconnaissez avoir lu, compris et accepté l'intégralité des termes du présent accord avant d'utiliser ou d'acheter nos produits ou services LingyiYun. Dès que vous commencez réellement à utiliser les services de la plateforme ou que vous terminez le processus d'achat, cela signifie que vous avez lu et accepté de vous conformer au présent accord. Nous avons le droit de modifier les termes du présent accord lorsque cela est nécessaire ; vous pouvez consulter la version la plus récente de l'accord sur cette page. Si vous continuez à utiliser les services de la plateforme après la modification des termes de l'accord, vous serez réputé avoir accepté l'accord modifié. **Pour une description détaillée de nos politiques de collecte et d'utilisation des données et des informations personnelles de la plateforme, veuillez consulter la politique de confidentialité.**

Vous garantissez que vous disposez de la pleine capacité civile requise par la loi, que vous êtes une personne physique pouvant assumer de manière indépendante la responsabilité civile, ou une personne physique jouissant d'une pleine capacité civile agissant pour le compte d'une personne morale dûment mandatée ; si vous avez moins de dix-huit ans, même si vous vous êtes enregistré, vous ne pourrez pas effectuer la vérification d'identité réelle ni utiliser les services de la plateforme. Vous vous engagez et confirmez que le contenu du présent accord ne contrevient pas aux lois de votre pays ou région.

## 1. Gestion des comptes

### 1.1 Compte et vérification de l'identité réelle

1.1.1. Après avoir renseigné les informations requises par la plateforme et confirmé votre accord avec l'intégralité des termes du présent accord et de la « Politique de confidentialité », nous créerons votre compte. Vous êtes informé et acceptez que tout ou partie des fonctionnalités de la plateforme ne soient activées qu'après la vérification d'identité réelle de votre compte, et que nous ayons le droit, selon notre propre appréciation et l'évolution de nos activités, de modifier et de maintenir de temps à autre les services et fonctionnalités de la plateforme.

1.1.2. Si vous accédez et utilisez la plateforme au nom d'une entreprise, d'une personne morale, d'une organisation non constituée en personne morale ou d'une autre entité, vous devez effectuer la vérification d'entreprise du compte. L'entreprise vérifiée est responsable de toutes les utilisations, recharges, fournitures d'informations et autres actions du compte et de ses utilisateurs associés, et ne peut pas refuser d'assumer la responsabilité en invoquant le prêt du compte, le départ d'un employé ou d'autres raisons.

1.1.3. Si vous accédez ou utilisez ce service via un tiers, vous reconnaissez et autorisez ce tiers à utiliser ou stocker vos informations d'utilisateur, jetons d'accès, informations de compte associées, identifiants d'authentification et autres données.

1.1.4. Vous êtes responsable de la protection des comptes que vous créez, auxquels vous adhérez ou que vous gérez, ainsi que de votre identité d'utilisateur, et vous ne devez divulguer à personne les identifiants de connexion que vous utilisez. La plateforme n'est pas responsable de la perte du compte due à une divulgation volontaire de votre part ou à des attaques ou fraudes subies.

1.1.5. Le nom du compte et le pseudonyme d'utilisateur que vous définissez ne doivent pas violer les lois et règlements nationaux, l'ordre public, les bonnes mœurs et la morale sociale, ni créer de confusion entre votre identité et celle de la plateforme.

1.1.6. Un même utilisateur ne peut créer qu'un seul compte personnel. Votre compte personnel est réservé à votre usage exclusif. Sauf accord contraire entre les parties, vous ne pouvez pas, sous quelque forme que ce soit, faire don, prêter, louer, transférer, vendre votre compte personnel ni permettre à un tiers de l'utiliser d'une autre manière.

1.1.7. Un même utilisateur peut créer plusieurs comptes organisationnels. Si vous autorisez d'autres utilisateurs à utiliser conjointement votre compte organisationnel, vous assumerez l'entière responsabilité des conséquences et obligations de toutes les actions des utilisateurs concernés sous ce compte organisationnel.

### 1.2 Modification, suspension et résiliation

Nous pouvons modifier, suspendre ou mettre fin aux services que nous vous fournissons, ou fixer des limites à l'utilisation des services, sans encourir de responsabilité, à condition que nous ayons fait de notre mieux pour vous prévenir au préalable par un ou plusieurs moyens tels que SMS, e-mail ou annonces sur la plateforme. Nous pouvons désactiver votre compte à tout moment. Même si votre compte est résilié pour quelque raison que ce soit, vous restez lié par le présent accord.

## 2. Accès aux services et restrictions de service

### 2.1 Obtention des services

Sous réserve de votre respect du présent accord, nous vous accordons par les présentes un droit non exclusif et non transférable, uniquement pour votre usage personnel ou pour les besoins commerciaux internes de l'entreprise ou de l'autre entité que vous représentez.

### 2.2 Restrictions de service

Vous ne devez pas :
- Désassembler, effectuer de l'ingénierie inverse, décoder ou décompiler toute partie du service
- Acheter, vendre ou transférer des clés API sans notre consentement écrit préalable
- Copier, louer, vendre, prêter, transférer, concéder sous licence ou tenter de sous-licencier, revendre, distribuer ou modifier toute partie du service
- Entreprendre toute action susceptible de surcharger excessivement nos serveurs, infrastructures, etc.
- Utiliser le service à des fins illégales, contrefaisantes, frauduleuses, etc.
- Contourner les mesures que nous pouvons prendre pour empêcher ou limiter l'accès au service
- Tenter d'interférer avec ou de compromettre l'intégrité ou la sécurité des systèmes des serveurs exploitant le service
- Utiliser ce service pour envoyer du spam, des chaînes de lettres ou d'autres e-mails non sollicités
- Transmettre via ce service des données illégales, des virus ou d'autres logiciels malveillants
- Usurper l'identité d'une autre personne ou entité, ou faire de fausses déclarations sur votre relation avec une autre personne ou entité
- Collecter ou obtenir des informations personnelles à partir de ce service

## 3. Données d'interaction

3.1 Le service peut permettre aux utilisateurs, pendant l'utilisation des services de la plateforme, d'effectuer des opérations de saisie, de retour, de modification, de traitement, de stockage, de téléversement, de téléchargement et de distribution de données en rapport avec des grands modèles, des sites web tiers, des logiciels, des applications ou des services.

3.2 Si des données d'interaction s'avèrent violer les lois, règlements ou les dispositions du présent accord, nous avons le droit de supprimer ces données d'interaction ou de cesser de fournir les services techniques.

3.3 En tant que fournisseur de support technique indépendant, la plateforme ne détient aucun droit de propriété intellectuelle sur les données d'interaction générées par votre utilisation des services de la plateforme. Toutes les données d'interaction, obligations et responsabilités générées par votre utilisation des services de la plateforme vous incombent entièrement.

3.4 Clause de non-responsabilité : nous ne sommes pas responsables des données d'interaction. Vous êtes entièrement responsable des données d'interaction que vous saisissez, sur lesquelles vous fournissez un retour, que vous corrigez, traitez, stockez, téléversez, téléchargez et distribuez dans les services de la plateforme.

3.5 Nous ajouterons des marquages appropriés aux contenus synthétiques générés par l'intelligence artificielle, conformément aux lois et règlements applicables. Vous ne devez pas supprimer, altérer, falsifier ou dissimuler de manière malveillante les marquages susmentionnés.

## 4. Propriété intellectuelle

### 4.1 Propriété intellectuelle de LingyiYun

La propriété intellectuelle de tous les contenus que nous fournissons dans les services de la plateforme nous appartient dès l'origine. Vous ne devez pas accéder, vendre, concéder sous licence, louer, modifier, distribuer, copier, transmettre, afficher, publier, adapter ou créer des œuvres dérivées de ces propriétés intellectuelles.

### 4.2 Sorties

Sous réserve de votre respect des dispositions pertinentes et de la conformité aux lois et règlements applicables, vous pouvez utiliser les résultats générés par les services de la plateforme de la manière prévue par la loi.

### 4.3 Données d'utilisation des utilisateurs

Nous pouvons collecter des informations relatives au diagnostic, à la technique et à l'utilisation, afin d'améliorer nos produits et services.

### 4.4 Retours

Si vous nous fournissez des suggestions ou des retours concernant ce service, vous nous cédez par les présentes tous les droits et intérêts dans ces retours.

## 5. Informations confidentielles

Ce service peut contenir des informations non publiques, exclusives ou confidentielles de LingyiYun et d'autres utilisateurs. Vous protégerez la confidentialité de toutes les informations confidentielles, ne les utiliserez à aucune autre fin que l'exercice des droits découlant du présent accord et ne les divulguerez à aucune personne ou entité.

## 6. Politique de facturation et taxes

6.1 Certains services fournis par la plateforme peuvent nécessiter le paiement de frais d'utilisation. En choisissant d'utiliser ce service, vous acceptez les conditions de tarification et de paiement applicables décrites sur la plateforme.

6.2 En raison de la particularité du « service d'abord, facturation ensuite », nos produits et services adoptent généralement un modèle de « paiement après utilisation ». Veuillez vous assurer que votre compte dispose d'un solde suffisant, faute de quoi des arriérés pourraient être générés.

6.3 Les conditions de tarification, de facturation et de paiement de tous les produits et services de la plateforme sont incorporées au présent accord par référence.

6.4 S'il existe des taxes imposées par le gouvernement, vous êtes responsable du paiement de toutes les taxes liées à votre utilisation/activation des services.

## 7. Contrôle des exportations et sanctions

Vous vous engagez à respecter les lois et règlements de la République populaire de Chine relatifs au contrôle des exportations et aux sanctions. Vous vous engagez à ne pas utiliser les produits ou services fournis par la plateforme à des fins militaires ou liées aux armes de destruction massive.

## 8. Confidentialité et sécurité des données

### 8.1 Confidentialité

Nous nous conformerons en permanence à la Loi de la République populaire de Chine sur la protection des informations personnelles et aux autres lois applicables.

### 8.2 Sécurité des données

Nous accordons une grande importance à l'intégrité et à la sécurité de vos informations personnelles. Toutefois, nous ne pouvons pas garantir que des tiers non autorisés ne pourront jamais contourner nos mesures de protection de la sécurité.

## 9. Utilisation de services tiers

Ce service peut contenir des liens vers des sites web, des documents et des services tiers qui ne nous appartiennent pas et ne sont pas contrôlés par nous. Nous n'approuvons aucun service tiers et n'assumons aucune responsabilité à leur égard.

## 10. Indemnisation

Vous devez défendre, indemniser et dégager de toute responsabilité nous et nos sociétés affiliées ainsi que leurs agents, fournisseurs, concédants de licence, employés, sous-traitants, dirigeants et administrateurs respectifs, pour toute réclamation, dommage, obligation, perte, responsabilité, coût et dépense découlant de votre accès et de votre utilisation de ce service, de votre violation du présent accord, ou de votre violation des droits de tout tiers.`,
  },
  {
    id: "privacy",
    title: "Politique de confidentialité",
    category: "Plateforme",
    content: `# Politique de confidentialité

Bienvenue sur la plateforme ouverte GenAI à haute valeur ajoutée de Beijing Chuangshi Huacai Technology Co., Ltd. et de ses entités affiliées (ci-après « Huacai » ou « nous »). Nous attachons une grande importance à la protection des informations des utilisateurs (ci-après « vous »). Lorsque vous vous inscrivez, vous connectez et utilisez cette plateforme, nous collectons et stockons les informations utilisateur nécessaires à votre inscription et à l'utilisation normale des fonctionnalités de la plateforme. Nous ne collectons ni ne stockons les données d'interaction entre vous et les modèles open source, les sites web tiers, les logiciels, les applications ou les services pendant votre utilisation de la plateforme.

## Aperçu

La présente politique de confidentialité vous aidera à comprendre :

1. Comment nous collectons et utilisons vos informations utilisateur
2. Notre utilisation des cookies et technologies similaires
3. Comment nous stockons vos informations utilisateur
4. Comment nous partageons, transmettons et divulguons publiquement vos informations
5. Comment nous protégeons la sécurité de vos informations
6. Comment nous gérons vos informations utilisateur
7. Conditions d'utilisation pour les mineurs
8. Révisions et notifications de la politique de confidentialité
9. Champ d'application

## 1. Comment nous collectons et utilisons vos informations utilisateur

### 1.1 Nous collectons activement vos informations utilisateur

Pour garantir votre utilisation normale de notre plateforme, nous collecterons les informations utilisateur que vous fournissez volontairement lors de l'utilisation de nos services, notamment :

**1.1.1** Lorsque vous vous inscrivez, vérifiez et connectez votre compte de plateforme, vous pouvez créer un compte avec votre numéro de téléphone mobile. Nous vérifierons votre identité en envoyant un code de vérification par SMS.

**1.1.2** Lorsque vous souscrivez ou activez un service, conformément aux lois et règlements, nous devons effectuer une vérification d'identité réelle vous concernant.

- Pour les utilisateurs individuels : vous devrez peut-être fournir vos informations d'identité réelle, notamment votre nom complet, votre numéro de carte d'identité, etc.
- Pour les utilisateurs professionnels : vous devrez peut-être fournir les informations de votre organisation, notamment la raison sociale, le code de crédit social unifié, etc.

**1.1.3** Lorsque vous utilisez ce service, nous collectons les informations nécessaires au maintien de la sécurité et de la stabilité des produits et services, notamment les informations sur l'appareil, les informations de journal réseau, etc.

### 1.2 Nous pouvons obtenir des informations utilisateur auprès de tiers

Afin de vous fournir des services de meilleure qualité, plus efficaces et plus personnalisés, nos sociétés affiliées et partenaires peuvent partager vos informations avec nous, conformément aux lois et règlements, aux accords conclus avec vous ou à votre consentement.

### 1.3 Données professionnelles et clients

Les données générées ou traitées par les services fournis via la plateforme sont vos données professionnelles et clients (« données d'interaction »). Vous détenez la pleine propriété des données d'interaction. En tant que fournisseur de services techniques neutre, la plateforme n'accède pas à vos données d'interaction, ne les utilise pas et ne les divulgue pas, sauf disposition contraire des lois et règlements.

## 2. Utilisation des cookies et technologies similaires

Les cookies et technologies similaires sont des technologies couramment utilisées sur Internet. Lorsque vous utilisez la plateforme, nous pouvons utiliser des technologies pertinentes pour envoyer des cookies à votre appareil, afin de collecter et stocker les informations de votre compte, votre historique de recherche et vos informations d'état de connexion. Vous pouvez refuser ou gérer les cookies via les paramètres de votre navigateur.

## 3. Comment nous stockons vos informations utilisateur

### 3.1 Emplacement de stockage des informations

Nous stockerons les informations utilisateur collectées et générées lors de l'exploitation de ce site web et des services associés sur le territoire de la République populaire de Chine.

### 3.2 Durée de stockage des informations

Nous ne conservons vos informations utilisateur que pendant la durée nécessaire à la fourniture de la plateforme et des services associés. Passé le délai nécessaire, nous supprimerons ou anonymiserons vos informations.

## 4. Comment nous partageons, transmettons et divulguons vos informations

### 4.1 Partenaires participant à l'utilisation des données

Les activités d'utilisation des données impliquant des partenaires doivent avoir un objectif légitime et se limiter au périmètre nécessaire à la réalisation de cet objectif. Nous évaluerons de manière exhaustive les capacités de sécurité des partenaires et exigerons qu'ils respectent les accords juridiques de coopération.

### 4.2 Traitement conjoint ou délégué des informations utilisateur

Certains modules ou fonctionnalités spécifiques de la plateforme et des services associés sont fournis par des partenaires. Nous ne leur fournissons vos informations utilisateur que dans la mesure minimale nécessaire à la fourniture des services, selon les principes de légalité, d'équité, de nécessité et de sécurité.

### 4.3 Transfert des informations utilisateur

Sauf en cas de consentement explicite de votre part, d'exigence des lois et règlements, ou de changement / fusion / acquisition / liquidation de faillite dans l'exploitation de la plateforme, nous ne transférerons pas vos informations utilisateur à tout autre tiers.

### 4.4 Divulgation des informations utilisateur

En principe, nous ne divulguerons pas publiquement vos informations utilisateur, sauf avec votre consentement explicite ou si les lois et règlements nationaux l'exigent.

## 5. Comment nous protégeons la sécurité de vos informations

Nous accordons une grande importance à la sécurité des informations utilisateur et prenons des mesures de sécurité raisonnables pour protéger vos informations contre tout accès, utilisation ou divulgation non autorisés.

## 6. Comment nous gérons vos informations utilisateur

Vous avez le droit d'accéder à vos informations utilisateur, de les corriger et de les supprimer. Vous pouvez gérer vos informations personnelles via la page des paramètres de la plateforme, ou nous contacter pour obtenir de l'aide.

## 7. Conditions d'utilisation pour les mineurs

Nous n'autorisons pas les mineurs (moins de 18 ans) à utiliser les services de la plateforme. Si vous êtes mineur, veuillez cesser immédiatement d'utiliser nos services.

## 8. Révisions et notifications de la politique de confidentialité

Nous pouvons réviser la présente politique de confidentialité de temps à autre. La politique de confidentialité révisée sera publiée sur cette page et prendra effet à compter de sa date de publication.

## 9. Champ d'application

La présente politique de confidentialité s'applique à tous les scénarios d'utilisation des services de la plateforme. Si vous utilisez la plateforme via des services tiers, vous devez également respecter la politique de confidentialité du tiers.`,
  },
]
