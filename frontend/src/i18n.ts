import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'HOME',
        shop: 'SHOP',
        about: 'ABOUT US',
        promotions: 'PROMOTIONS',
        contact: 'CONTACT'
      },
      brand: {
        name: 'WANJIA LIGHTS',
        subtitle: 'TRADING CO., LTD.'
      },
      shop: {
        title: 'WanJia Choice',
        subtitle: 'WanJia Lights, Warm Every Home — Discover your exclusive style',
        search_placeholder: 'Search by style, color, or fabric...',
        results_found: '{{count}} exquisite item found',
        results_found_plural: '{{count}} exquisite items found',
        loading: 'Curating your selection...'
      },
      cart: {
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        total_items: 'Total Items:',
        checkout: 'Request Quote',
        clear: 'Clear List'
      },
      product: {
        available: 'Available',
        low_stock: 'Low Stock',
        out_of_stock: 'Out of Stock',
        add_to_cart: 'Add to Cart',
        card: {
          artwork: 'Clothing product artwork',
          left: '{{count}} LEFT',
          quantity: 'Quantity',
          qty: 'Qty',
          adding: 'Adding...',
          addToBag: 'ADD TO BAG',
          soldOut: 'SOLD OUT',
          status: {
            available: 'Ready to Wear',
            lowStock: 'Low Stock - Order Now',
            soldOut: 'Sold Out'
          }
        }
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        shop: '商店',
        about: '关于我们',
        promotions: '优惠活动',
        contact: '联系我们'
      },
      brand: {
        name: '万家灯火',
        subtitle: '贸易有限公司'
      },
      shop: {
        title: '万家甄选系列',
        subtitle: '万家灯火，温暖每一家 —— 发现您的专属时尚风格',
        search_placeholder: '搜索款式、颜色或面料...',
        results_found: '共找到 {{count}} 件精选单品',
        results_found_plural: '共找到 {{count}} 件精选单品',
        loading: '正在为您挑选...'
      },
      cart: {
        title: '购物车',
        empty: '您的购物车是空的',
        total_items: '总计件数：',
        checkout: '申请报价',
        clear: '清空列表'
      },
      product: {
        available: '有货',
        low_stock: '库存紧张',
        out_of_stock: '缺货',
        add_to_cart: '加入购物车',
        card: {
          artwork: '服装商品展示图',
          left: '剩余 {{count}} 件',
          quantity: '数量',
          qty: '数量',
          adding: '加入中...',
          addToBag: '加入购物袋',
          soldOut: '已售罄',
          status: {
            available: '现货可穿',
            lowStock: '库存紧张 - 立即下单',
            soldOut: '已售罄'
          }
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
