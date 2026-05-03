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
        details: 'View Details',
        back_to_shop: 'Back to Collection',
        specifications: 'Specifications',
        material: 'Material',
        color: 'Color',
        size: 'Size Range',
        selection: 'Selection',
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
      },
      home: {
        hero_title: 'EMBRACE THE LIGHT',
        hero_subtitle: 'Premium Garments for a Modern Lifestyle',
        shop_now: 'EXPLORE COLLECTION',
        philosophy_title: 'Our Heritage',
        philosophy_text: 'Rooted in craftsmanship, WanJiaDengHuo brings together timeless elegance and contemporary trade expertise.',
        new_arrivals: 'New Arrivals'
      },
      about: {
        title: 'OUR STORY',
        subtitle: 'From a single light to ten thousand homes',
        mission: 'Our Mission',
        mission_text: 'To bridge global markets with premium quality apparel that feels like home.',
        history_title: 'The Journey',
        history_2020: 'Founded with a vision for global garment trade.',
        history_2022: 'Expanded to premium fabric sourcing and bespoke design.',
        history_2024: 'Established as a symbol of trust and warm quality.'
      },
      contact: {
        title: 'GET IN TOUCH',
        subtitle: 'We are here to illuminate your path',
        form_name: 'Full Name',
        form_email: 'Email Address',
        validation_required_name: 'Please enter your name',
        validation_required_email: 'Please enter your email address',
        validation_required_message: 'Please enter a message',
        form_message: 'Your Message',
        form_message_placeholder: 'Support Markdown (e.g. **bold**, - lists, # headers)',
        form_submit: 'SEND INQUIRY',
        address_title: 'Headquarters',
        address_text: '123 Fashion District, Shanghai, China',
        phone_title: 'Phone Number',
        email_title: 'Email Address',
        lang_code: 'en'
      },
      checkout: {
        title: 'REQUEST QUOTE',
        subtitle: 'Review your selection and finalize your inquiry',
        summary_title: 'Inquiry Summary',
        form_title: 'Business Information',
        form_company: 'Company Name',
        form_country: 'Country/Region',
        submit_quote: 'SUBMIT QUOTE REQUEST',
        success_title: 'Inquiry Received',
        success_text: 'Our dedicated trade representative will contact you within 24 hours.'
      },
      footer: {
        copyright: '© 2024 WanJiaDengHuo (WanJia Lights) Trading Co., Ltd. All rights reserved.',
        auth_statement: 'Official Authorized Distribution Platform.',
        links: {
          privacy: 'Privacy Policy',
          terms: 'Terms of Service',
          shipping: 'Shipping Info',
          returns: 'Returns & Exchanges'
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
        details: '查看详情',
        back_to_shop: '返回系列',
        specifications: '产品规格',
        material: '材质面料',
        color: '颜色',
        size: '尺码范围',
        selection: '您的选择',
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
      },
      home: {
        hero_title: '点亮生活之光',
        hero_subtitle: '为现代生活打造的高端服饰',
        shop_now: '探索系列',
        philosophy_title: '我们的传承',
        philosophy_text: '万家灯火立足匠心，将永恒的优雅与专业的贸易专长融合。',
        new_arrivals: '新品推荐'
      },
      about: {
        title: '品牌故事',
        subtitle: '从微光一点，到万家灯火',
        mission: '企业使命',
        mission_text: '连接全球市场，提供如家般温馨的高品质成衣。',
        history_title: '品牌历程',
        history_2020: '带着对全球成衣贸易的愿景成立。',
        history_2022: '扩展至高端面料采购与定制化设计领域。',
        history_2024: '确立了作为信任与温暖品质的行业标杆地位。'
      },
      contact: {
        title: '联系我们',
        subtitle: '我们愿为您照亮前行的道路',
        form_name: '您的姓名',
        form_email: '电子邮件',
        validation_required_name: '请输入您的姓名',
        validation_required_email: '请输入您的电子邮箱',
        validation_required_message: '请输入留言内容',
        form_message: '留言内容',
        form_message_placeholder: '支持 Markdown（例如 **加粗**、- 列表、# 标题）',
        form_submit: '发送咨询',
        address_title: '总部地址',
        address_text: '中国上海市时尚区123号',
        phone_title: '联系电话',
        email_title: '电子邮箱',
        lang_code: 'zh-CN'
      },
      checkout: {
        title: '申请报价',
        subtitle: '核对您的选择并完成咨询请求',
        summary_title: '咨询清单',
        form_title: '商务信息',
        form_company: '公司名称',
        form_country: '国家/地区',
        submit_quote: '提交报价请求',
        success_title: '咨询已受理',
        success_text: '我们的专属贸易代表将在24小时内与您取得联系。'
      },
      footer: {
        copyright: '© 2024 万家灯火贸易有限公司。保留所有权利。',
        auth_statement: '官方授权销售平台。',
        links: {
          privacy: '隐私政策',
          terms: '服务条款',
          shipping: '物流信息',
          returns: '退换货政策'
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
