# HelpBeam — Widget de support client IA

## Aperçu
HelpBeam permet d’intégrer un widget de support client alimenté par l’IA sur n’importe quel site. Le bot répond à partir de vos pages, PDF et FAQ, avec possibilité d’escalade vers un humain.

## Utilisation
1. Créez un workspace et connectez vos sources (URLs, PDF, FAQ).
2. Personnalisez le widget (couleurs, message d’accueil).
3. Intégrez le <script> d’embed sur votre site.
4. Suivez les conversations, ajoutez des réponses canoniques, escaladez si besoin.

## Cible
PME/SaaS/e-commerce qui veulent réduire la charge du support et améliorer le self-service.

## Fonctionnalités clés
- RAG (recherche + génération) sur sources privées
- Historique des conversations, étiquetage
- Multi-tenant (workspaces/équipes)
- Widget personnalisable
- Journal d’escalades

## Modèle économique & rentabilité
- Abonnements mensuels (Starter/Pro/Enterprise) + dépassement à l’usage (tokens/convos).
- B2B avec forte valeur → **rentabilité élevée**, LTV importante, churn modéré.

## Coûts (COGS)
- Embeddings + requêtes LLM (modérés)
- Stockage documents
- Eventuel Redis/queue
**Estimation**: faible à modéré (maîtrisable via cache/quotas).

## Garde-fous coûts
- Paywall avant usage intensif
- Quotas mensuels, throttling
- Mise en cache des réponses fréquentes

## Risques
- Données obsolètes → prévoir rafraîchissement
- Variabilité coûts LLM → surveiller usage

## KPI
- Taux de self-service (% tickets résolus par IA)
- Coût par conversation
- Taux d’escalade
- MRR, churn, NPS
