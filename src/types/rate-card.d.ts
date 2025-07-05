declare module '@/constants/rate-card.json' {
  interface MarketingStrategyVariant {
    market: string;
    price: string;
    duration: string;
    inclusions: string[];
  }

  interface MarketingStrategyPackage {
    title: string;
    description?: string;
    variants: MarketingStrategyVariant[];
  }

  interface SocialMediaManagement {
    title: string;
    price: string;
    best_for: string;
    inclusions: string[];
    terms: string[];
  }

  interface ReelVariant {
    type: string;
    price: string;
    description?: string;
    inclusions: string[];
    terms?: string[];
  }

  interface ReelStrategyProduction {
    title: string;
    variants: ReelVariant[];
  }

  interface CampaignStep {
    phase: string;
    price?: string;
    price_from?: string;
    inclusions?: string[];
    location_coverage?: string[];
  }

  interface CampaignShoot {
    title: string;
    steps: CampaignStep[];
    terms: string[];
  }

  interface KreatorInvestment {
    type: string;
    price: string;
  }

  interface TKHKreators {
    title: string;
    description: string;
    investments: KreatorInvestment[];
    terms: string[];
    note: string;
  }

  interface RateCardData {
    marketing_strategy_packages: MarketingStrategyPackage[];
    marketing_strategy_terms: string[];
    social_media_management: SocialMediaManagement;
    reel_strategy_production: ReelStrategyProduction;
    campaign_shoot: CampaignShoot;
    tkh_kreators: TKHKreators;
  }

  const value: RateCardData;
  export default value;
}
