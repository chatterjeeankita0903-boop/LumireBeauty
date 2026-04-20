export type Category =
  | "Skincare"
  | "Makeup"
  | "Haircare"
  | "Bodycare"
  | "Fragrance";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  tagline: string;
  claims: string[];
}

export const CATEGORIES: Category[] = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Bodycare",
  "Fragrance",
];

export const products: Product[] = [
  // Skincare
  { id: "glowlab-vitc", name: "GlowLab Vitamin C Serum", category: "Skincare", price: 3199, tagline: "Your daily dose of radiance", claims: ["Brightening", "Dark spot reduction", "Antioxidant protection"] },
  { id: "aquaplump-ha", name: "AquaPlump Hyaluronic Serum", category: "Skincare", price: 2699, tagline: "Plump. Hydrate. Glow.", claims: ["24hr hydration", "Plumping effect", "Suitable all skin types"] },
  { id: "pureglow-toner", name: "PureGlow Niacinamide Toner", category: "Skincare", price: 1999, tagline: "Visibly refined, effortlessly calm", claims: ["Pore minimising", "Redness reduction", "Brightening"] },
  { id: "dermaclear-wash", name: "DermaClear Salicylic Acid Wash", category: "Skincare", price: 1499, tagline: "Clear skin starts here", claims: ["Acne-clearing", "Oil control", "BHA exfoliation"] },
  { id: "retinolrich-night", name: "RetinolRich Night Cream", category: "Skincare", price: 4599, tagline: "Wake up to younger-looking skin", claims: ["Anti-ageing", "Fine line reduction", "Cell turnover"] },
  { id: "pureclay-mask", name: "PureClay Detox Mask", category: "Skincare", price: 2349, tagline: "Deep clean. Deep glow.", claims: ["Deep pore cleansing", "Oil absorption", "Detox"] },
  // Makeup
  { id: "luxelip-matte", name: "LuxeLip Matte Lipstick", category: "Makeup", price: 1849, tagline: "18 shades of effortless confidence", claims: ["Long-wear matte", "18 shades", "Transfer-proof"] },
  { id: "browperfect-pencil", name: "BrowPerfect Pencil", category: "Makeup", price: 1349, tagline: "Precision-defined brows, all day", claims: ["Micro-precision tip", "Waterproof", "12 shades"] },
  { id: "stayall-foundation", name: "StayAll Foundation SPF30", category: "Makeup", price: 3699, tagline: "Flawless. Protected. All day.", claims: ["Full coverage", "SPF30 protection", "24hr wear"] },
  { id: "pixelperfect-spray", name: "PixelPerfect Setting Spray", category: "Makeup", price: 1699, tagline: "Set it. Forget it.", claims: ["Long-wear setting", "Hydrating mist", "Vegan formula"] },
  // Haircare
  { id: "silkshine-argan", name: "SilkShine Argan Oil", category: "Haircare", price: 2849, tagline: "Frizz-free, mirror shine", claims: ["Frizz control", "Mirror shine", "Heat protection up to 230°C"] },
  { id: "volumeboost-dry", name: "VolumeBoost Dry Shampoo", category: "Haircare", price: 1199, tagline: "Refresh in seconds", claims: ["Oil absorption", "Volume boost", "Instant refresh"] },
  { id: "repairritual-mask", name: "RepairRitual Protein Mask", category: "Haircare", price: 3199, tagline: "Restore. Rebuild. Revive.", claims: ["Damaged hair repair", "Protein bond rebuild", "Deep conditioning"] },
  // Bodycare
  { id: "softskin-shea", name: "SoftSkin Shea Butter Lotion", category: "Bodycare", price: 1699, tagline: "Wrap yourself in 24hr moisture", claims: ["24hr moisturisation", "Pure shea butter", "All skin types"] },
  { id: "exfoglow-coffee", name: "ExfoGlow Coffee Scrub", category: "Bodycare", price: 2199, tagline: "Buff away dullness", claims: ["Physical exfoliation", "Circulation boost", "Smoothing finish"] },
  // Fragrance
  { id: "bloom-edp", name: "Bloom Eau de Parfum", category: "Fragrance", price: 7149, tagline: "A floral story that lingers", claims: ["Floral-woody accord", "10hr longevity", "Vegan & cruelty-free"] },
  { id: "cedarmusk-cologne", name: "CedarMusk Cologne", category: "Fragrance", price: 6549, tagline: "Sophisticated. Sensual. Unforgettable.", claims: ["Woody-musky accord", "Sophisticated base", "8hr longevity"] },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const productsByCategory = (cat: Category) =>
  products.filter((p) => p.category === cat);

export const categoryGradient = (cat: Category): string => {
  switch (cat) {
    case "Skincare": return "gradient-skincare";
    case "Makeup": return "gradient-makeup";
    case "Haircare": return "gradient-haircare";
    case "Bodycare": return "gradient-bodycare";
    case "Fragrance": return "gradient-fragrance";
  }
};

import skincareImg from "@/assets/cat-skincare.jpg";
import makeupImg from "@/assets/cat-makeup.jpg";
import haircareImg from "@/assets/cat-haircare.jpg";
import bodycareImg from "@/assets/cat-bodycare.jpg";
import fragranceImg from "@/assets/cat-fragrance.jpg";

export const categoryImage = (cat: Category): string => {
  switch (cat) {
    case "Skincare": return skincareImg;
    case "Makeup": return makeupImg;
    case "Haircare": return haircareImg;
    case "Bodycare": return bodycareImg;
    case "Fragrance": return fragranceImg;
  }
};
