import { DealsPage } from "@/components/DealsPage";
import { Deal } from "@/lib/types";

const SAMPLE_DEALS: Deal[] = [
  { id: "1", name: "Nike Pegasus 41", brand: "Nike", category: "Daily Trainer", originalPrice: 140, dealPrice: 89.97, discount: 36, store: "Nike.com", link: "#", image: "/shoes/pegasus.jpg", hot: true, postedAt: new Date().toISOString() },
  { id: "2", name: "ASICS Gel-Nimbus 26", brand: "ASICS", category: "Daily Trainer", originalPrice: 160, dealPrice: 99.95, discount: 38, store: "Running Warehouse", link: "#", image: "/shoes/nimbus.jpg", hot: true, postedAt: new Date().toISOString() },
  { id: "3", name: "Brooks Ghost 16", brand: "Brooks", category: "Daily Trainer", originalPrice: 140, dealPrice: 104.99, discount: 25, store: "Amazon", link: "#", image: "/shoes/ghost.jpg", hot: false, postedAt: new Date().toISOString() },
  { id: "4", name: "Nike Vaporfly 3", brand: "Nike", category: "Racing", originalPrice: 260, dealPrice: 155.97, discount: 40, store: "Dick's", link: "#", image: "/shoes/vaporfly.jpg", hot: true, postedAt: new Date().toISOString() },
  { id: "5", name: "Hoka Speedgoat 6", brand: "Hoka", category: "Trail", originalPrice: 155, dealPrice: 108.50, discount: 30, store: "REI", link: "#", image: "/shoes/speedgoat.jpg", hot: false, postedAt: new Date().toISOString() },
  { id: "6", name: "New Balance 1080v14", brand: "New Balance", category: "Daily Trainer", originalPrice: 165, dealPrice: 114.99, discount: 30, store: "Zappos", link: "#", image: "/shoes/nb1080.jpg", hot: false, postedAt: new Date().toISOString() },
  { id: "7", name: "Saucony Endorphin Speed 4", brand: "Saucony", category: "Racing", originalPrice: 170, dealPrice: 101.97, discount: 40, store: "Running Warehouse", link: "#", image: "/shoes/endorphin.jpg", hot: true, postedAt: new Date().toISOString() },
  { id: "8", name: "ASICS GT-2000 13", brand: "ASICS", category: "Stability", originalPrice: 140, dealPrice: 83.95, discount: 40, store: "Amazon", link: "#", image: "/shoes/gt2000.jpg", hot: true, postedAt: new Date().toISOString() },
];

export default function Home() {
  return <DealsPage initialDeals={SAMPLE_DEALS} />;
}
