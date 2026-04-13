import { useState, useEffect, useCallback, useRef, useMemo, Fragment } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import {
  LayoutDashboard, Zap, Users, FileText, AlertTriangle, Banknote, Settings, Search,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle,
  Upload, Download, Plus, Eye, RefreshCw, Send, Phone, Mail, MessageSquare, MessageCircle, Paperclip, Bell,
  Building2, Shield, ClipboardList, CreditCard, Calendar, ArrowRight, ArrowLeft, X, Check, Loader2,
  FileSpreadsheet, ToggleLeft, ToggleRight, UserPlus, Info, ExternalLink, Hash,
  CircleDot, Milestone, Timer, Ban, Gavel, Receipt, Archive, Pen,
  ArrowUpRight, ArrowDownRight, Command, BellDot, ChevronLeft, SortAsc, SortDesc
} from "lucide-react";

const B = {
  accent: "#3B82F6", accentL: "#DBEAFE",
  purple: "#8B5CF6", purpleL: "#EDE9FE",
  green: "#10B981", greenL: "#D1FAE5",
  yellow: "#F59E0B", yellowL: "#FEF3C7",
  red: "#EF4444", redL: "#FEE2E2",
  orange: "#F97316",
  sidebar: "#0F172A",
  bg: "#F8FAFC", white: "#FFFFFF", border: "#E2E8F0",
  t1: "#0F172A", t2: "#64748B", t3: "#94A3B8",
};

const COMPANY = { name: "ООО «СитиБетонСтрой»", unp: "690666116", director: "Дерябина Ольга Николаевна", address: "Минский р-н, аг. Ждановичи, ул. Зелёная, 1В, пом. 30", account: "BY92 BAPB 3012 3693 4001 0000 0000", phone: "+375 (44) 545-26-26", email: "info@sitibeton.by", since: "2008" };

// --- CREDITOR context data ---
const BUYERS = [
  { id:1, name:"ООО «БелТехСнаб»", unp:"190456789", status:"green", limit:150000, used:85000, available:65000, bankClient:true, lastDeal:"2026-03-15", deals:12, maxTerm:90, regDate:"2018-03-12", rate:25, inviteStatus:"active" },
  { id:2, name:"ЧУП «СтройИнвест»", unp:"191234567", status:"green", limit:200000, used:120000, available:80000, bankClient:true, lastDeal:"2026-03-18", deals:8, maxTerm:60, regDate:"2015-07-22", rate:20.5, inviteStatus:"active" },
  { id:3, name:"ОАО «МинскПромТорг»", unp:"100987654", status:"yellow", limit:75000, used:0, available:75000, bankClient:false, lastDeal:null, deals:0, maxTerm:30, regDate:"2021-11-03", rate:30, inviteStatus:"invited" },
  { id:4, name:"ООО «ГрандЛогистик»", unp:"192345678", status:"green", limit:300000, used:200000, available:100000, bankClient:true, lastDeal:"2026-03-20", deals:15, maxTerm:90, regDate:"2012-01-18", rate:25, inviteStatus:"active" },
  { id:5, name:"ИП Козловский А.В.", unp:"790123456", status:"red", limit:0, used:0, available:0, bankClient:false, lastDeal:null, deals:0, maxTerm:0, regDate:"2025-09-01", rate:0, inviteStatus:"rejected" },
  { id:6, name:"ООО «АгроТрейд Плюс»", unp:"193456789", status:"green", limit:180000, used:45000, available:135000, bankClient:false, lastDeal:"2026-02-28", deals:5, maxTerm:60, regDate:"2019-06-15", rate:30, inviteStatus:"active" },
  { id:7, name:"ЧТУП «ЕвроКомплект»", unp:"194567890", status:"yellow", limit:50000, used:0, available:50000, bankClient:false, lastDeal:null, deals:0, maxTerm:30, regDate:"2023-02-20", rate:25, inviteStatus:"registered" },
];

const CR_DEALS = [
  { id:"УС-2026-0042", buyerId:1, amount:45000, shipDate:"2026-03-15", dueDate:"2026-06-13", status:"active", term:90, discount:2774, toReceive:42226, daysLeft:83, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №42 к ГД №1" },
  { id:"УС-2026-0041", buyerId:2, amount:60000, shipDate:"2026-03-10", dueDate:"2026-05-09", status:"active", term:60, discount:2022, toReceive:57978, daysLeft:48, docType:"act", ecpStatus:"signed", notifyStatus:"sent", supAg:"ДС №41 к ГД №1" },
  { id:"УС-2026-0040", buyerId:4, amount:120000, shipDate:"2026-03-01", dueDate:"2026-05-30", status:"active", term:90, discount:7397, toReceive:112603, daysLeft:69, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №40 к ГД №1" },
  { id:"УС-2026-0039", buyerId:1, amount:40000, shipDate:"2026-02-15", dueDate:"2026-04-16", status:"active", term:60, discount:1644, toReceive:38356, daysLeft:25, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №39 к ГД №1" },
  { id:"УС-2026-0038", buyerId:6, amount:25000, shipDate:"2026-02-01", dueDate:"2026-04-02", status:"active", term:60, discount:1233, toReceive:23767, daysLeft:11, docType:"act", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №38 к ГД №1" },
  { id:"УС-2026-0037", buyerId:4, amount:80000, shipDate:"2026-01-20", dueDate:"2026-03-21", status:"overdue", term:60, discount:3288, toReceive:76712, daysLeft:-1, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №37 к ГД №1" },
  { id:"УС-2026-0036", buyerId:2, amount:55000, shipDate:"2026-01-10", dueDate:"2026-03-11", status:"overdue", term:60, discount:1854, toReceive:53146, daysLeft:-11, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №36 к ГД №1" },
  { id:"УС-2026-0035", buyerId:1, amount:35000, shipDate:"2025-12-15", dueDate:"2026-02-13", status:"paid", term:60, discount:1438, toReceive:33562, daysLeft:0, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №35 к ГД №1" },
  { id:"УС-2026-0034", buyerId:4, amount:90000, shipDate:"2025-12-01", dueDate:"2026-01-30", status:"paid", term:60, discount:3699, toReceive:86301, daysLeft:0, docType:"ttn", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №34 к ГД №1" },
  { id:"УС-2026-0033", buyerId:6, amount:20000, shipDate:"2025-11-15", dueDate:"2026-01-14", status:"paid", term:60, discount:986, toReceive:19014, daysLeft:0, docType:"act", ecpStatus:"signed", notifyStatus:"confirmed", supAg:"ДС №33 к ГД №1" },
];

// --- DEBTOR context data ---
const SUPPLIERS = [
  { id:101, name:"ОАО «Белорусская Цементная Компания»", unp:"600123456", limit:200000, used:117000, available:83000, rate:25 },
  { id:102, name:"ООО «ПесокТранс»", unp:"600789012", limit:80000, used:0, available:80000, rate:20.5 },
];

const DB_DEALS = [
  { id:"УС-2026-1001", supplierId:101, amount:85000, shipDate:"2026-03-05", dueDate:"2026-05-04", status:"active", term:60, daysLeft:54, product:"Цемент ПЦ-500, 340 тонн", confirmed:true, notifyDate:"2026-03-05" },
  { id:"УС-2026-1002", supplierId:101, amount:32000, shipDate:"2026-03-18", dueDate:"2026-05-17", status:"pending", term:60, daysLeft:67, product:"Цемент ПЦ-400, 128 тонн", confirmed:false, notifyDate:"2026-03-18" },
  { id:"УС-2026-1003", supplierId:101, amount:45000, shipDate:"2026-01-10", dueDate:"2026-03-11", status:"paid", term:60, daysLeft:0, product:"Цемент ПЦ-500, 180 тонн", confirmed:true, notifyDate:"2026-01-10" },
];

const DB_PAYMENTS = [
  { id:1, dealId:"УС-2026-1001", supplier:"ОАО «Белорусская Цементная Компания»", amount:85000, dueDate:"2026-05-04", status:"upcoming", daysLeft:54, bankAccount:"BY20 NEOB 3819 0000 0001 2345" },
  { id:2, dealId:"УС-2026-1002", supplier:"ОАО «Белорусская Цементная Компания»", amount:32000, dueDate:"2026-05-17", status:"upcoming", daysLeft:67, bankAccount:"BY20 NEOB 3819 0000 0001 2345" },
];

const NOTIFICATIONS = [
  { id:1, ctx:"creditor", text:"ООО «БелТехСнаб» оплатил уступку УС-2026-0035 — лимит восстановлен (+35 000 BYN)", type:"success", time:"2 ч назад" },
  { id:2, ctx:"creditor", text:"Новый покупатель ООО «АгроТрейд Плюс» одобрен банком. Лимит: 180 000 BYN", type:"info", time:"вчера" },
  { id:3, ctx:"creditor", text:"Просрочка по уступке УС-2026-0037 — ООО «ГрандЛогистик»", type:"warning", time:"сегодня" },
  { id:4, ctx:"debtor", text:"Новая уступка от ОАО «Белорусская Цементная Компания» на 32 000 BYN — подтвердите получение", type:"warning", time:"2 ч назад" },
  { id:5, ctx:"debtor", text:"Платёж 85 000 BYN до 04.05.2026 — осталось 54 дня", type:"info", time:"сегодня" },
  { id:6, ctx:"debtor", text:"Платёж по УС-2026-1003 подтверждён банком — лимит восстановлен", type:"success", time:"3 дня назад" },
];

const gmvData = [
  { month:"Окт", v:180000 }, { month:"Ноя", v:245000 }, { month:"Дек", v:310000 },
  { month:"Янв", v:275000 }, { month:"Фев", v:420000 }, { month:"Мар", v:385000 },
];

const SCORING_HISTORY = [
  { date:"2026-03-20", unp:"190456789", company:"ООО «БелТехСнаб»", result:"green", limit:150000 },
  { date:"2026-03-18", unp:"790123456", company:"ИП Козловский А.В.", result:"red", limit:0 },
  { date:"2026-03-15", unp:"194567890", company:"ЧТУП «ЕвроКомплект»", result:"green", limit:50000 },
];

const FINANCE_MONTHS = [
  { month:"Март 2026", deals:3, total:225000, discount:12193, received:212807, status:"pending", deadline:"15 апреля" },
  { month:"Февраль 2026", deals:2, total:65000, discount:2877, received:62123, status:"paid", deadline:"15 марта" },
  { month:"Январь 2026", deals:2, total:145000, discount:6987, received:138013, status:"paid", deadline:"15 февраля" },
];

const PLATFORM_PARTNERS = [
  { id:201, name:"ОАО «Керамин»", unp:"100234567", industry:"Стройматериалы", category:"Производство", since:"2025-11", description:"Производство керамической плитки и санитарной керамики. Один из крупнейших производителей в Беларуси.", scoring:"A", maxLimit:250000, terms:[30,60,90], deals:12, partners:3, overdue:0, avgCheck:85000, lastActive:"2026-03-18", products:["Керамическая плитка","Санитарная керамика","Керамогранит","Декор"], city:"г. Минск", phone:"+375 17 239-25-25", website:"keramin.com", email:"sales@keramin.com" },
  { id:202, name:"ОАО «Забудова»", unp:"100345678", industry:"Строительство", category:"Генподряд", since:"2025-09", description:"Жилищное и промышленное строительство. Полный цикл от проекта до сдачи.", scoring:"A", maxLimit:400000, terms:[30,60,90], deals:18, partners:5, overdue:0, avgCheck:120000, lastActive:"2026-03-20", products:["Жилищное строительство","Промышленное строительство","Реконструкция"], city:"Минский р-н", phone:"+375 17 500-00-00", website:"zabudova.by", email:"info@zabudova.by" },
  { id:203, name:"ООО «КровТрейд»", unp:"190567890", industry:"Стройматериалы", category:"Торговля", since:"2026-01", description:"Кровельные и фасадные материалы оптом. Работаем со всеми регионами.", scoring:"B", maxLimit:120000, terms:[30,60], deals:5, partners:2, overdue:0, avgCheck:45000, lastActive:"2026-03-15", products:["Кровельные материалы","Фасадные системы","Водосточные системы"], city:"г. Минск", phone:"+375 29 123-45-67", website:"krovtrade.by", email:"opt@krovtrade.by" },
  { id:204, name:"СООО «Хенкель Баутехник»", unp:"800123456", industry:"Стройматериалы", category:"Производство", since:"2025-08", description:"Сухие строительные смеси, клеи, герметики. Международный производитель.", scoring:"A", maxLimit:300000, terms:[30,60,90], deals:22, partners:7, overdue:0, avgCheck:95000, lastActive:"2026-03-22", products:["Сухие смеси","Клеи для плитки","Герметики","Затирки"], city:"г. Заславль", phone:"+375 17 540-00-00", website:"henkel.by", email:"info@henkel.by" },
  { id:205, name:"ООО «АвтоЛайнГрупп»", unp:"190678901", industry:"Логистика", category:"Грузоперевозки", since:"2025-12", description:"Международные и внутренние грузоперевозки. Автопарк 50+ машин.", scoring:"B", maxLimit:150000, terms:[30,60], deals:8, partners:4, overdue:0, avgCheck:35000, lastActive:"2026-03-19", products:["Грузоперевозки по РБ","Международные перевозки","Экспресс-доставка"], city:"г. Минск", phone:"+375 29 987-65-43", website:"autolinegroup.by", email:"logistics@alg.by" },
  { id:206, name:"ЧУП «ЕвроТранзит»", unp:"191789012", industry:"Логистика", category:"Экспедирование", since:"2026-02", description:"Транспортно-экспедиционные услуги. Таможенное оформление.", scoring:"B", maxLimit:100000, terms:[30,60], deals:3, partners:2, overdue:0, avgCheck:28000, lastActive:"2026-03-10", products:["Экспедирование","Таможенное оформление","Складское хранение"], city:"г. Брест", phone:"+375 16 200-00-00", website:"eurotransit.by", email:"info@eurotransit.by" },
  { id:207, name:"ОАО «Савушкин продукт»", unp:"200123456", industry:"Продукты питания", category:"Производство", since:"2025-07", description:"Молочная продукция, соки, детское питание. Лидер рынка.", scoring:"A", maxLimit:500000, terms:[30,60,90], deals:35, partners:12, overdue:0, avgCheck:110000, lastActive:"2026-03-22", products:["Молочная продукция","Соки","Детское питание","Сыры"], city:"г. Брест", phone:"+375 16 246-00-00", website:"savushkin.com", email:"sales@savushkin.com" },
  { id:208, name:"ОАО «Лидское пиво»", unp:"200234567", industry:"Продукты питания", category:"Производство", since:"2025-10", description:"Пивоваренная продукция, безалкогольные напитки.", scoring:"A", maxLimit:350000, terms:[30,60,90], deals:15, partners:6, overdue:0, avgCheck:75000, lastActive:"2026-03-17", products:["Пиво","Безалкогольные напитки","Квас","Сидр"], city:"г. Лида", phone:"+375 15 461-00-00", website:"lidskoe.by", email:"sales@lidskoe.by" },
  { id:209, name:"ООО «АгроФрут Импорт»", unp:"190890123", industry:"Продукты питания", category:"Торговля", since:"2025-11", description:"Импорт свежих фруктов и овощей из 15 стран.", scoring:"B", maxLimit:180000, terms:[30,60], deals:10, partners:3, overdue:1, avgCheck:55000, lastActive:"2026-03-21", products:["Фрукты","Овощи","Экзотика","Орехи"], city:"г. Минск", phone:"+375 29 555-00-00", website:"agrofruit.by", email:"import@agrofruit.by" },
  { id:210, name:"КСУП «Агрокомбинат Дзержинский»", unp:"600345678", industry:"Сельское хозяйство", category:"Производство", since:"2025-09", description:"Мясная продукция, полуфабрикаты. Полный цикл переработки.", scoring:"B", maxLimit:200000, terms:[30,60], deals:7, partners:3, overdue:0, avgCheck:65000, lastActive:"2026-03-14", products:["Мясная продукция","Полуфабрикаты","Колбасы"], city:"Дзержинский р-н", phone:"+375 17 162-00-00", website:"agrokom.by", email:"sales@agrokom.by" },
  { id:211, name:"ООО «СофтКлаб Бел»", unp:"190901234", industry:"IT", category:"Разработка ПО", since:"2026-01", description:"Разработка банковского и финансового ПО. Интеграции.", scoring:"A", maxLimit:200000, terms:[30,60,90], deals:4, partners:2, overdue:0, avgCheck:90000, lastActive:"2026-03-20", products:["Банковское ПО","Финтех решения","Интеграции","Консалтинг"], city:"г. Минск", phone:"+375 17 300-00-00", website:"softclub.by", email:"info@softclub.by" },
  { id:212, name:"ЧУП «БизнесКонсалт»", unp:"191012345", industry:"Услуги", category:"Консалтинг", since:"2026-02", description:"Бухгалтерские и юридические услуги для МСБ.", scoring:"B", maxLimit:80000, terms:[30], deals:2, partners:1, overdue:0, avgCheck:25000, lastActive:"2026-03-08", products:["Бухгалтерия","Юридические услуги","Аудит","Налоги"], city:"г. Минск", phone:"+375 29 111-22-33", website:"bizconsult.by", email:"info@bizconsult.by" },
  { id:213, name:"ОАО «Атлант»", unp:"100456789", industry:"Промышленность", category:"Производство", since:"2025-08", description:"Холодильники, морозильники, стиральные машины. Экспорт в 30 стран.", scoring:"A", maxLimit:450000, terms:[30,60,90], deals:20, partners:8, overdue:0, avgCheck:130000, lastActive:"2026-03-22", products:["Холодильники","Морозильники","Стиральные машины"], city:"г. Минск", phone:"+375 17 245-00-00", website:"atlant.by", email:"sales@atlant.by" },
  { id:214, name:"ОАО «Белшина»", unp:"300123456", industry:"Промышленность", category:"Производство", since:"2025-10", description:"Шины для легковых, грузовых и с/х машин.", scoring:"A", maxLimit:380000, terms:[30,60,90], deals:16, partners:5, overdue:0, avgCheck:100000, lastActive:"2026-03-19", products:["Легковые шины","Грузовые шины","С/х шины","Индустриальные шины"], city:"г. Бобруйск", phone:"+375 22 531-00-00", website:"belshina.by", email:"sales@belshina.by" },
  { id:215, name:"ООО «ПромТехСнаб»", unp:"192123456", industry:"Промышленность", category:"Торговля", since:"2025-12", description:"Промышленное оборудование и комплектующие.", scoring:"B", maxLimit:160000, terms:[30,60], deals:6, partners:3, overdue:0, avgCheck:48000, lastActive:"2026-03-16", products:["Оборудование","Комплектующие","Инструмент","Расходники"], city:"г. Минск", phone:"+375 17 350-00-00", website:"promtechsnab.by", email:"info@pts.by" },
  { id:216, name:"ООО «Евроторг»", unp:"100567890", industry:"Ритейл", category:"Розничная торговля", since:"2025-07", description:"Сеть гипермаркетов «Евроопт», «Хит!». 1000+ магазинов.", scoring:"A", maxLimit:600000, terms:[30,60,90], deals:45, partners:15, overdue:0, avgCheck:150000, lastActive:"2026-03-22", products:["Продукты питания","Бытовая химия","Товары для дома"], city:"г. Минск", phone:"+375 17 279-00-00", website:"eurotorg.by", email:"partners@eurotorg.by" },
  { id:217, name:"ОАО «Белагроторг»", unp:"100678901", industry:"Торговля", category:"Оптовая торговля", since:"2025-09", description:"Оптовые поставки продуктов питания по всей Беларуси.", scoring:"A", maxLimit:320000, terms:[30,60,90], deals:14, partners:6, overdue:0, avgCheck:88000, lastActive:"2026-03-20", products:["Продукты оптом","Бакалея","Консервация","Напитки"], city:"г. Минск", phone:"+375 17 270-00-00", website:"belagrotorg.by", email:"opt@belagrotorg.by" },
  { id:218, name:"ООО «ЭнергоМонтаж»", unp:"192234567", industry:"Энергетика", category:"Монтаж", since:"2026-01", description:"Монтаж и обслуживание электрооборудования.", scoring:"B", maxLimit:140000, terms:[30,60], deals:4, partners:2, overdue:0, avgCheck:42000, lastActive:"2026-03-12", products:["Электромонтаж","Обслуживание","Проектирование","Автоматизация"], city:"г. Гомель", phone:"+375 23 200-00-00", website:"energomontazh.by", email:"info@em.by" },
];

const INDUSTRIES = ["Все отрасли","Стройматериалы","Строительство","Логистика","Продукты питания","Сельское хозяйство","IT","Услуги","Промышленность","Ритейл","Торговля","Энергетика"];
const INDUSTRY_COLORS = {Стройматериалы:B.orange,Строительство:"#D97706",Логистика:B.accent,"Продукты питания":B.green,"Сельское хозяйство":"#059669",IT:B.purple,Услуги:"#6366F1",Промышленность:"#475569",Ритейл:"#EC4899",Торговля:"#0EA5E9",Энергетика:B.yellow};

const fmt = n => new Intl.NumberFormat("ru-BY").format(n);
const fmtByn = n => `${fmt(n)} BYN`;
const calcDiscount = (amount, rate, days) => Math.round(amount * (rate / 100 / 365) * days);
const calcPeriodRate = (rate, days) => ((rate / 365) * days).toFixed(2);

const getCompanyName = (unp) => {
  const found = BUYERS.find(b => b.unp === unp);
  if (found) return found.name;
  const prefixes = ["ООО","ЧУП","ОАО","ЗАО","ЧТУП","ИП","СООО"];
  const names = ["«СтройМонтаж»","«БелРемСтрой»","«ТехноПарк»","«ГрандИнвест»","«МегаТрейд»","«ПромСервисГрупп»","«ЕвроСтандарт»","«АльфаКомплект»","«НоваТехнологии»","«БелЭнергоСтрой»","«МинскРесурс»","«СлавТрейдинг»","«ВестСнаб»","«ДельтаЛогистик»","«ПрофиСтройМатериалы»","«КомфортСервис»","«БизнесАльянс»","«ИнтерГрупп»","«Белагротех»","«МодульСтрой»"];
  const h = parseInt(unp)||0;
  return `${prefixes[h%prefixes.length]} ${names[h%names.length]}`;
};

const Abbr = ({children,full}) => <InfoTooltip text={full}><span className="border-b border-dotted border-slate-300 cursor-help">{children}</span></InfoTooltip>;

const copyText = (text) => {
  try { navigator.clipboard.writeText(text); } catch(e) {
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
  }
};

const getGreeting = () => { const h = new Date().getHours(); return h<6?"Доброй ночи":h<12?"Доброе утро":h<18?"Добрый день":"Добрый вечер"; };

const StatusBadge = ({ status, size="sm" }) => {
  const cfg = { green:{bg:B.greenL,c:B.green,l:"Одобрен"}, yellow:{bg:B.yellowL,c:B.yellow,l:"Ожидает одобрение"}, red:{bg:B.redL,c:B.red,l:"Отказ"}, active:{bg:B.accentL,c:B.accent,l:"Активна"}, paid:{bg:B.greenL,c:B.green,l:"Оплачена"}, overdue:{bg:B.redL,c:B.red,l:"Просрочена"}, pending:{bg:B.yellowL,c:B.yellow,l:"Ожидает"}, success:{bg:B.greenL,c:B.green,l:"✓"}, info:{bg:B.accentL,c:B.accent,l:"i"}, warning:{bg:B.yellowL,c:B.yellow,l:"!"}, confirmed:{bg:B.greenL,c:B.green,l:"Подтверждена"}, upcoming:{bg:B.accentL,c:B.accent,l:"Предстоит"} }[status]||{bg:"#f1f5f9",c:"#64748b",l:status};
  const s = size==="sm";
  return <span className={`inline-flex items-center gap-1 ${s?"py-0.5 px-2 text-xs":"py-1 px-3 text-sm"} rounded-full font-medium`} style={{background:cfg.bg,color:cfg.c}}><span className="w-1.5 h-1.5 rounded-full" style={{background:cfg.c}}/>{cfg.l}</span>;
};

const Card = ({children,className="",onClick,hover}) => <div onClick={onClick} className={`bg-white rounded-2xl border shadow-sm ${hover?"cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5":""} ${className}`} style={{borderColor:B.border}}>{children}</div>;

const PageHeader = ({title,subtitle}) => <div className="mb-6"><h1 className="text-2xl font-bold" style={{color:B.t1}}>{title}</h1>{subtitle&&<p className="mt-1 text-sm" style={{color:B.t2}}>{subtitle}</p>}</div>;

const TableRow = ({children,onClick,highlight}) => <tr onClick={onClick} className={`border-b border-slate-50 transition-colors duration-150 ${onClick?"cursor-pointer hover:bg-slate-50":""}`} style={highlight?{background:typeof highlight==="string"?highlight:"#FEF2F2"}:undefined}>{children}</tr>;

const Btn = ({children,variant="primary",size="md",onClick,disabled,icon:Icon,className=""}) => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap";
  const sz = {sm:"px-3 py-1.5 text-xs",md:"px-5 py-2.5 text-sm",lg:"px-6 py-3 text-base"}[size];
  const vars = { primary:`text-white shadow-sm ${disabled?"opacity-50 cursor-not-allowed":"hover:shadow-md hover:-translate-y-0.5"}`, secondary:`bg-slate-100 text-slate-700 hover:bg-slate-200`, ghost:"text-slate-600 hover:bg-slate-100", success:`text-white ${disabled?"opacity-50":"hover:-translate-y-0.5"}`, danger:"bg-red-50 text-red-600 hover:bg-red-100" }[variant];
  const bg = variant==="primary"?{background:B.accent}:variant==="success"?{background:B.green}:undefined;
  return <button onClick={disabled?undefined:onClick} className={`${base} ${sz} ${vars} ${className}`} style={bg}>{Icon&&<Icon size={size==="sm"?14:16}/>}{children}</button>;
};

const Modal = ({open,onClose,title,children,wide}) => {
  if(!open) return null;
  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,overflow:"auto",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:48,paddingBottom:48}} onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${wide?"w-full max-w-3xl":"w-full max-w-lg"} flex flex-col mx-4`} style={{maxHeight:"85vh"}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0"><h2 className="text-lg font-bold" style={{color:B.t1}}>{title}</h2><button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100"><X size={20} className="text-slate-400"/></button></div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
  </div>;
};

const Toast = ({message,type="success",onClose}) => {
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t)},[onClose]);
  const bg = type==="success"?B.green:type==="error"?B.red:B.accent;
  return <div className="fixed top-6 right-6 z-[100] animate-slide-in"><div className="flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg" style={{background:bg}}>{type==="success"?<CheckCircle size={18}/>:<Info size={18}/>}{message}</div></div>;
};

const InfoTooltip = ({text,children}) => {
  const [show,setShow]=useState(false);
  const ref=useRef(null);
  const [pos,setPos]=useState({left:0,right:false});
  const onEnter=()=>{setShow(true);if(ref.current){const r=ref.current.getBoundingClientRect();const overRight=r.left+140>window.innerWidth;setPos({right:overRight})}};
  return <span className="relative inline-flex items-center gap-1">{children}<span ref={ref} className="inline-flex items-center justify-center w-4 h-4 rounded-full cursor-help shrink-0" style={{background:show?"#E2E8F0":"#F1F5F9"}} onMouseEnter={onEnter} onMouseLeave={()=>setShow(false)}><Info size={10} style={{color:show?B.t1:B.t3}}/></span>{show&&<span className="absolute z-[100] top-full mt-2 px-3 py-2 rounded-xl text-xs text-white font-medium shadow-lg" style={{background:B.t1,maxWidth:260,minWidth:140,whiteSpace:"normal",lineHeight:"1.5",textAlign:"left",right:pos.right?0:undefined,left:pos.right?undefined:0}}>{text}</span>}</span>;
};

const Skeleton = () => <div className="animate-pulse"><div className="grid grid-cols-4 gap-4 mb-6">{[1,2,3,4].map(i=><div key={i} className="h-24 rounded-2xl bg-slate-100"/>)}</div><div className="rounded-2xl bg-white border border-slate-100">{[1,2,3,4,5].map(i=><div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-50"><div className="h-4 rounded bg-slate-100 flex-[2]"/><div className="h-4 rounded bg-slate-100 flex-[3]"/><div className="h-4 rounded bg-slate-50 flex-1"/></div>)}</div></div>;

const PageTransition = ({children,pageKey}) => { const [show,setShow]=useState(false); useEffect(()=>{setShow(false);const t=requestAnimationFrame(()=>setShow(true));return()=>cancelAnimationFrame(t)},[pageKey]); return <div className={`transition-all duration-300 ${show?"opacity-100 translate-y-0":"opacity-0 translate-y-2"}`}>{children}</div>; };

const Confetti = ({active}) => { if(!active) return null; const colors=[B.accent,B.green,B.yellow,"#A78BFA","#F472B6"]; return <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">{Array.from({length:40}).map((_,i)=><div key={i} className="absolute w-2 h-2 rounded-sm" style={{background:colors[i%colors.length],left:`${Math.random()*100}%`,top:"-5%",animation:`confetti-fall ${1.5+Math.random()*1.5}s ease-out ${Math.random()*0.5}s forwards`,transform:`rotate(${Math.random()*360}deg)`}}/>)}</div>; };

const CR_NAV = [
  {id:"cr-dashboard",label:"Дашборд",icon:LayoutDashboard},
  {id:"cr-tasks",label:"Задачи",icon:ClipboardList},
  {id:"cr-scoring",label:"Пре-скоринг",icon:Zap},
  {id:"cr-mass",label:"Массовый пре-скоринг",icon:FileSpreadsheet},
  {id:"cr-buyers",label:"Покупатели",icon:Users},
  {id:"cr-deals",label:"Реестр уступок",icon:FileText},
  {id:"cr-overdue",label:"Просрочки",icon:AlertTriangle},
  {id:"cr-documents",label:"Документы",icon:Archive},
  {id:"cr-finance",label:"Финансы",icon:Banknote},
  {id:"cr-profile",label:"Анкета компании",icon:CircleDot},
  {id:"cr-partners",label:"Партнёры платформы",icon:Building2},
  {id:"cr-messages",label:"Сообщения",icon:MessageCircle},
  {id:"cr-support",label:"Поддержка",icon:MessageSquare},
  {id:"cr-settings",label:"Настройки",icon:Settings},
];
const DB_NAV = [
  {id:"db-dashboard",label:"Дашборд",icon:LayoutDashboard},
  {id:"db-tasks",label:"Задачи",icon:ClipboardList},
  {id:"db-supplies",label:"Мои поставки",icon:FileText},
  {id:"db-payments",label:"График платежей",icon:Calendar},
  {id:"db-limit",label:"Факторинговый лимит",icon:Shield},
  {id:"db-documents",label:"Документы",icon:Archive},
  {id:"db-profile",label:"Анкета компании",icon:CircleDot},
  {id:"db-partners",label:"Партнёры платформы",icon:Building2},
  {id:"db-messages",label:"Сообщения",icon:MessageCircle},
  {id:"db-support",label:"Поддержка",icon:MessageSquare},
  {id:"db-settings",label:"Настройки",icon:Settings},
];

const Sidebar = ({ctx,setCtx,active,setActive}) => {
  const nav = ctx==="creditor"?CR_NAV:DB_NAV;
  const accent = ctx==="creditor"?B.accent:B.purple;
  const crCount = CR_DEALS.filter(d=>d.status==="active"||d.status==="overdue").length;
  const dbCount = DB_DEALS.filter(d=>d.status==="pending"||d.status==="active").length;
  const overdueCount = CR_DEALS.filter(d=>d.status==="overdue").length;
  const pendingConfirm = DB_DEALS.filter(d=>!d.confirmed).length;

  return <aside className="w-[250px] min-w-[250px] flex flex-col h-screen sticky top-0 z-40" style={{background:B.sidebar}}>
    <div className="px-5 py-5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg" style={{background:accent}}>F</div>
      <div><div className="text-white font-bold text-lg tracking-tight">Oborotka.by</div><div className="text-xs text-slate-400 -mt-0.5">Факторинговая платформа</div></div>
    </div>

    {/* Context switcher */}
    <div className="px-3 mb-3">
      <div className="flex rounded-xl overflow-hidden border border-slate-700" style={{background:"#1E293B"}}>
        <button onClick={()=>{setCtx("creditor");setActive("cr-dashboard")}} className={`flex-1 py-2.5 text-xs font-semibold transition-all ${ctx==="creditor"?"text-white":"text-slate-500 hover:text-slate-300"}`} style={ctx==="creditor"?{background:B.accent}:undefined}>
          Кредитор ({crCount})
        </button>
        <button onClick={()=>{setCtx("debtor");setActive("db-dashboard")}} className={`flex-1 py-2.5 text-xs font-semibold transition-all ${ctx==="debtor"?"text-white":"text-slate-500 hover:text-slate-300"}`} style={ctx==="debtor"?{background:B.purple}:undefined}>
          Должник ({dbCount})
        </button>
      </div>
    </div>

    <nav className="flex-1 px-3 overflow-y-auto">
      {nav.map(item=>{
        const isActive = active===item.id;
        const Icon = item.icon;
        return <button key={item.id} onClick={()=>setActive(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-200 ${isActive?"text-white":"text-slate-400 hover:text-slate-200"}`} style={isActive?{background:accent}:undefined}>
          <Icon size={18}/><span className="flex-1 text-left">{item.label}</span>
          {item.id==="cr-deals"&&overdueCount>0&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.red}}>{overdueCount}</span>}
          {item.id==="db-supplies"&&pendingConfirm>0&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.yellow}}>{pendingConfirm}</span>}
          {item.id==="cr-documents"&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.orange}}>2</span>}
          {item.id==="cr-tasks"&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.red}}>3</span>}
          {item.id==="db-tasks"&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.red}}>{DB_DEALS.filter(d=>!d.confirmed).length}</span>}
          {item.id==="cr-support"&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.yellow}}>1</span>}
          {item.id==="cr-messages"&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.accent}}>2</span>}
          {item.id==="db-documents"&&pendingConfirm>0&&<span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.orange}}>{pendingConfirm}</span>}
        </button>;
      })}
    </nav>

    <div className="px-4 py-4 border-t border-slate-700/50">
      <div className="text-[9px] text-center mb-2" style={{color:"#64748B"}}>Oborotka.by v1.0 · MVP</div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{background:"#334155"}}>СБ</div>
        <div><div className="text-white text-sm font-medium">{COMPANY.name}</div><div className="text-slate-500 text-xs">УНП {COMPANY.unp}</div></div>
      </div>
    </div>
  </aside>;
};

const TopHeader = ({ctx,active,onSearchOpen,onNotifOpen,unreadCount}) => {
  const accent = ctx==="creditor"?B.accent:B.purple;
  const labels = { "cr-dashboard":"Дашборд","cr-tasks":"Задачи","cr-scoring":"Пре-скоринг","cr-mass":"Массовый пре-скоринг","cr-buyers":"Покупатели","cr-partners":"Партнёры платформы","cr-deals":"Реестр уступок","cr-overdue":"Просрочки","cr-documents":"Документы","cr-finance":"Финансы","cr-profile":"Анкета компании","cr-messages":"Сообщения","cr-support":"Поддержка","cr-settings":"Настройки", "db-dashboard":"Дашборд","db-supplies":"Мои поставки","db-payments":"График платежей","db-limit":"Факторинговый лимит","db-partners":"Партнёры платформы","db-documents":"Документы","db-profile":"Анкета компании","db-messages":"Сообщения","db-support":"Поддержка","db-settings":"Настройки" };
  const ctxLabel = ctx==="creditor"?"Кредитор":"Должник";
  return <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
    <div className="flex items-center gap-2 text-sm" style={{color:B.t3}}>
      <span style={{color:accent}} className="font-medium">{ctxLabel}</span><ChevronRight size={14}/><span className="font-medium" style={{color:B.t1}}>{labels[active]||""}</span>
    </div>
    <div className="flex items-center gap-3">
      <button onClick={onSearchOpen} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-sm text-slate-400"><Search size={14}/><span className="hidden lg:inline">Поиск...</span><kbd className="px-1.5 py-0.5 rounded text-xs bg-white border border-slate-200 font-mono ml-2 hidden lg:inline">⌘K</kbd></button>
      <button onClick={onNotifOpen} className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors"><Bell size={18} className="text-slate-500"/>{unreadCount>0&&<span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{background:B.red}}>{unreadCount}</span>}</button>
      <div className="pl-3 border-l border-slate-200"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:`linear-gradient(135deg,${B.accent},${B.purple})`}}>ОД</div><div className="hidden lg:block"><div className="text-xs font-medium" style={{color:B.t1}}>Ольга Д.</div><div className="text-[10px]" style={{color:B.t3}}>Администратор</div></div></div></div>
    </div>
  </div>;
};

// ═══ CREDITOR: TASKS ═══
const CrTasks = ({setActive,setInitialThread,setInitialViewDoc}) => {
  const [toast,setToast]=useState(null);
  const overdue=CR_DEALS.filter(d=>d.status==="overdue");
  const pendingDocs=CR_DEALS.filter(d=>d.ecpStatus==="pending").length||2;
  const unresolvedMessages=4; // mock
  const [showReport,setShowReport]=useState(false);
  const [uploadedReport,setUploadedReport]=useState({balance:null,pl:null});
  const [expandedTask,setExpandedTask]=useState(null);
  const [taskReply,setTaskReply]=useState("");
  const [completedTasks,setCompletedTasks]=useState(new Set([30,31]));
  const tasks=[
    {id:1,priority:"high",title:"Подписать ДС №42 к ГД№1",desc:"ООО «БелТехСнаб» · 45 000 BYN · ЭЦП ожидает",action:"cr-documents",icon:Pen,color:B.red,type:"ecp"},
    {id:2,priority:"high",title:"Подписать ДС №41 к ГД№1",desc:"ЧУП «СтройИнвест» · 60 000 BYN · ЭЦП ожидает",action:"cr-documents",icon:Pen,color:B.red,type:"ecp"},
    {id:3,priority:"medium",title:"Загрузить отчётность за Q1 2026",desc:"Баланс + Отчёт о прибылях и убытках · до 15.04.2026 · ⚠ Без отчётности уступки могут быть приостановлены",action:null,icon:Upload,color:B.yellow,type:"report"},
    {id:20,priority:"medium",title:"Актуализация данных компании",desc:"Подтвердите или обновите данные: учредители, юридический адрес, контакты · Q1 2026",action:"cr-profile",icon:Info,color:B.accent,type:"actualize"},
    {id:21,priority:"low",title:"Ответить на сообщение по УС-2026-0039",desc:"ООО «БелТехСнаб» · Принято, проверяю документы",action:"cr-messages",dealId:"УС-2026-0039",icon:MessageCircle,color:B.accent,type:"message"},
    {id:30,priority:"low",title:"Подписана уступка УС-2026-0040",desc:"ООО «ГрандЛогистик» · 120 000 BYN · финансирование получено",action:"cr-deals",icon:CheckCircle,color:B.green,type:"done"},
    {id:31,priority:"low",title:"Оплата получена по УС-2026-0035",desc:"ООО «БелТехСнаб» · 35 000 BYN · лимит восстановлен",action:"cr-finance",icon:CreditCard,color:B.green,type:"done"},
  ].map(t=>({...t,status:completedTasks.has(t.id)?"done":(t.type==="done"?"done":"open")}));
  const [filter,setFilter]=useState("open");
  const filtered=tasks.filter(t=>filter==="all"?true:t.status===filter);
  const openCount=tasks.filter(t=>t.status==="open").length;
  const priorityOrder={high:0,medium:1,low:2};

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Задачи" subtitle={`${openCount} активных задач требуют вашего внимания`}/>

    <div className="flex gap-2 mb-5">{[["open",`Активные (${openCount})`],["done","Выполненные"],["all","Все"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:B.accent}:undefined}>{l}</button>)}</div>

    <div className="space-y-2">{filtered.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]).map(t=><Card key={t.id} className={`transition-all ${t.status==="done"?"opacity-60":""}`}>
      <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={()=>{if(t.type==="report"||t.type==="ecp"||t.type==="actualize"||t.type==="message"){setExpandedTask(expandedTask===t.id?null:t.id)}else if(t.action){setActive(t.action)}}}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.status==="done"?"bg-slate-100":""}`} style={t.status!=="done"?{background:t.color+"15"}:undefined}><t.icon size={18} style={{color:t.status==="done"?B.t3:t.color}}/></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className={`text-sm font-semibold ${t.status==="done"?"line-through":""}`} style={{color:t.status==="done"?B.t3:B.t1}}>{t.title}</span>{t.priority==="high"&&t.status!=="done"&&<span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{background:B.red}}>Срочно</span>}{t.priority==="medium"&&t.status!=="done"&&<span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{background:B.yellowL,color:B.yellow}}>Внимание</span>}</div>
          <div className="text-xs mt-0.5" style={{color:B.t3}}>{t.desc}</div>
        </div>
        {t.status==="done"?<span className="inline-flex items-center gap-1 text-xs" style={{color:B.green}}><CheckCircle size={14}/>Выполнено</span>:t.type==="report"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Загрузить ↓"}</span>:t.type==="ecp"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Подписать ↓"}</span>:t.type==="actualize"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Проверить ↓"}</span>:t.type==="message"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Ответить ↓"}</span>:<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>Выполнить →</span>}
      </div>
      {/* Inline report upload */}
      {t.type==="report"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3">
        <div className="space-y-3 mb-4">{[{key:"balance",label:"Бухгалтерский баланс",desc:"Форма 1 за Q1 2026"},{key:"pl",label:"Отчёт о прибылях и убытках",desc:"Форма 2 за Q1 2026"}].map(doc=><div key={doc.key} className="rounded-xl border border-slate-200 p-3 flex items-center justify-between"><div className="flex items-center gap-3"><FileText size={16} style={{color:B.accent}}/><div><div className="text-sm font-medium" style={{color:B.t1}}>{doc.label}</div><div className="text-xs" style={{color:B.t3}}>{doc.desc}</div></div></div>{uploadedReport[doc.key]?<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={13}/>Загружен</span>:<Btn variant="secondary" size="sm" icon={Upload} onClick={()=>setUploadedReport(p=>({...p,[doc.key]:{name:`${doc.label}.pdf`}}))}>Выбрать файл</Btn>}</div>)}</div>
        <Btn icon={Send} disabled={!uploadedReport.balance||!uploadedReport.pl} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setToast({msg:"Отчётность за Q1 2026 загружена и отправлена в банк",type:"success"})}}>{uploadedReport.balance&&uploadedReport.pl?"Отправить в банк":"Загрузите оба документа"}</Btn>
      </div>}
      {/* Inline ECP signing */}
      {t.type==="ecp"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3 flex items-center gap-3">
        <Btn icon={Pen} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setToast({msg:`${t.title} — подписано ЭЦП`,type:"success"})}} style={{background:B.accent}}>Подписать ЭЦП</Btn>
        <Btn variant="secondary" icon={Eye} onClick={()=>{const docName=t.title.replace("Подписать ","");setInitialViewDoc?.(docName);setActive("cr-documents")}}>Просмотреть документ</Btn>
      </div>}
      {/* Inline message reply */}
      {t.type==="message"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3">
        <div className="rounded-xl p-3 mb-3 bg-slate-50"><div className="text-[10px] font-medium mb-1" style={{color:B.t3}}>Последнее сообщение от контрагента:</div><div className="text-xs" style={{color:B.t1}}>«Принято, проверяю документы.»</div><div className="text-[10px] mt-1" style={{color:B.t3}}>10.03 14:20 · ООО «БелТехСнаб»</div></div>
        <div className="flex gap-2 mb-2"><input value={taskReply} onChange={e=>setTaskReply(e.target.value)} placeholder="Ваш ответ..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/><Btn icon={Send} disabled={!taskReply.trim()} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setTaskReply("");setToast({msg:"Ответ отправлен",type:"success"})}}>Отправить</Btn></div>
        <button onClick={()=>{setInitialThread?.(t.dealId);setActive(t.action)}} className="text-xs font-medium hover:underline" style={{color:B.accent}}>Открыть полный чат →</button>
      </div>}
      {/* Inline actualization */}
      {t.type==="actualize"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3">
        <div className="rounded-xl p-3 mb-3" style={{background:B.accentL}}><div className="text-xs" style={{color:B.t2}}>Проверьте данные компании. Если всё актуально — подтвердите. Если что-то изменилось — перейдите в анкету и обновите.</div></div>
        <div className="flex gap-2">
          <Btn icon={CheckCircle} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setToast({msg:"Данные компании подтверждены как актуальные",type:"success"})}} style={{background:B.green}}>Данные актуальны — подтвердить</Btn>
          <Btn variant="secondary" icon={Pen} onClick={()=>setActive("cr-profile")}>Перейти в анкету для изменений</Btn>
        </div>
      </div>}
    </Card>)}</div>
  </div>;
};

const CrDashboard = ({setActive,setInitialThread,setInitialExpandDeal,setReturnTo}) => {
  const activeDeals = CR_DEALS.filter(d=>d.status==="active"||d.status==="overdue");
  const activeSum = activeDeals.reduce((s,d)=>s+d.amount,0);
  const totalReceived = CR_DEALS.filter(d=>d.status!=="overdue").reduce((s,d)=>s+d.toReceive,0);
  const approvedBuyers = BUYERS.filter(b=>b.status==="green").length;
  const overdue = CR_DEALS.filter(d=>d.status==="overdue");
  const totalDiscount = CR_DEALS.reduce((s,d)=>s+d.discount,0);
  const [showReport,setShowReport]=useState(false);
  const [showCompanyUpdate,setShowCompanyUpdate]=useState(false);
  const [toast,setToast]=useState(null);
  const [sectionSigning,setSectionSigning]=useState(null);
  const [signedFields,setSignedFields]=useState(new Set());
  const [addedEntries,setAddedEntries]=useState({});
  const [uploadedReport,setUploadedReport]=useState({balance:null,pl:null});
  const [infoConfirmed,setInfoConfirmed]=useState(false);
  // Company update wizard state
  const [updStep,setUpdStep]=useState(0);
  const [updChecks,setUpdChecks]=useState({director:false,founders:false,address:false,contacts:false});
  const [updDirector,setUpdDirector]=useState({fio:"",position:"",dob:"",passportSeries:"",passportNum:"",passportBy:"",passportDate:"",personalNum:"",citizenship:"Республика Беларусь"});
  const [updFounders,setUpdFounders]=useState([{type:"fl",fio:"",share:"",dob:"",passportSeries:"",passportNum:"",passportBy:"",passportDate:"",personalNum:"",citizenship:"Республика Беларусь",orgName:"",orgUnp:""}]);
  const [updAddress,setUpdAddress]=useState({legal:"",actual:"",same:true});
  const [updContacts,setUpdContacts]=useState({phoneDirector:"",phoneAccountant:"",emailMain:"",emailAccounting:""});
  const [updFiles,setUpdFiles]=useState({directorDecision:null,directorPassport:null,foundersDecision:null,addressDoc:null});
  const [updSigning,setUpdSigning]=useState(false);
  const hasChanges=updChecks.director||updChecks.founders||updChecks.address||updChecks.contacts;

  const kpis = [
    {label:"Активные уступки",value:fmtByn(activeSum),sub:`${activeDeals.length} уступок`,icon:TrendingUp,color:B.accent,change:+12,tip:"Общая сумма незавершённых уступок"},
    {label:"Получено на р/с",value:fmtByn(totalReceived),sub:`дисконт: ${fmtByn(totalDiscount)}`,icon:CreditCard,color:B.green,change:+8,tip:"Сумма финансирования за вычетом дисконта"},
    {label:"Одобренные покупатели",value:`${approvedBuyers} из ${BUYERS.length}`,sub:"в базе",icon:Users,color:B.accent,change:+2,tip:"Покупатели с одобренным лимитом"},
    {label:"Просроченные",value:overdue.length.toString(),sub:overdue.length>0?fmtByn(overdue.reduce((s,d)=>s+d.amount,0)):"нет просрочек",icon:AlertTriangle,color:overdue.length>0?B.red:B.green,tip:"Уступки с истёкшим сроком"},
  ];

  return <div>
    {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <div className="mb-6"><h1 className="text-2xl font-bold" style={{color:B.t1}}>{getGreeting()}, Ольга</h1><p className="mt-1 text-sm" style={{color:B.t2}}>Контекст кредитора — управление уступками и финансированием</p></div>

    {/* Tasks — compact list */}
    <Card className="mb-5 overflow-hidden animate-slide-in">
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100" style={{background:"#FAFBFC"}}>
        <div className="flex items-center gap-2"><ClipboardList size={15} style={{color:B.accent}}/><span className="text-sm font-bold" style={{color:B.t1}}><InfoTooltip text="Документы на подписание, ответы на сообщения, квартальная отчётность и другие действия, требующие вашего внимания">Задачи</InfoTooltip></span><span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.red}}>3</span></div>
        <button onClick={()=>setActive("cr-tasks")} className="text-xs font-medium hover:underline" style={{color:B.accent}}>Все задачи →</button>
      </div>
      <div className="divide-y divide-slate-50">
        <button onClick={()=>setActive("cr-tasks")} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"><div className="w-2 h-2 rounded-full shrink-0" style={{background:B.red}}/><Pen size={14} style={{color:B.red}}/><span className="text-xs flex-1" style={{color:B.t1}}>Подписать ДС №42 · ООО «БелТехСнаб» · {fmtByn(45000)}</span><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:B.redL,color:B.red}}>ЭЦП</span></button>
        <button onClick={()=>setActive("cr-tasks")} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"><div className="w-2 h-2 rounded-full shrink-0" style={{background:B.red}}/><Pen size={14} style={{color:B.red}}/><span className="text-xs flex-1" style={{color:B.t1}}>Подписать ДС №41 · ЧУП «СтройИнвест» · {fmtByn(60000)}</span><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:B.redL,color:B.red}}>ЭЦП</span></button>
        <button onClick={()=>setActive("cr-tasks")} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"><div className="w-2 h-2 rounded-full shrink-0" style={{background:B.yellow}}/><Upload size={14} style={{color:B.yellow}}/><span className="text-xs flex-1" style={{color:B.t1}}>Отчётность Q1 2026 · Баланс + P&L · до 15.04.2026</span><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:B.yellowL,color:B.yellow}}>Загрузить</span></button>

      </div>
    </Card>

    {/* Upload report modal */}
    <Modal open={showReport} onClose={()=>setShowReport(false)} title="Загрузка квартальной отчётности">
      <div className="mb-4 rounded-xl p-3" style={{background:B.accentL}}>
        <div className="flex items-start gap-2 text-sm" style={{color:B.t1}}><Info size={16} style={{color:B.accent}} className="shrink-0 mt-0.5"/>
        <span>Загрузите бухгалтерскую отчётность за <strong>1 квартал 2026</strong>. Срок: до <strong>15 апреля 2026</strong>. Формат: PDF или сканы с ЭЦП.</span></div>
      </div>

      <div className="space-y-4 mb-5">
        {[{key:"balance",label:"Бухгалтерский баланс",desc:"Форма 1 за 1 квартал 2026",icon:FileText},
          {key:"pl",label:"Отчёт о прибылях и убытках",desc:"Форма 2 за 1 квартал 2026",icon:FileSpreadsheet}
        ].map(doc=><div key={doc.key} className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><doc.icon size={20} style={{color:B.accent}}/><div><div className="text-sm font-medium" style={{color:B.t1}}>{doc.label}</div><div className="text-xs" style={{color:B.t3}}>{doc.desc}</div></div></div>
            <div className="shrink-0 ml-4">
              {uploadedReport[doc.key]?<div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={13}/>Загружен</span>
                <button onClick={()=>setUploadedReport(p=>({...p,[doc.key]:null}))} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button>
              </div>:<Btn variant="secondary" size="sm" icon={Upload} onClick={()=>setUploadedReport(p=>({...p,[doc.key]:{name:`${doc.label}.pdf`,date:"2026-03-22"}}))}>Выбрать файл</Btn>}
            </div>
          </div>
          {uploadedReport[doc.key]&&<div className="mt-2 flex items-center gap-2 text-xs pl-8" style={{color:B.t3}}><FileText size={12}/><span>{uploadedReport[doc.key].name}</span></div>}
        </div>)}
      </div>

      <div className="flex gap-3">
        <Btn className="flex-1" icon={Send} disabled={!uploadedReport.balance||!uploadedReport.pl} onClick={()=>{setShowReport(false);setToast({msg:"Отчётность за 1 квартал 2026 загружена и отправлена в банк",type:"success"});setUploadedReport({balance:null,pl:null})}}>
          {uploadedReport.balance&&uploadedReport.pl?"Отправить в банк":"Загрузите оба документа"}
        </Btn>
        <Btn variant="secondary" onClick={()=>setShowReport(false)}>Отмена</Btn>
      </div>
    </Modal>

    {/* Company info update modal — multi-step wizard */}
    <Modal open={showCompanyUpdate} onClose={()=>{setShowCompanyUpdate(false);setUpdStep(0)}} title="Актуализация данных компании" wide>
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-5">{["Чек-лист изменений",hasChanges?"Заполнить изменения":"","Подтверждение"].filter(Boolean).map((s,i)=>{const totalSteps=hasChanges?3:2;const stepIdx=hasChanges?i:i===0?0:2;return <div key={i} className="flex items-center gap-1.5 flex-1"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${updStep>=stepIdx?"text-white":"text-slate-400 bg-slate-100"}`} style={updStep>=stepIdx?{background:B.accent}:undefined}>{i+1}</div><span className={`text-xs font-medium whitespace-nowrap ${updStep>=stepIdx?"":"text-slate-400"}`}>{s}</span>{i<(hasChanges?2:1)&&<div className="flex-1 h-px bg-slate-200 mx-1"/>}</div>})}</div>

      {/* Step 0: Checklist */}
      {updStep===0&&<div>
        <div className="mb-4 rounded-xl p-3" style={{background:B.accentL}}>
          <div className="flex items-start gap-2 text-sm" style={{color:B.t1}}><Info size={16} style={{color:B.accent}} className="shrink-0 mt-0.5"/>
          <span>Проверьте текущие данные. Отметьте блоки, в которых произошли изменения.</span></div>
        </div>

        <div className="space-y-3 mb-5">
          {[
            {key:"director",label:"Директор / Руководитель",current:COMPANY.director},
            {key:"founders",label:"Учредители",current:`${COMPANY.director} — 100%`},
            {key:"address",label:"Юридический адрес",current:COMPANY.address},
            {key:"contacts",label:"Контактные данные",current:`${COMPANY.phone} | ${COMPANY.email}`},
          ].map(item=><div key={item.key} className="rounded-xl border-2 p-4 transition-all cursor-pointer" style={{borderColor:updChecks[item.key]?B.accent:B.border,background:updChecks[item.key]?"#EFF6FF":"white"}} onClick={()=>setUpdChecks(p=>({...p,[item.key]:!p[item.key]}))}>
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${updChecks[item.key]?"border-transparent":"border-slate-300"}`} style={updChecks[item.key]?{background:B.accent}:undefined}>
                {updChecks[item.key]&&<Check size={13} className="text-white"/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{color:B.t1}}>{item.label}</div>
                <div className="text-xs mt-0.5" style={{color:B.t2}}>Текущий: {item.current}</div>
              </div>
              {updChecks[item.key]&&<span className="text-xs font-medium px-2 py-0.5 rounded-lg shrink-0" style={{background:B.accent,color:"white"}}>Изменилось</span>}
            </div>
          </div>)}
        </div>

        <div className="rounded-xl p-3 mb-5 text-xs" style={{background:"#FFF7ED",color:B.t2}}>
          <strong style={{color:B.orange}}>Обязанность клиента:</strong> уведомлять банк об изменениях в учредительных документах, адресе, контактных данных в течение 3 рабочих дней.
        </div>

        <div className="flex gap-3">
          {!hasChanges?<Btn className="flex-1" icon={Shield} onClick={()=>{setUpdStep(2)}}>Всё актуально — подтвердить ЭЦП</Btn>
          :<Btn className="flex-1" icon={ArrowRight} onClick={()=>setUpdStep(1)}>Далее — заполнить изменения</Btn>}
          <Btn variant="secondary" onClick={()=>{setShowCompanyUpdate(false);setUpdStep(0)}}>Отмена</Btn>
        </div>
      </div>}

      {/* Step 1: Adaptive form */}
      {updStep===1&&<div className="space-y-5">
        {updChecks.director&&<div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{color:B.accent}}><Users size={16}/>Новый директор / руководитель</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="col-span-2"><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>ФИО нового директора</label><input value={updDirector.fio} onChange={e=>setUpdDirector(p=>({...p,fio:e.target.value}))} placeholder="Иванов Иван Иванович" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Должность</label><input value={updDirector.position} onChange={e=>setUpdDirector(p=>({...p,position:e.target.value}))} placeholder="Директор" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Дата рождения</label><input type="date" value={updDirector.dob} onChange={e=>setUpdDirector(p=>({...p,dob:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
          </div>
          <div className="text-xs font-medium mb-2 mt-4" style={{color:B.t3}}>Паспортные данные</div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Серия</label><input value={updDirector.passportSeries} onChange={e=>setUpdDirector(p=>({...p,passportSeries:e.target.value}))} placeholder="BM" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Номер</label><input value={updDirector.passportNum} onChange={e=>setUpdDirector(p=>({...p,passportNum:e.target.value}))} placeholder="1234567" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Кем выдан</label><input value={updDirector.passportBy} onChange={e=>setUpdDirector(p=>({...p,passportBy:e.target.value}))} placeholder="Минским РУВД" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Дата выдачи</label><input type="date" value={updDirector.passportDate} onChange={e=>setUpdDirector(p=>({...p,passportDate:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Личный номер</label><input value={updDirector.personalNum} onChange={e=>setUpdDirector(p=>({...p,personalNum:e.target.value}))} placeholder="1234567A001PB1" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Гражданство</label><input value={updDirector.citizenship} onChange={e=>setUpdDirector(p=>({...p,citizenship:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{key:"directorDecision",label:"Решение/приказ о назначении"},{key:"directorPassport",label:"Скан паспорта нового директора"}].map(f=><div key={f.key} className="rounded-xl border border-slate-200 p-3"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>{f.label} (PDF)</div>{updFiles[f.key]?<div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={12}/>Загружен</span><button onClick={()=>setUpdFiles(p=>({...p,[f.key]:null}))} className="p-0.5 rounded hover:bg-slate-100"><X size={12} className="text-slate-400"/></button></div>:<Btn size="sm" variant="secondary" icon={Upload} onClick={()=>setUpdFiles(p=>({...p,[f.key]:{name:`${f.label}.pdf`}}))}>Загрузить</Btn>}</div>)}
          </div>
        </div>}

        {updChecks.founders&&<div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{color:B.accent}}><Users size={16}/>Учредители</h4>
          {updFounders.map((f,idx)=><div key={idx} className="rounded-xl border border-slate-200 p-4 mb-3">
            <div className="flex items-center justify-between mb-3"><span className="text-xs font-bold" style={{color:B.t1}}>Учредитель #{idx+1}</span>
              <div className="flex gap-1.5">{[["fl","Физ. лицо"],["ul","Юр. лицо"]].map(([v,l])=><button key={v} onClick={()=>{const n=[...updFounders];n[idx]={...n[idx],type:v};setUpdFounders(n)}} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${f.type===v?"text-white":"text-slate-500 bg-slate-50"}`} style={f.type===v?{background:B.accent}:undefined}>{l}</button>)}</div>
            </div>
            {f.type==="fl"?<div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>ФИО</label><input value={f.fio} onChange={e=>{const n=[...updFounders];n[idx].fio=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Доля, %</label><input value={f.share} onChange={e=>{const n=[...updFounders];n[idx].share=e.target.value;setUpdFounders(n)}} placeholder="100" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Дата рождения</label><input type="date" value={f.dob} onChange={e=>{const n=[...updFounders];n[idx].dob=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Гражданство</label><input value={f.citizenship} onChange={e=>{const n=[...updFounders];n[idx].citizenship=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Паспорт: серия</label><input value={f.passportSeries} onChange={e=>{const n=[...updFounders];n[idx].passportSeries=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Паспорт: номер</label><input value={f.passportNum} onChange={e=>{const n=[...updFounders];n[idx].passportNum=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            </div>:<div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Наименование</label><input value={f.orgName} onChange={e=>{const n=[...updFounders];n[idx].orgName=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>УНП</label><input value={f.orgUnp} onChange={e=>{const n=[...updFounders];n[idx].orgUnp=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
              <div><label className="block text-xs mb-1" style={{color:B.t3}}>Доля, %</label><input value={f.share} onChange={e=>{const n=[...updFounders];n[idx].share=e.target.value;setUpdFounders(n)}} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            </div>}
            {updFounders.length>1&&<button onClick={()=>setUpdFounders(p=>p.filter((_,j)=>j!==idx))} className="mt-2 text-xs text-red-400 hover:text-red-600">Удалить</button>}
          </div>)}
          <button onClick={()=>setUpdFounders(p=>[...p,{type:"fl",fio:"",share:"",dob:"",passportSeries:"",passportNum:"",passportBy:"",passportDate:"",personalNum:"",citizenship:"Республика Беларусь",orgName:"",orgUnp:""}])} className="flex items-center gap-1.5 text-xs font-medium mb-3" style={{color:B.accent}}><Plus size={13}/>Добавить учредителя</button>
          <div className="rounded-xl border border-slate-200 p-3"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>Решение об изменении состава учредителей (PDF)</div>{updFiles.foundersDecision?<div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={12}/>Загружен</span><button onClick={()=>setUpdFiles(p=>({...p,foundersDecision:null}))} className="p-0.5 rounded hover:bg-slate-100"><X size={12} className="text-slate-400"/></button></div>:<Btn size="sm" variant="secondary" icon={Upload} onClick={()=>setUpdFiles(p=>({...p,foundersDecision:{name:"Решение.pdf"}}))}>Загрузить</Btn>}</div>
        </div>}

        {updChecks.address&&<div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{color:B.accent}}><Building2 size={16}/>Новый адрес</h4>
          <div className="space-y-3">
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Юридический адрес</label><input value={updAddress.legal} onChange={e=>setUpdAddress(p=>({...p,legal:e.target.value}))} placeholder="г. Минск, ул. ..." className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <label className="flex items-center gap-2 cursor-pointer"><div className={`w-4 h-4 rounded flex items-center justify-center border-2 ${updAddress.same?"border-transparent":"border-slate-300"}`} style={updAddress.same?{background:B.accent}:undefined} onClick={()=>setUpdAddress(p=>({...p,same:!p.same}))}>{updAddress.same&&<Check size={11} className="text-white"/>}</div><span className="text-xs" style={{color:B.t2}} onClick={()=>setUpdAddress(p=>({...p,same:!p.same}))}>Фактический совпадает с юридическим</span></label>
            {!updAddress.same&&<div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Фактический адрес</label><input value={updAddress.actual} onChange={e=>setUpdAddress(p=>({...p,actual:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>}
            <div className="rounded-xl border border-slate-200 p-3"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>Подтверждающий документ (договор аренды / свидетельство)</div>{updFiles.addressDoc?<div className="flex items-center gap-2"><span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={12}/>Загружен</span><button onClick={()=>setUpdFiles(p=>({...p,addressDoc:null}))} className="p-0.5 rounded hover:bg-slate-100"><X size={12} className="text-slate-400"/></button></div>:<Btn size="sm" variant="secondary" icon={Upload} onClick={()=>setUpdFiles(p=>({...p,addressDoc:{name:"Договор_аренды.pdf"}}))}>Загрузить</Btn>}</div>
          </div>
        </div>}

        {updChecks.contacts&&<div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{color:B.accent}}><Phone size={16}/>Контактные данные</h4>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Телефон руководителя</label><input value={updContacts.phoneDirector} onChange={e=>setUpdContacts(p=>({...p,phoneDirector:e.target.value}))} placeholder="+375 (__) ___-__-__" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Телефон бухгалтера</label><input value={updContacts.phoneAccountant} onChange={e=>setUpdContacts(p=>({...p,phoneAccountant:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Email основной</label><input value={updContacts.emailMain} onChange={e=>setUpdContacts(p=>({...p,emailMain:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs mb-1" style={{color:B.t3}}>Email бухгалтерии</label><input value={updContacts.emailAccounting} onChange={e=>setUpdContacts(p=>({...p,emailAccounting:e.target.value}))} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
          </div>
        </div>}

        <div className="flex justify-between pt-2">
          <Btn variant="ghost" onClick={()=>setUpdStep(0)} icon={ArrowLeft}>Назад</Btn>
          <Btn onClick={()=>setUpdStep(2)} icon={ArrowRight}>Далее — подтверждение</Btn>
        </div>
      </div>}

      {/* Step 2: Confirm & sign */}
      {updStep===2&&<div>
        <div className="rounded-xl p-5 bg-slate-50 mb-4 space-y-2 text-sm">
          <h4 className="font-bold text-sm mb-3" style={{color:B.t1}}>Сводка изменений</h4>
          {!hasChanges&&<div className="flex items-center gap-2" style={{color:B.green}}><CheckCircle size={16}/>Все данные актуальны — подтверждение без изменений</div>}
          {updChecks.director&&<div className="flex items-start gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-lg shrink-0" style={{background:B.accentL,color:B.accent}}>Директор</span><span style={{color:B.t2}}>{updDirector.fio||"(новые данные заполнены)"}</span></div>}
          {updChecks.founders&&<div className="flex items-start gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-lg shrink-0" style={{background:B.accentL,color:B.accent}}>Учредители</span><span style={{color:B.t2}}>{updFounders.length} учредител{updFounders.length===1?"ь":"ей"}</span></div>}
          {updChecks.address&&<div className="flex items-start gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-lg shrink-0" style={{background:B.accentL,color:B.accent}}>Адрес</span><span style={{color:B.t2}}>{updAddress.legal||"(новый адрес)"}</span></div>}
          {updChecks.contacts&&<div className="flex items-start gap-2"><span className="text-xs font-medium px-2 py-0.5 rounded-lg shrink-0" style={{background:B.accentL,color:B.accent}}>Контакты</span><span style={{color:B.t2}}>Обновлённые контактные данные</span></div>}
        </div>

        {hasChanges&&<div className="rounded-xl p-3 mb-4" style={{background:"#FFF7ED"}}>
          <div className="flex items-start gap-2 text-xs" style={{color:B.t1}}><AlertTriangle size={14} style={{color:B.orange}} className="shrink-0 mt-0.5"/>
          <span>Изменения будут отправлены в банк на проверку. До подтверждения банком действуют текущие данные.</span></div>
        </div>}

        <div className="flex justify-between">
          {hasChanges&&<Btn variant="ghost" onClick={()=>setUpdStep(1)} icon={ArrowLeft}>Назад</Btn>}
          {!hasChanges&&<Btn variant="ghost" onClick={()=>setUpdStep(0)} icon={ArrowLeft}>Назад</Btn>}
          <Btn variant="success" icon={updSigning?Loader2:Pen} disabled={updSigning} onClick={()=>{
            setUpdSigning(true);
            setTimeout(()=>{
              setUpdSigning(false);setShowCompanyUpdate(false);setInfoConfirmed(true);setUpdStep(0);
              setToast({msg:hasChanges?"Обновлённые данные подписаны ЭЦП и отправлены в банк":"Актуальность данных подтверждена ЭЦП",type:"success"});
            },1500);
          }}>{updSigning?"Подписание ЭЦП...":"Подписать ЭЦП и отправить в банк"}</Btn>
        </div>
      </div>}
    </Modal>

    {/* Limits — main block */}
    <Card className="p-6 mb-5 animate-fade-up">
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><CreditCard size={18} style={{color:B.accent}}/><h2 className="text-lg font-bold" style={{color:B.t1}}>Доступные лимиты</h2></div></div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4 text-center" style={{background:B.accentL}}><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.accent}}>Общий лимит</div><div className="text-2xl font-bold" style={{color:B.accent}}>{fmtByn(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.limit,0))}</div></div>
        <div className="rounded-xl p-4 text-center bg-slate-50"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Использовано</div><div className="text-2xl font-bold" style={{color:B.t1}}>{fmtByn(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.used,0))}</div></div>
        <div className="rounded-xl p-4 text-center" style={{background:B.greenL}}><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.green}}>Доступно</div><div className="text-2xl font-bold" style={{color:B.green}}>{fmtByn(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.available,0))}</div></div>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-2"><div className="h-full rounded-full transition-all" style={{width:`${Math.round(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.used,0)/BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.limit,0)*100)}%`,background:`linear-gradient(90deg, ${B.accent}, ${B.green})`}}/></div>
      <div className="text-sm mb-4" style={{color:B.t2}}>Использовано <strong style={{color:B.t1}}>{Math.round(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.used,0)/BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.limit,0)*100)}%</strong> — {fmtByn(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.used,0))} из {fmtByn(BUYERS.filter(b=>b.status==="green").reduce((s,b)=>s+b.limit,0))}</div>
      <Btn className="w-full py-3 text-base" icon={Plus} onClick={()=>setActive("cr-deals")}><InfoTooltip text="Уступите банку денежное требование к покупателю и получите финансирование за 3 рабочих дня">Создать новую уступку</InfoTooltip></Btn>
    </Card>

    {/* Active deals — waiting for money */}
    {(()=>{const pending=CR_DEALS.filter(d=>d.status==="active"||d.status==="pending");if(!pending.length)return null;return <Card className="p-5 mb-5 animate-fade-up">
      <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><TrendingUp size={16} style={{color:B.accent}}/><h3 className="text-sm font-bold" style={{color:B.t1}}><InfoTooltip text="Уступки, по которым ожидается оплата от покупателя. Финансирование уже получено">Мои активные уступки</InfoTooltip></h3><span className="text-xs px-2 py-0.5 rounded-full" style={{background:B.accentL,color:B.accent}}>{pending.length}</span></div><Btn size="sm" variant="secondary" onClick={()=>setActive("cr-deals")}>Все уступки →</Btn></div>
      <div className="text-xs mb-3" style={{color:B.t3}}>Уступки, по которым вы ожидаете финансирование или оплату от покупателя</div>
      <div className="space-y-2">{pending.sort((a,b)=>a.daysLeft-b.daysLeft).map(d=>{const buyer=BUYERS.find(b=>b.id===d.buyerId);return <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer" onClick={()=>{setInitialExpandDeal?.(d.id);setReturnTo?.("cr-dashboard");setActive("cr-deals")}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:d.daysLeft<14?B.yellowL:B.accentL}}>{d.ecpStatus==="pending"?<Pen size={14} style={{color:B.yellow}}/>:<CheckCircle size={14} style={{color:B.accent}}/>}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-xs font-bold" style={{color:B.accent,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span><span className="text-xs font-medium" style={{color:B.t1}}>{buyer?.name}</span></div>
          <div className="text-[10px] mt-0.5" style={{color:B.t3}}>{d.ecpStatus==="pending"?"ДС ожидает подписания":"Финансирование получено"} · Оплата через {d.daysLeft} дн.</div>
        </div>
        <div className="text-right shrink-0"><div className="text-sm font-bold" style={{color:B.t1}}>{fmtByn(d.amount)}</div><div className="text-[10px] font-medium" style={{color:B.green}}>→ {fmtByn(d.toReceive)}</div></div>
        <button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-blue-50 shrink-0" style={{color:B.accent}}><MessageCircle size={10}/>Обсудить</button>
      </div>})}</div>
    </Card>})()}

  </div>;
};


const DbTasks = ({setActive,setInitialThread,setInitialViewDoc}) => {
  const [toast,setToast]=useState(null);
  const [expandedTask,setExpandedTask]=useState(null);
  const [completedTasks,setCompletedTasks]=useState(new Set(["done-1","done-2"]));
  const [taskReply,setTaskReply]=useState("");
  const pendingConfirm=DB_DEALS.filter(d=>!d.confirmed);
  const tasks=[
    ...pendingConfirm.map(d=>{const sup=SUPPLIERS.find(s=>s.id===d.supplierId);return {id:`confirm-${d.id}`,priority:"high",title:`Подтвердить уведомление ${d.id}`,desc:`${sup?.name||""} · ${fmtByn(d.amount)} · ЭЦП ожидает`,type:"ecp",icon:Pen,color:B.red}}),
    {id:"msg-1",priority:"low",title:"Ответить на сообщение по УС-2026-1001",desc:"ООО «АльфаСтрой» · Уточните дату отгрузки",type:"message",dealId:"УС-2026-1001",action:"db-messages",icon:MessageCircle,color:B.purple},
    {id:"actualize",priority:"medium",title:"Актуализация данных компании",desc:"Подтвердите или обновите данные · Q1 2026",type:"actualize",action:"db-profile",icon:Info,color:B.purple},
    {id:"done-1",priority:"low",title:"Оплата по УС-2026-1003 проведена",desc:"50 000 BYN · 15.03.2026",type:"done",icon:CheckCircle,color:B.green},
    {id:"done-2",priority:"low",title:"Уведомление УС-2026-1004 подтверждено",desc:"ООО «АльфаСтрой» · 30 000 BYN",type:"done",icon:CheckCircle,color:B.green},
  ].map(t=>({...t,status:completedTasks.has(t.id)?"done":(t.type==="done"?"done":"open")}));
  const [filter,setFilter]=useState("open");
  const filtered=tasks.filter(t=>filter==="all"?true:t.status===filter);
  const openCount=tasks.filter(t=>t.status==="open").length;
  const priorityOrder={high:0,medium:1,low:2};

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Задачи" subtitle={`${openCount} активных задач`}/>
    <div className="flex gap-2 mb-5">{[["open",`Активные (${openCount})`],["done","Выполненные"],["all","Все"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:B.purple}:undefined}>{l}</button>)}</div>
    <div className="space-y-2">{filtered.sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]).map(t=><Card key={t.id} className={`transition-all ${t.status==="done"?"opacity-60":""}`}>
      <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={()=>{if(t.type==="ecp"||t.type==="message"||t.type==="actualize"){setExpandedTask(expandedTask===t.id?null:t.id)}else if(t.action){setActive(t.action)}}}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.status==="done"?"bg-slate-100":""}`} style={t.status!=="done"?{background:t.color+"15"}:undefined}><t.icon size={18} style={{color:t.status==="done"?B.t3:t.color}}/></div>
        <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className={`text-sm font-semibold ${t.status==="done"?"line-through":""}`} style={{color:t.status==="done"?B.t3:B.t1}}>{t.title}</span>{t.priority==="high"&&t.status!=="done"&&<span className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white" style={{background:B.red}}>Срочно</span>}</div><div className="text-xs mt-0.5" style={{color:B.t3}}>{t.desc}</div></div>
        {t.status==="done"?<span className="inline-flex items-center gap-1 text-xs" style={{color:B.green}}><CheckCircle size={14}/>Выполнено</span>:t.type==="ecp"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Подписать ↓"}</span>:t.type==="message"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Ответить ↓"}</span>:t.type==="actualize"?<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>{expandedTask===t.id?"Свернуть":"Проверить ↓"}</span>:<span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{background:t.color+"15",color:t.color}}>Выполнить →</span>}
      </div>
      {t.type==="ecp"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3 flex items-center gap-3"><Btn icon={Pen} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setToast({msg:`${t.title} — подтверждено ЭЦП`,type:"success"})}} style={{background:B.purple}}>Подтвердить ЭЦП</Btn><Btn variant="secondary" icon={Eye} onClick={()=>{const dealNum=t.id.replace("confirm-","").split("-").pop();setInitialViewDoc?.("Уведомление_"+dealNum);setActive("db-documents")}}>Просмотреть</Btn></div>}
      {t.type==="message"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3"><div className="rounded-xl p-3 mb-3 bg-slate-50"><div className="text-[10px] font-medium mb-1" style={{color:B.t3}}>Последнее сообщение:</div><div className="text-xs" style={{color:B.t1}}>«Уточните дату отгрузки по накладной.»</div></div><div className="flex gap-2 mb-2"><input value={taskReply} onChange={e=>setTaskReply(e.target.value)} placeholder="Ваш ответ..." className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"/><Btn icon={Send} disabled={!taskReply.trim()} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setTaskReply("");setToast({msg:"Ответ отправлен",type:"success"})}} style={{background:B.purple}}>Отправить</Btn></div><button onClick={()=>{setInitialThread?.(t.dealId);setActive(t.action)}} className="text-xs font-medium hover:underline" style={{color:B.purple}}>Открыть полный чат →</button></div>}
      {t.type==="actualize"&&expandedTask===t.id&&t.status!=="done"&&<div className="px-4 pb-4 border-t border-slate-100 pt-3"><div className="flex gap-2"><Btn icon={CheckCircle} onClick={()=>{setCompletedTasks(p=>{const n=new Set(p);n.add(t.id);return n});setExpandedTask(null);setToast({msg:"Данные подтверждены",type:"success"})}} style={{background:B.green}}>Данные актуальны</Btn><Btn variant="secondary" icon={Pen} onClick={()=>setActive("db-profile")}>Перейти в анкету</Btn></div></div>}
    </Card>)}</div>
  </div>;
};

const DbDashboard = ({setActive,setInitialThread,setInitialViewSupply,setReturnTo}) => {
  const pendingConfirm=DB_DEALS.filter(d=>!d.confirmed);
  const activeSupplies=DB_DEALS.filter(d=>d.status==="active"||d.status==="pending");
  const totalLimit=SUPPLIERS.reduce((s,sup)=>s+sup.limit,0);
  const totalUsed=SUPPLIERS.reduce((s,sup)=>s+sup.used,0);
  const [toast,setToast]=useState(null);
  const taskCount=pendingConfirm.length+1;

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <div className="mb-6"><h1 className="text-2xl font-bold" style={{color:B.t1}}>{getGreeting()}, Ольга</h1><p className="mt-1 text-sm" style={{color:B.t2}}>Контекст должника — подтверждение поставок и оплата</p></div>

    {/* Tasks */}
    <Card className="mb-5 overflow-hidden animate-slide-in">
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100" style={{background:"#FAFBFC"}}>
        <div className="flex items-center gap-2"><ClipboardList size={15} style={{color:B.purple}}/><span className="text-sm font-bold" style={{color:B.t1}}><InfoTooltip text="Уведомления об уступке на подписание, ответы на сообщения и актуализация данных">Задачи</InfoTooltip></span><span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{background:B.red}}>{taskCount}</span></div>
        <button onClick={()=>setActive("db-tasks")} className="text-xs font-medium hover:underline" style={{color:B.purple}}>Все задачи →</button>
      </div>
      <div className="divide-y divide-slate-50">
        {pendingConfirm.map(d=>{const sup=SUPPLIERS.find(s=>s.id===d.supplierId);return <button key={d.id} onClick={()=>setActive("db-tasks")} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"><div className="w-2 h-2 rounded-full shrink-0" style={{background:B.red}}/><Pen size={14} style={{color:B.red}}/><span className="text-xs flex-1" style={{color:B.t1}}>Подтвердить уведомление {d.id} · {sup?.name} · {fmtByn(d.amount)}</span><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:B.redL,color:B.red}}>ЭЦП</span></button>})}
        <button onClick={()=>setActive("db-tasks")} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors text-left"><div className="w-2 h-2 rounded-full shrink-0" style={{background:B.yellow}}/><Info size={14} style={{color:B.yellow}}/><span className="text-xs flex-1" style={{color:B.t1}}>Актуализация данных компании · Q1 2026</span><span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{background:B.yellowL,color:B.yellow}}>Проверить</span></button>
      </div>
    </Card>

    {/* Limit */}
    <Card className="p-6 mb-5 animate-fade-up">
      <div className="flex items-center gap-2 mb-4"><Shield size={18} style={{color:B.purple}}/><h2 className="text-lg font-bold" style={{color:B.t1}}><InfoTooltip text="Общий лимит факторинга — максимальная сумма одновременно активных уступок. Устанавливается банком по результатам скоринга">Кредитный лимит</InfoTooltip></h2></div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4 text-center" style={{background:B.purpleL}}><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.purple}}>Общий лимит</div><div className="text-2xl font-bold" style={{color:B.purple}}>{fmtByn(totalLimit)}</div></div>
        <div className="rounded-xl p-4 text-center bg-slate-50"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Использовано</div><div className="text-2xl font-bold" style={{color:B.t1}}>{fmtByn(totalUsed)}</div></div>
        <div className="rounded-xl p-4 text-center" style={{background:B.greenL}}><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.green}}>Доступно</div><div className="text-2xl font-bold" style={{color:B.green}}>{fmtByn(totalLimit-totalUsed)}</div></div>
      </div>
      <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-2"><div className="h-full rounded-full transition-all" style={{width:`${Math.round(totalUsed/totalLimit*100)}%`,background:`linear-gradient(90deg, ${B.purple}, ${B.green})`}}/></div>
      <div className="text-sm" style={{color:B.t2}}>Использовано <strong style={{color:B.t1}}>{Math.round(totalUsed/totalLimit*100)}%</strong> — {fmtByn(totalUsed)} из {fmtByn(totalLimit)}</div>
    </Card>

    {/* Active supplies */}
    {activeSupplies.length>0&&<Card className="p-5 mb-5 animate-fade-up">
      <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><TrendingUp size={16} style={{color:B.purple}}/><h3 className="text-sm font-bold" style={{color:B.t1}}><InfoTooltip text="Поставки, по которым ваш поставщик уступил право требования банку. Оплата идёт на счёт банка, не поставщика">Мои активные поставки</InfoTooltip></h3><span className="text-xs px-2 py-0.5 rounded-full" style={{background:B.purpleL,color:B.purple}}>{activeSupplies.length}</span></div><Btn size="sm" variant="secondary" onClick={()=>setActive("db-supplies")}>Все поставки →</Btn></div>
      <div className="space-y-2">{activeSupplies.sort((a,b)=>a.daysLeft-b.daysLeft).map(d=>{const sup=SUPPLIERS.find(s=>s.id===d.supplierId);return <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:shadow-sm transition-all cursor-pointer" onClick={()=>{setInitialViewSupply?.(d.id);setReturnTo?.("db-dashboard");setActive("db-supplies")}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:d.confirmed?B.greenL:B.yellowL}}>{d.confirmed?<CheckCircle size={14} style={{color:B.green}}/>:<Pen size={14} style={{color:B.yellow}}/>}</div>
        <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="text-xs font-bold" style={{color:B.purple,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span><span className="text-xs" style={{color:B.t1}}>{sup?.name}</span></div><div className="text-[10px] mt-0.5" style={{color:B.t3}}>{d.confirmed?"Подтверждена":"Ожидает подтверждения"} · Оплата через {d.daysLeft} дн.</div></div>
        <div className="text-right shrink-0"><div className="text-sm font-bold" style={{color:B.t1}}>{fmtByn(d.amount)}</div><div className="text-[10px]" style={{color:d.daysLeft<14?B.yellow:B.green}}>до {d.dueDate}</div></div>
        <button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("db-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-purple-50 shrink-0" style={{color:B.purple}}><MessageCircle size={10}/>Обсудить</button>
      </div>})}</div>
    </Card>}
  </div>;
};

const DbSupplies = ({setActive,setInitialThread,setInitialViewDoc,setReturnTo,setReturnSupplyId,setInitialViewSupply,initialViewSupply,onClearViewSupply,returnTo:dealsReturnTo,onReturnNav}) => {
  const [toast,setToast]=useState(null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [confirmed,setConfirmed]=useState(new Set(DB_DEALS.filter(d=>d.confirmed).map(d=>d.id)));
  const [signing,setSigning]=useState(null);
  const [rejected,setRejected]=useState(new Set());
  const [viewSupply,setViewSupply]=useState(null);
  useEffect(()=>{if(initialViewSupply){const d=DB_DEALS.find(dd=>dd.id===initialViewSupply);if(d)setViewSupply(d);onClearViewSupply?.()}},[initialViewSupply]);

  const handleConfirm=(id)=>{setSigning(id);setTimeout(()=>{setConfirmed(p=>{const n=new Set(p);n.add(id);return n});setRejected(p=>{const n=new Set(p);n.delete(id);return n});setSigning(null);setToast({msg:`Получение ${id} подтверждено ЭЦП`,type:"success"})},1500)};
  const handleReject=(id)=>{setRejected(p=>{const n=new Set(p);n.add(id);return n});setToast({msg:`Уступка ${id} отклонена`,type:"info"})};

  const filtered=DB_DEALS.filter(d=>{
    if(filter==="pending")return !confirmed.has(d.id)&&!rejected.has(d.id)&&d.status!=="paid";
    if(filter==="rejected")return rejected.has(d.id);
    if(filter==="active")return confirmed.has(d.id)&&d.status!=="paid";
    if(filter==="paid")return d.status==="paid";
    return true;
  }).filter(d=>{
    if(!search)return true;const sup=SUPPLIERS.find(s=>s.id===d.supplierId);const q=search.toLowerCase();
    return d.id.toLowerCase().includes(q)||(sup?.name||"").toLowerCase().includes(q)||d.product.toLowerCase().includes(q);
  });

  // Card view
  if(viewSupply){const d=viewSupply;const sup=SUPPLIERS.find(s=>s.id===d.supplierId);const isConf=confirmed.has(d.id);const isSigning=signing===d.id;
    const tl=[{label:"Уступка создана",date:d.notifyDate,done:true,desc:"Поставщик уступил банку"},{label:"Подтверждение",date:isConf?"ЭЦП":"—",done:isConf,desc:isConf?"Подтверждено вами":rejected.has(d.id)?"Отклонена":"Ожидает вашего ЭЦП"},{label:"Оплата банку",date:d.dueDate,done:d.status==="paid",desc:d.status==="paid"?"Оплачена":`${d.daysLeft} дн. осталось`}];
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <button onClick={()=>{if(dealsReturnTo){onReturnNav?.()}else{setViewSupply(null)}}} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:B.purple}}><ArrowLeft size={16}/>{dealsReturnTo?"Назад":"Назад к поставкам"}</button>

    <Card className="p-6 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div><div className="flex items-center gap-3 mb-1"><h1 className="text-xl font-bold" style={{color:B.t1}}>{d.id}</h1><StatusBadge status={isConf?(d.status==="paid"?"paid":"confirmed"):"pending"} size="md"/>{rejected.has(d.id)&&<span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{background:B.redL,color:B.red}}>Отклонена</span>}</div><div className="text-sm" style={{color:B.t3}}>{sup?.name} · {d.product} · {d.notifyDate}</div></div>
        <div className="flex gap-2">{!isConf&&d.status!=="paid"&&!rejected.has(d.id)&&<Btn icon={isSigning?Loader2:Pen} disabled={!!signing} onClick={()=>handleConfirm(d.id)} style={{background:B.purple}}>{isSigning?"Подписание...":"Подписать уведомление"}</Btn>}
          <Btn variant="secondary" icon={MessageCircle} onClick={()=>{setInitialThread?.(d.id);setActive("db-messages")}}>Обсудить</Btn></div>
      </div>
      <div className="flex items-center gap-1">{tl.map((s,i)=><Fragment key={i}><div className="flex flex-col items-center shrink-0" style={{minWidth:100}}><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${s.done?"text-white":"border-2"}`} style={s.done?{background:B.green}:i===tl.findIndex(x=>!x.done)?{borderColor:B.purple,color:B.purple}:{borderColor:B.border,color:B.t3}}>{s.done?<Check size={12}/>:i+1}</div><div className="text-[10px] font-semibold mt-1.5 text-center" style={{color:s.done?B.green:B.t3}}>{s.label}</div><div className="text-[9px] text-center" style={{color:B.t3}}>{s.desc}</div></div>{i<tl.length-1&&<div className="flex-1 h-px mx-2" style={{background:tl[i+1].done?B.green:B.border}}/>}</Fragment>)}</div>
    </Card>

    <div className="grid grid-cols-4 gap-4 mb-5">
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Сумма поставки, которую нужно оплатить банку вместо поставщика">Сумма</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.t1}}>{fmtByn(d.amount)}</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Крайний срок оплаты. После этой даты начисляется пеня">Срок оплаты</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.t1}}>{d.dueDate}</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Количество дней до крайнего срока оплаты">Осталось</InfoTooltip></div><div className="text-xl font-bold" style={{color:d.daysLeft<14?B.yellow:B.green}}>{d.status==="paid"?"Оплачена":d.daysLeft+" дн."}</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Статус</div><div className="mt-1"><StatusBadge status={isConf?(d.status==="paid"?"paid":"confirmed"):"pending"}/></div></Card>
    </div>

    <Card className="p-5 mb-5">
      <h3 className="text-sm font-bold mb-3" style={{color:B.t1}}><InfoTooltip text="Пакет документов по данной уступке. ДС, ТТН и ЭСЧФ — для просмотра. Уведомление — требует вашей подписи ЭЦП">Документы уступки</InfoTooltip></h3>
      <div className="space-y-2">{[
        {icon:Gavel,name:`ДС №${d.id.split("-")[2]} к ГД№1`,type:"Допсоглашение",status:"view",desc:"Подписано кредитором и банком"},
        {icon:FileSpreadsheet,name:`${d.product?.includes("Цемент")?"ТТН":"Акт"}_${d.id.split("-")[2]}.pdf`,type:d.product?.includes("Цемент")?"ТТН":"Акт",status:"view",desc:"Загружен кредитором"},
        {icon:Receipt,name:`ЭСЧФ_${d.id.split("-")[2]}.pdf`,type:"ЭСЧФ",status:"view",desc:"Загружен кредитором"},
        {icon:Send,name:`Уведомление_${d.id.split("-")[2]}`,type:"Увед. об уступке",status:isConf?"signed":"pending",desc:isConf?"Подтверждено вами ЭЦП":"Требует подписания ЭЦП"},
      ].map((doc,i)=><div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:shadow-sm hover:border-purple-200 cursor-pointer transition-all" onClick={()=>{setInitialViewDoc?.(doc.name);setReturnSupplyId?.(d.id);setReturnTo("db-supplies");setActive("db-documents")}}>
        <doc.icon size={14} style={{color:B.purple}}/>
        <div className="flex-1 min-w-0"><div className="text-sm font-medium hover:underline" style={{color:B.purple}}>{doc.name}</div><div className="text-[10px]" style={{color:B.t3}}>{doc.desc}</div></div>
        <span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100" style={{color:B.t3}}>{doc.type}</span>
        {doc.status==="signed"?<span className="inline-flex items-center gap-1 text-[10px]" style={{color:B.green}}><Shield size={9}/>ЭЦП</span>:doc.status==="pending"?<button onClick={e=>{e.stopPropagation();handleConfirm(d.id)}} className="px-2.5 py-1 rounded-lg text-[10px] font-medium text-white" style={{background:B.purple}}><Pen size={9} className="inline mr-1"/>Подписать</button>:<span className="inline-flex items-center gap-1 text-[10px]" style={{color:B.t3}}><Eye size={9}/>Просмотр</span>}
        <button onClick={e=>{e.stopPropagation();setToast({msg:`${doc.name} скачан`,type:"info"})}} className="p-1.5 rounded-lg hover:bg-slate-100"><Download size={12} className="text-slate-400"/></button>
        <ChevronRight size={14} className="text-slate-300"/>
      </div>)}</div>
    </Card>

    <Card className="p-5 mb-5" style={{borderColor:B.purple+"30",background:B.purpleL}}>
      <div className="flex items-center justify-between mb-2"><h3 className="text-sm font-bold flex items-center gap-1.5" style={{color:B.purple}}><Calendar size={14}/><InfoTooltip text="Оплачивайте на счёт банка вместо поставщика. Реквизиты указаны ниже. Комиссия для вас — 0%">График платежей</InfoTooltip></h3><button onClick={()=>setToast({msg:"График скачан",type:"info"})} className="text-xs font-medium flex items-center gap-1 hover:underline" style={{color:B.purple}}><Download size={11}/>Скачать</button></div>
      <div className="text-sm" style={{color:B.t1}}>Сумма к оплате: <strong>{fmtByn(d.amount)}</strong></div>
      <div className="text-sm" style={{color:B.t1}}>Срок: <strong>{d.dueDate}</strong> · Осталось: <strong style={{color:d.daysLeft<14?B.yellow:B.green}}>{d.daysLeft} дн.</strong></div>
      <div className="rounded-xl p-3 mt-3 bg-white/70"><div className="text-[10px] uppercase tracking-wider font-bold mb-1.5" style={{color:B.purple}}>Реквизиты для оплаты</div><div className="space-y-1 text-sm">{[["Получатель","ЗАО «Нео Банк Азия»"],["Р/с","BY20 NEOB 3819 0000 0001 2345"],["БИК","NEOBBY2X"]].map(([l,v],i)=><div key={i} className="flex justify-between"><span style={{color:B.t3}}>{l}</span><span className="font-medium" style={{color:B.t1,fontFamily:i>0?"'JetBrains Mono',monospace":undefined}}>{v}</span></div>)}</div><Btn size="sm" variant="secondary" className="w-full mt-2" icon={ExternalLink} onClick={()=>{copyText("BY20 NEOB 3819 0000 0001 2345");setToast({msg:"Реквизиты скопированы",type:"success"})}}>Скопировать реквизиты</Btn></div>
    </Card>

    <Card className="p-5">
      <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold" style={{color:B.t1}}>Обсуждение</h3><button onClick={()=>{setInitialThread?.(d.id);setActive("db-messages")}} className="text-xs font-medium" style={{color:B.purple}}>Все сообщения →</button></div>
      {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).slice(-3).map((m,j)=><div key={j} className="flex items-start gap-2 py-1.5"><span className="text-xs font-bold shrink-0" style={{color:m.from==="creditor"?B.accent:B.purple}}>{(m.company||"").replace(/[«»ООО ОАО ЧУП ]/g,"").slice(0,12)}</span><span className="text-xs flex-1" style={{color:B.t2}}>{m.text}</span></div>)}
      {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).length===0&&<button onClick={()=>{setInitialThread?.(d.id);setActive("db-messages")}} className="text-xs font-medium flex items-center gap-1 py-2" style={{color:B.purple}}><MessageCircle size={11}/>Начать обсуждение</button>}
    </Card>
  </div>}

  // Table view
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Мои поставки" subtitle="Входящие уступки от ваших поставщиков"/>
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {[["all","Все",B.purple],["pending","Ожидает подтверждения",B.yellow],["rejected","Отклонённые",B.red],["active","Подтверждённые",B.green],["paid","Оплаченные",B.accent]].map(([v,l,cc])=><button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:cc}:undefined}>{l}</button>)}
      <div className="relative ml-auto"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск по номеру, поставщику, товару..." className="pl-9 pr-8 py-2 w-72 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"/>{search&&<button onClick={()=>setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={14} className="text-slate-400"/></button>}</div>
    </div>
    <Card className="overflow-hidden overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-xs text-left border-b border-slate-100" style={{color:B.t3,background:"#FAFBFC"}}>
      <th className="px-5 py-3 font-medium">№ уступки</th><th className="px-3 py-3 font-medium">Поставщик</th><th className="px-3 py-3 font-medium">Товар</th>
      <th className="px-3 py-3 font-medium text-right">Сумма</th><th className="px-3 py-3 font-medium">Срок</th><th className="px-3 py-3 font-medium text-center">Дней</th><th className="px-3 py-3 font-medium"><InfoTooltip text="Ожидает — нужно подписать уведомление. Подтверждена — ЭЦП подписано. Оплачена — деньги перечислены банку">Статус</InfoTooltip></th><th className="px-3 py-3 font-medium text-center">Действия</th>
    </tr></thead>
    <tbody>{filtered.map(d=>{const sup=SUPPLIERS.find(s=>s.id===d.supplierId);const isConf=confirmed.has(d.id);const isSigning=signing===d.id;
      return <tr key={d.id} onClick={()=>setViewSupply(d)} className="border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50" style={!isConf&&d.status!=="paid"&&!rejected.has(d.id)?{background:"#FFF7ED"}:undefined}>
        <td className="px-5 py-3" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:B.purple}}>{d.id}</td>
        <td className="px-3 py-3 font-medium" style={{color:B.t1}}>{sup?.name}</td>
        <td className="px-3 py-3 text-xs" style={{color:B.t2}}>{d.product}</td>
        <td className="px-3 py-3 text-right font-bold" style={{color:B.t1}}>{fmtByn(d.amount)}</td>
        <td className="px-3 py-3 text-xs" style={{color:B.t2}}>{d.dueDate}</td>
        <td className="px-3 py-3 text-center font-bold text-xs" style={{color:d.daysLeft<=0?B.red:d.daysLeft<14?B.yellow:B.green}}>{d.status==="paid"?"—":d.daysLeft}</td>
        <td className="px-3 py-3"><StatusBadge status={rejected.has(d.id)?"rejected":isConf?(d.status==="paid"?"paid":"confirmed"):"pending"}/></td>
        <td className="px-3 py-3 text-center" onClick={e=>e.stopPropagation()}><div className="flex items-center justify-center gap-1">
          {rejected.has(d.id)?<span className="text-xs" style={{color:B.red}}>Отклонена</span>:!isConf&&d.status!=="paid"?(isSigning?<Loader2 size={13} className="animate-spin" style={{color:B.purple}}/>:<><Btn size="sm" onClick={()=>handleConfirm(d.id)} icon={Pen} style={{background:B.purple}}>Подписать увед.</Btn><button onClick={()=>handleReject(d.id)} className="px-2 py-1 rounded-lg text-[10px] hover:bg-red-50" style={{color:B.red}}>Откл.</button></>):null}
          <button onClick={()=>{setInitialThread?.(d.id);setActive("db-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-purple-50" style={{color:B.purple}}><MessageCircle size={10}/>Обсудить</button>
        </div></td>
      </tr>})}</tbody></table></Card>
  </div>;
};


const DbPayments = ({setActive,setInitialThread,setInitialViewSupply,setReturnTo}) => {
  const [toast,setToast]=useState(null);
  const [showReqs,setShowReqs]=useState(null);
  const [paySearch,setPaySearch]=useState("");
  const totalUpcoming = DB_PAYMENTS.reduce((s,p)=>s+p.amount,0);
  const filtered = DB_PAYMENTS.filter(p=>{if(!paySearch)return true;const q=paySearch.toLowerCase();return p.dealId.toLowerCase().includes(q)||p.supplier.toLowerCase().includes(q)});

  const copyToClipboard = (text,label) => { copyText(text); setToast({msg:`${label} скопировано`,type:"success"}); };

  const bankReqs = { name:"ЗАО «Нео Банк Азия»", unp:"100123456", account:"BY20 NEOB 3819 0000 0001 2345", bic:"NEOBBY2X" };

  return <div>
    {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="График платежей" subtitle="Оплата на счёт банка ЗАО «Нео Банк Азия», а не поставщику"/>

    <div className="grid grid-cols-3 gap-4 mb-5">
      <Card className="p-4 text-center"><div className="text-2xl font-bold" style={{color:B.purple}}>{fmtByn(totalUpcoming)}</div><div className="text-xs mt-1" style={{color:B.t3}}><InfoTooltip text="Общая сумма всех предстоящих платежей по активным уступкам">К оплате всего</InfoTooltip></div></Card>
      <Card className="p-4 text-center"><div className="text-2xl font-bold" style={{color:B.yellow}}>{DB_PAYMENTS.length}</div><div className="text-xs mt-1" style={{color:B.t3}}>Предстоящих платежей</div></Card>
      <Card className="p-4 text-center"><div className="text-2xl font-bold" style={{color:B.green}}>{fmtByn(DB_DEALS.filter(d=>d.status==="paid").reduce((s,d)=>s+d.amount,0))}</div><div className="text-xs mt-1" style={{color:B.t3}}>Оплачено за всё время</div></Card>
    </div>

    <div className="flex items-center gap-3 mb-4"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={paySearch} onChange={e=>setPaySearch(e.target.value)} placeholder="Поиск по номеру или поставщику..." className="pl-9 pr-3 py-2 w-64 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"/></div></div>

    <Card className="overflow-hidden">
      {filtered.map(p=><div key={p.id} className="flex items-center gap-5 px-6 py-5 border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors" onClick={()=>{setInitialViewSupply?.(p.dealId);setReturnTo?.("db-payments");setActive("db-supplies")}}>
        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center" style={{background:p.daysLeft<14?B.yellowL:B.purpleL}}>
          <div className="text-[10px] font-medium" style={{color:p.daysLeft<14?B.yellow:B.purple}}>{p.dueDate.split("-")[2]}</div>
          <div className="text-[10px]" style={{color:B.t3}}>{["","янв","фев","мар","апр","май","июн"][parseInt(p.dueDate.split("-")[1])]}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium" style={{color:B.t1}}>{p.supplier}</div>
          <div className="text-xs" style={{color:B.t3}}>{p.dealId}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-bold" style={{color:B.purple}}>{fmtByn(p.amount)}</div>
          <div className="text-xs mt-0.5" style={{color:p.daysLeft<14?B.yellow:B.green}}>через {p.daysLeft} дн.</div>
        </div>
        <Btn variant="secondary" size="sm" icon={ExternalLink} onClick={e=>{e.stopPropagation();setShowReqs(p)}}>Реквизиты</Btn>
        <button onClick={e=>{e.stopPropagation();setInitialThread?.(p.dealId);setActive("db-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-purple-50 shrink-0" style={{color:B.purple}}><MessageCircle size={10}/>Обсудить</button>
      </div>)}
    </Card>

    {/* Requisites Modal */}
    <Modal open={!!showReqs} onClose={()=>setShowReqs(null)} title="Реквизиты для оплаты">
      {showReqs&&<div>
        <div className="text-center mb-3">
          <div className="text-2xl font-bold" style={{color:B.purple}}>{fmtByn(showReqs.amount)}</div>
          <div className="text-xs mt-0.5" style={{color:B.t2}}>до {showReqs.dueDate} · {showReqs.dealId}</div>
        </div>

        <div className="space-y-1.5 mb-3">
          {[
            {label:"Получатель",value:bankReqs.name},
            {label:"УНП",value:bankReqs.unp},
            {label:"Р/с",value:bankReqs.account,mono:true},
            {label:"БИК",value:bankReqs.bic,mono:true},
            {label:"Назначение",value:`Оплата по дог. факторинга ${showReqs.dealId}`},
          ].map((field,i)=><div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
            <div className="min-w-0 flex-1">
              <div className="text-[10px]" style={{color:B.t3}}>{field.label}</div>
              <div className={`text-xs font-medium ${field.mono?"break-all":""}`} style={{color:B.t1,fontFamily:field.mono?"'JetBrains Mono',monospace":undefined}}>{field.value}</div>
            </div>
            <button onClick={()=>copyToClipboard(field.value,field.label)} className="ml-2 px-2 py-1 rounded text-[10px] font-medium shrink-0 hover:bg-slate-200" style={{color:B.accent}}>
              Скопировать
            </button>
          </div>)}
        </div>

        <Btn className="w-full" size="sm" icon={Download} onClick={()=>{
          const all = `Получатель: ${bankReqs.name}\nУНП: ${bankReqs.unp}\nР/с: ${bankReqs.account}\nБИК: ${bankReqs.bic}\nСумма: ${fmtByn(showReqs.amount)}\nНазначение: Оплата по договору факторинга за поставку ${showReqs.dealId}`;
          copyToClipboard(all,"Все реквизиты");
        }}>Скопировать все реквизиты</Btn>
      </div>}
    </Modal>
  </div>;
};

const DbLimit = () => {
  const [toast,setToast]=useState(null);
  const [sectionSigning,setSectionSigning]=useState(null);
  const [signedFields,setSignedFields]=useState(new Set());
  const [addedEntries,setAddedEntries]=useState({});
  const [showRequest,setShowRequest]=useState(false);

  return <div>
    {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Ваш факторинговый лимит" subtitle="Максимальная сумма факторинга по вашим поставкам"/>

    <Card className="p-4 mb-5" style={{background:B.purpleL,borderColor:"#C4B5FD"}}>
      <div className="flex items-start gap-3"><Info size={18} style={{color:B.purple}} className="shrink-0 mt-0.5"/>
      <div className="text-sm" style={{color:B.t1}}>Лимит определяет максимальную сумму, которую ваши поставщики могут уступить банку по вашим поставкам. Чем выше лимит — тем больше отсрочки вы можете получить от поставщиков через платформу Oborotka.by.</div></div>
    </Card>

    {SUPPLIERS.map(sup=>{const pct=Math.round(sup.used/sup.limit*100);
      return <Card key={sup.id} className="p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div><h3 className="font-semibold" style={{color:B.t1}}>{sup.name}</h3><div className="text-xs" style={{color:B.t3,fontFamily:"'JetBrains Mono',monospace"}}>УНП {sup.unp}</div></div>
          <StatusBadge status="green"/>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl p-4 text-center" style={{background:B.purpleL}}><div className="text-xs" style={{color:B.purple}}>Лимит</div><div className="text-2xl font-bold" style={{color:B.purple}}>{fmtByn(sup.limit)}</div></div>
          <div className="rounded-xl p-4 text-center bg-slate-50"><div className="text-xs" style={{color:B.t3}}>Использовано</div><div className="text-2xl font-bold" style={{color:B.t1}}>{fmtByn(sup.used)}</div></div>
          <div className="rounded-xl p-4 text-center" style={{background:B.greenL}}><div className="text-xs" style={{color:B.green}}>Доступно</div><div className="text-2xl font-bold" style={{color:B.green}}>{fmtByn(sup.available)}</div></div>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden mb-3"><div className="h-full rounded-full" style={{width:`${pct}%`,background:pct>80?B.red:pct>50?B.yellow:B.purple}}/></div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{color:B.t3}}>Стоимость за 60 дн.: <strong style={{color:B.purple}}>{calcPeriodRate(sup.rate,60)}%</strong></span>
          <Btn size="sm" variant="secondary" icon={TrendingUp} onClick={()=>setShowRequest(true)}>Запросить увеличение</Btn>
        </div>
      </Card>;
    })}

    <Modal open={showRequest} onClose={()=>setShowRequest(false)} title="Запрос увеличения лимита">
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Желаемый лимит (BYN)</label><input placeholder="300 000" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"/></div>
        <div><label className="block text-sm font-medium mb-1">Обоснование</label><textarea placeholder="Увеличение объёма закупок цемента на Q2 2026..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"/></div>
        <Btn className="w-full" icon={Send} onClick={()=>{setShowRequest(false);setToast({msg:"Заявка на увеличение лимита отправлена в банк",type:"success"})}}>Отправить заявку</Btn>
      </div>
    </Modal>
  </div>;
};

// ═══════════════════════════════════════════════════════════
// ═══ SUPPORT PAGE (full — replaces chat widget) ═════════
const SUPPORT_TICKETS_INIT = [
  {id:"SUP-0003",subject:"Вопрос по дисконту УС-2026-0042",category:"Дисконт/финансы",dealId:"УС-2026-0042",buyer:"ООО «БелТехСнаб»",status:"waiting",created:"22.03.2026 14:30",unread:true,
    messages:[{from:"user",text:"Добрый день! Почему дисконт по уступке УС-2026-0042 составил 2 774 BYN при ставке 25%?",time:"14:30",date:"22.03"},{from:"support",name:"Анна К.",text:"Здравствуйте, Ольга! Дисконт: 45 000 × (25%/365) × 90 = 2 774 BYN. Ставка 25% годовых за 90 дней = 6.16%. Нужна ещё помощь?",time:"14:45",date:"22.03"}]},
  {id:"SUP-0002",subject:"Как добавить нового покупателя",category:"Покупатели",dealId:null,buyer:null,status:"resolved",created:"21.03.2026 10:15",unread:false,
    messages:[{from:"user",text:"Хочу добавить покупателя ОАО «МинскПромТорг». Как?",time:"10:15",date:"21.03"},{from:"support",name:"Анна К.",text:"Перейдите в «Пре-скоринг» → введите УНП 100987654 → система проверит и установит лимит.",time:"10:25",date:"21.03"},{from:"user",text:"Спасибо, получилось!",time:"10:38",date:"21.03"},{from:"support",name:"Анна К.",text:"Рады помочь! Отмечаю как решённое.",time:"10:40",date:"21.03"}]},
  {id:"SUP-0001",subject:"Не загружается ТТН",category:"Документы",dealId:"УС-2026-0039",buyer:"ООО «БелТехСнаб»",status:"resolved",created:"15.03.2026 09:00",unread:false,
    messages:[{from:"user",text:"При создании уступки не загружается ТТН — ошибка «формат не поддерживается».",time:"09:00",date:"15.03"},{from:"support",name:"Дмитрий П.",text:"Поддерживаемые форматы: PDF, JPG, PNG до 10 МБ. Проверьте формат.",time:"09:15",date:"15.03"},{from:"user",text:"Перевёл в PDF — загрузилось. Спасибо!",time:"09:28",date:"15.03"},{from:"support",name:"Дмитрий П.",text:"Рекомендуем сканировать сразу в PDF — лучший формат для ЭЦП.",time:"09:30",date:"15.03"}]},
];

const SUPPORT_CATEGORIES=["Вопрос по уступке","Дисконт/финансы","Документы","Проблема с ЭЦП","Покупатели/должники","Техническая проблема","Другое"];

// ═══ DEAL MESSAGES (inter-party communication) ═══
// ═══ DEAL MESSAGES (inter-party communication) ═══
const DEAL_MESSAGES_INIT = {
  "УС-2026-0042":{status:"resolved",messages:[
    {from:"creditor",company:COMPANY.name,text:"Отгрузка выполнена, ТТН прикреплена. Прошу подтвердить получение.",time:"14:30",date:"15.03"},
    {from:"debtor",company:"ООО «БелТехСнаб»",text:"Подтверждаю, товар получен. Подпишу ЭЦП сегодня.",time:"16:10",date:"15.03"},
  ]},
  "УС-2026-0041":{status:"waiting",messages:[
    {from:"creditor",company:COMPANY.name,text:"Акт выполненных работ подписан. Прошу подтвердить.",time:"10:20",date:"14.03"},
  ]},
  "УС-2026-0038":{status:"active",messages:[
    {from:"creditor",company:COMPANY.name,text:"Добрый день! Срок оплаты через 11 дней. Всё в силе?",time:"09:00",date:"22.03"},
    {from:"debtor",company:"ООО «АгроТрейд Плюс»",text:"Да, оплатим в срок.",time:"09:45",date:"22.03"},
    {from:"creditor",company:COMPANY.name,text:"Отлично, спасибо!",time:"10:02",date:"22.03"},
  ]},
  "УС-2026-0039":{status:"active",messages:[
    {from:"creditor",company:COMPANY.name,text:"ТТН загружена. Ожидаю подтверждения.",time:"11:00",date:"10.03"},
    {from:"debtor",company:"ООО «БелТехСнаб»",text:"Принято, проверяю документы.",time:"14:20",date:"10.03"},
  ]},
};

const THREAD_STATUS={active:{bg:"#ECFDF5",c:"#059669",l:"Активно"},waiting:{bg:"#FFF7ED",c:"#D97706",l:"Ожидает ответа"},resolved:{bg:"#F1F5F9",c:"#64748B",l:"Решено"}};

const MessagesPage = ({ctx,setActive,initialThread,onNavigateDeal}) => {
  const accent=ctx==="creditor"?B.accent:B.purple;
  const myRole=ctx==="creditor"?"creditor":"debtor";
  const [messages,setMessages]=useState(DEAL_MESSAGES_INIT);
  const [activeThread,setActiveThread]=useState(initialThread||null);
  const [input,setInput]=useState("");
  const [filter,setFilter]=useState("all");
  const [toast,setToast]=useState(null);
  const [showNewThread,setShowNewThread]=useState(false);
  const [newThreadDeal,setNewThreadDeal]=useState("");
  const [newThreadMsg,setNewThreadMsg]=useState("");
  const [threadSearch,setThreadSearch]=useState("");
  const [replyTo,setReplyTo]=useState(null);
  const [docContext,setDocContext]=useState(null);
  const [attachment,setAttachment]=useState(null);
  const msgEnd=useRef(null);

  useEffect(()=>{
    if(initialThread){
      setActiveThread(initialThread);
      // Auto-create empty thread if doesn't exist
      setMessages(p=>{
        if(!p[initialThread]){
          return {...p,[initialThread]:{status:"active",messages:[]}};
        }
        return p;
      });
      setFilter("all");
    }
  },[initialThread]);
  useEffect(()=>{msgEnd.current?.scrollIntoView({behavior:"smooth"})},[activeThread,messages]);

  const deals=ctx==="creditor"?CR_DEALS:DB_DEALS;
  const threads=deals.map(d=>{const thread=messages[d.id];const msgs=thread?.messages||[];const st=thread?.status||null;const lastMsg=msgs[msgs.length-1];const unread=msgs.length>0&&lastMsg?.from!==myRole;const counterparty=ctx==="creditor"?BUYERS.find(b=>b.id===d.buyerId)?.name:(d.supplierId?SUPPLIERS.find(s=>s.id===d.supplierId)?.name:COMPANY.name);return{dealId:d.id,counterparty:counterparty||"—",amount:d.amount,status:d.status,threadStatus:st,msgs,lastMsg,unread,msgCount:msgs.length}}).filter(t=>{if(!t.threadStatus)return false;if(filter==="all")return true;if(filter==="active")return t.threadStatus==="active"||t.threadStatus==="waiting";if(filter==="resolved")return t.threadStatus==="resolved";return t.unread}).sort((a,b)=>{if(a.threadStatus==="resolved"&&b.threadStatus!=="resolved")return 1;if(b.threadStatus==="resolved"&&a.threadStatus!=="resolved")return -1;return 0});

  const thread=threads.find(t=>t.dealId===activeThread)||(activeThread&&messages[activeThread]?{dealId:activeThread,counterparty:ctx==="creditor"?(BUYERS.find(b=>b.id===deals.find(d=>d.id===activeThread)?.buyerId)?.name||"—"):"—",amount:deals.find(d=>d.id===activeThread)?.amount||0,status:deals.find(d=>d.id===activeThread)?.status||"active",threadStatus:messages[activeThread]?.status||"active",msgs:messages[activeThread]?.messages||[],lastMsg:null,unread:false,msgCount:0}:null);

  const sendMsg=()=>{
    if(!input.trim()||!activeThread)return;
    const now=new Date();const deal=deals.find(d=>d.id===activeThread);const counterName=ctx==="creditor"?BUYERS.find(b=>b.id===deal?.buyerId)?.name||"Контрагент":"Контрагент";
    const msg={from:myRole,company:myRole==="creditor"?COMPANY.name:counterName,text:input,time:now.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:now.toLocaleDateString("ru",{day:"2-digit",month:"2-digit"}),replyTo:replyTo||undefined,attachment:attachment||undefined,docRef:docContext?{label:docContext.label,name:docContext.name}:undefined};
    setReplyTo(null);setAttachment(null);setDocContext(null);
    setMessages(p=>({...p,[activeThread]:{status:"waiting",messages:[...(p[activeThread]?.messages||[]),msg]}}));
    const q=input.toLowerCase();setInput("");
    setTimeout(()=>{
      let reply="Спасибо, примем к сведению.";
      if(q.includes("подтверд")||q.includes("получ"))reply="Подтверждаю получение.";
      else if(q.includes("оплат")||q.includes("срок"))reply="Оплатим в установленный срок.";
      else if(q.includes("документ")||q.includes("ттн")||q.includes("акт"))reply="Документы проверим, вернёмся в течение дня.";
      const rmsg={from:myRole==="creditor"?"debtor":"creditor",company:thread?.counterparty||"Контрагент",text:reply,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})};
      setMessages(p=>({...p,[activeThread]:{...p[activeThread],status:"active",messages:[...(p[activeThread]?.messages||[]),rmsg]}}));
    },2000);
  };

  const createThread=()=>{
    if(!newThreadDeal||!newThreadMsg.trim())return;
    const now=new Date();
    setMessages(p=>({...p,[newThreadDeal]:{status:"waiting",messages:[{from:myRole,company:COMPANY.name,text:newThreadMsg,time:now.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:now.toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})}]}}));
    setActiveThread(newThreadDeal);setShowNewThread(false);setNewThreadDeal("");setNewThreadMsg("");
    setToast({msg:"Обсуждение начато",type:"success"});
    setTimeout(()=>{
      setMessages(p=>({...p,[newThreadDeal]:{...p[newThreadDeal],status:"active",messages:[...p[newThreadDeal].messages,{from:myRole==="creditor"?"debtor":"creditor",company:deals.find(d=>d.id===newThreadDeal)?BUYERS.find(b=>b.id===deals.find(d=>d.id===newThreadDeal)?.buyerId)?.name||"Контрагент":"Контрагент",text:"Спасибо за обращение, рассмотрим.",time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})}]}}));
    },2000);
  };

  const dealsWithoutThread=deals.filter(d=>!messages[d.id]);

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Сообщения" subtitle="Обсуждения с контрагентами по уступкам и документам"/>

    <div className="flex gap-5" style={{minHeight:"65vh"}}>
      <div className="w-72 shrink-0 flex flex-col">
        <Btn className="w-full mb-3" icon={Plus} onClick={()=>setShowNewThread(true)}>Новое обсуждение</Btn>
        <div className="flex gap-1 mb-3">{[["all","Все"],["active","Активные"],["resolved","Решённые"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:accent}:undefined}>{l}</button>)}</div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {threads.length===0&&<div className="text-center py-8 text-xs" style={{color:B.t3}}>Нет обсуждений</div>}
          {threads.map(t=>{const isAct=activeThread===t.dealId;const ts=THREAD_STATUS[t.threadStatus]||THREAD_STATUS.active;return <div key={t.dealId} onClick={()=>setActiveThread(t.dealId)} className={`rounded-xl border p-3 cursor-pointer transition-all ${isAct?"shadow-md":"hover:shadow-sm"}`} style={{borderColor:isAct?accent:B.border,background:isAct?accent+"08":"white",opacity:t.threadStatus==="resolved"?0.7:1}}>
            <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold" style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>{t.dealId}</span><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium" style={{background:ts.bg,color:ts.c}}>{t.threadStatus==="resolved"?<Check size={8}/>:null}{ts.l}</span></div>
            <div className="text-xs font-semibold truncate" style={{color:B.t1}}>{t.counterparty}</div>
            <div className="text-[10px]" style={{color:B.t3}}>{fmtByn(t.amount)}</div>
            {t.lastMsg&&<div className="text-[10px] mt-1 truncate italic" style={{color:B.t3}}>«{t.lastMsg.text}»</div>}
            <div className="flex items-center justify-between mt-1"><span className="text-[9px]" style={{color:B.t3}}>{t.lastMsg?`${t.lastMsg.date} ${t.lastMsg.time}`:""}</span>{t.unread&&t.threadStatus!=="resolved"&&<span className="w-2 h-2 rounded-full" style={{background:accent}}/>}</div>
          </div>})}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {thread?<Card className="flex-1 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 shrink-0 flex items-center justify-between" style={{background:"#FAFBFC"}}>
            <div><div className="flex items-center gap-2"><span className="text-xs font-bold" style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>{thread.dealId}</span><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium" style={{background:(THREAD_STATUS[thread.threadStatus]||{}).bg,color:(THREAD_STATUS[thread.threadStatus]||{}).c}}>{(THREAD_STATUS[thread.threadStatus]||{}).l}</span></div><div className="text-sm font-semibold mt-0.5" style={{color:B.t1}}>{thread.counterparty} · {fmtByn(thread.amount)}</div></div>
            <div className="flex gap-2">{thread.threadStatus!=="resolved"?<Btn size="sm" variant="secondary" icon={CheckCircle} onClick={()=>{setMessages(p=>({...p,[thread.dealId]:{...p[thread.dealId],status:"resolved"}}));setToast({msg:"Отмечено как решённое",type:"success"})}}>Решено</Btn>:<Btn size="sm" variant="secondary" onClick={()=>{setMessages(p=>({...p,[thread.dealId]:{...p[thread.dealId],status:"active"}}));setToast({msg:"Обсуждение открыто заново",type:"success"})}}>Открыть заново</Btn>}
            <Btn size="sm" variant="ghost" onClick={()=>{onNavigateDeal?.(thread.dealId);setActive(ctx==="creditor"?"cr-deals":"db-supplies")}}>К уступке →</Btn></div>
          </div>
          {/* Documents panel */}
          <div className="border-b border-slate-100 shrink-0" style={{background:"#F8FAFC"}}>
            <div className="px-4 py-2 flex items-center gap-1.5 text-[10px] overflow-x-auto" style={{color:B.t3}}>
              <span className="font-medium shrink-0">Документы:</span>
              {(()=>{const deal=CR_DEALS.find(dd=>dd.id===thread.dealId)||DB_DEALS.find(dd=>dd.id===thread.dealId);if(!deal)return <span>—</span>;const num=deal.id.split("-")[2];return [{icon:Gavel,name:deal.supAg||`ДС №${num}`,label:"ДС"},{icon:FileSpreadsheet,name:`${deal.docType==="ttn"?"ТТН":"Акт"}_${num}.pdf`,label:deal.docType==="ttn"?"ТТН":"Акт"},{icon:Receipt,name:`ЭСЧФ_${num}.pdf`,label:"ЭСЧФ"},{icon:Send,name:`Увед._${num}`,label:"Увед."}].map((doc,i)=>{const isSel=docContext?.label===doc.label;return <div key={i} onClick={()=>setDocContext(isSel?null:doc)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${isSel?"border-blue-400 bg-blue-50 shadow-sm":"border-slate-200 bg-white hover:border-blue-300"}`}><doc.icon size={12} style={{color:isSel?accent:B.t3}}/><span className="font-medium" style={{color:isSel?accent:B.t1}}>{doc.label}</span></div>})})()}
            </div>
            {docContext&&<div className="px-4 py-1.5 flex items-center gap-2 border-t border-slate-100" style={{background:"#EFF6FF"}}>
              <span className="text-[10px] flex-1" style={{color:accent}}><span className="font-bold">{docContext.label}</span> · {docContext.name}</span>
              <button onClick={()=>setToast({msg:`${docContext.name} — просмотр`,type:"info"})} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-50"><Eye size={12} className="text-slate-500"/>Просмотреть</button>
              <button onClick={()=>setToast({msg:`${docContext.name} — скачан`,type:"info"})} className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium bg-white border border-slate-200 hover:bg-slate-50"><Download size={12} className="text-slate-500"/>Скачать</button>
            </div>}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {thread.msgs.map((m,i)=>{const isMine=m.from===myRole;return <div key={i} className={`flex ${isMine?"justify-end":"justify-start"} group`}><div className="max-w-[75%]">
              {!isMine&&<div className="text-[10px] font-medium mb-1 ml-1" style={{color:B.t3}}>{m.company}</div>}
              {m.replyTo&&<div className={`px-3 py-1.5 rounded-t-xl text-[10px] border-l-2 mb-0.5 ${isMine?"text-white/70":"text-slate-500"}`} style={isMine?{background:accent+"CC",borderColor:"white"}:{background:"#E2E8F0",borderColor:accent}}><span className="font-medium">{m.replyTo.company}:</span> {m.replyTo.text.slice(0,60)}{m.replyTo.text.length>60?"...":""}</div>}
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine?"rounded-br-md text-white":"rounded-bl-md bg-slate-100"} ${m.replyTo?isMine?"rounded-tr-none":"rounded-tl-none":""}`} style={isMine?{background:accent}:{color:B.t1}}>
                {m.docRef&&<div className={`mb-1.5 flex items-center gap-1 text-[10px] font-medium ${isMine?"text-white/80":"text-slate-500"}`}><FileText size={10}/>по документу: {m.docRef.label}</div>}
                {m.text}
                {m.attachment&&<div className={`mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${isMine?"bg-white/20":"bg-white border border-slate-200"}`}><Paperclip size={11}/><span className="font-medium">{m.attachment}</span></div>}
              </div>
              <div className={`flex items-center gap-2 mt-1 ${isMine?"justify-end mr-1":"ml-1"}`}><span className="text-[10px]" style={{color:B.t3}}>{m.date} {m.time}</span><button onClick={()=>setReplyTo({idx:i,text:m.text,company:m.company||COMPANY.name})} className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:underline" style={{color:accent}}>Ответить</button></div>
            </div></div>})}
            <div ref={msgEnd}/>
          </div>
          {thread.threadStatus!=="resolved"?<div className="border-t border-slate-100 shrink-0">
            {replyTo&&<div className="px-4 pt-2 flex items-center gap-2"><div className="flex-1 px-3 py-1.5 rounded-lg border-l-2 text-xs" style={{background:"#F1F5F9",borderColor:accent,color:B.t2}}><span className="font-medium" style={{color:B.t1}}>{replyTo.company}:</span> {replyTo.text.slice(0,80)}{replyTo.text.length>80?"...":""}</div><button onClick={()=>setReplyTo(null)} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>}
            {docContext&&<div className="px-4 pt-2 flex items-center gap-2"><div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{background:accent+"15",color:accent}}><FileText size={12}/><span>по документу: {docContext.label} ({docContext.name})</span></div><button onClick={()=>setDocContext(null)} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>}
            {attachment&&<div className="px-4 pt-2 flex items-center gap-2"><div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs" style={{background:accent+"10",color:accent}}><Paperclip size={12}/><span className="font-medium">{attachment}</span></div><button onClick={()=>setAttachment(null)} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>}
            <div className="p-3 flex gap-2">
              <button onClick={()=>setAttachment(`Документ_${Date.now()}.pdf`)} className="p-2.5 rounded-xl hover:bg-slate-100" title="Прикрепить файл"><Paperclip size={16} className="text-slate-400"/></button>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Напишите контрагенту..." className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2" style={{"--tw-ring-color":accent+"40"}}/>
              <button onClick={sendMsg} className="p-2.5 rounded-xl text-white" style={{background:accent}}><Send size={16}/></button>
            </div>
          </div>:<div className="p-3 border-t border-slate-100 text-center"><span className="text-xs" style={{color:B.t3}}>Обсуждение завершено</span><button onClick={()=>setMessages(p=>({...p,[thread.dealId]:{...p[thread.dealId],status:"active"}}))} className="text-xs ml-2 underline" style={{color:accent}}>Открыть заново</button></div>}
        </Card>

        :<Card className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background:accent+"15"}}><MessageCircle size={28} style={{color:accent}}/></div>
          <h3 className="text-lg font-bold" style={{color:B.t1}}>Сообщения</h3>
          <p className="text-xs mt-1 text-center max-w-xs" style={{color:B.t3}}>Обсуждения с контрагентами привязаны к уступкам. Выберите слева или начните новое.</p>
          <Btn className="mt-4" icon={Plus} onClick={()=>setShowNewThread(true)}>Новое обсуждение</Btn>
        </Card>}
      </div>
    </div>

    <Modal open={showNewThread} onClose={()=>{setShowNewThread(false);setThreadSearch("")}} title="Новое обсуждение">
      <div className="space-y-4">
        <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Найдите уступку или документ</label>
          <div className="relative mb-2"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={threadSearch} onChange={e=>setThreadSearch(e.target.value)} placeholder="Поиск по номеру, компании, сумме..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
          <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200">
            {deals.filter(d=>{const q=threadSearch.toLowerCase();const buyer=ctx==="creditor"?BUYERS.find(b=>b.id===d.buyerId)?.name||"":"";return!q||d.id.toLowerCase().includes(q)||buyer.toLowerCase().includes(q)||String(d.amount).includes(q)}).map(d=>{const buyer=ctx==="creditor"?BUYERS.find(b=>b.id===d.buyerId)?.name||"":"";const has=!!messages[d.id];const isSel=newThreadDeal===d.id;return <div key={d.id} onClick={()=>{if(!has)setNewThreadDeal(isSel?"":d.id)}} className={`px-3 py-2.5 text-xs border-b border-slate-50 transition-all cursor-pointer ${has?"opacity-40 cursor-not-allowed":"hover:bg-slate-50"}`} style={isSel?{background:accent+"12",borderLeft:`3px solid ${accent}`}:has?{pointerEvents:"none"}:{}}>
              <div className="flex items-center justify-between"><span className="font-bold" style={{color:isSel?accent:B.t1,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span>{has?<span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100" style={{color:B.t3}}>уже есть</span>:isSel?<span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{background:accent}}><Check size={11}/></span>:null}</div>
              <div className="flex items-center gap-2 mt-0.5"><span style={{color:B.t2}}>{buyer}</span><span style={{color:B.t3}}>·</span><span style={{color:B.t3}}>{fmtByn(d.amount)}</span><span style={{color:B.t3}}>·</span><StatusBadge status={d.status}/></div>
            </div>})}
          </div>
        </div>
        <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Первое сообщение</label><textarea value={newThreadMsg} onChange={e=>setNewThreadMsg(e.target.value)} rows={3} placeholder="Опишите вопрос по документу или уступке..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
        <Btn icon={Send} onClick={createThread} disabled={!newThreadDeal||!newThreadMsg.trim()}>Начать обсуждение</Btn>
      </div>
    </Modal>
  </div>;
};

const SupportPage = ({ctx}) => {
  const [expandedFaq,setExpandedFaq]=useState(null);
  const accent=ctx==="creditor"?B.accent:B.purple;
  const [tickets,setTickets]=useState(SUPPORT_TICKETS_INIT);
  const [activeTicket,setActiveTicket]=useState(null);
  const [filter,setFilter]=useState("open");
  const [input,setInput]=useState("");
  const [showNew,setShowNew]=useState(false);
  const [newSubject,setNewSubject]=useState("");
  const [newCategory,setNewCategory]=useState("");
  const [newDeal,setNewDeal]=useState("");
  const [newDesc,setNewDesc]=useState("");
  const [toast,setToast]=useState(null);
  const [mode,setMode]=useState("tickets");
  const [aiMessages,setAiMessages]=useState([{from:"ai",text:"Здравствуйте, Ольга! Я AI-ассистент платформы Oborotka.by.\n\nМогу помочь с:\n• Расчётом дисконта и ставок\n• Статусом уступок и платежей\n• Документами и ЭЦП\n• Правилами факторинга\n\nСпрашивайте — отвечу мгновенно.",time:"now"}]);
  const [aiInput,setAiInput]=useState("");
  const [aiTyping,setAiTyping]=useState(false);
  const msgEndRef=useRef(null);
  const aiEndRef=useRef(null);

  useEffect(()=>{msgEndRef.current?.scrollIntoView({behavior:"smooth"})},[activeTicket,tickets]);
  useEffect(()=>{aiEndRef.current?.scrollIntoView({behavior:"smooth"})},[aiMessages,aiTyping]);

  const filtered=tickets.filter(t=>filter==="all"?true:filter==="open"?t.status!=="resolved":t.status==="resolved");
  const active=tickets.find(t=>t.id===activeTicket);
  const statusCfg={waiting:{bg:B.yellowL,c:B.yellow,l:"Ожидает"},in_progress:{bg:B.accentL,c:B.accent,l:"В работе"},resolved:{bg:B.greenL,c:B.green,l:"Решено"},new:{bg:B.redL,c:B.red,l:"Новое"}};

  const generateAiResponse=(question)=>{
    const q=question.toLowerCase();
    if(q.includes("рассчит")||q.includes("дисконт")||q.includes("калькул")){
      const m=q.match(/(\d[\d\s]*)/);const sum=m?parseInt(m[1].replace(/\s/g,"")):100000;
      const d30=Math.round(sum*(25/100/365)*30);const d60=Math.round(sum*(25/100/365)*60);const d90=Math.round(sum*(25/100/365)*90);
      return `Расчёт дисконта для ${fmtByn(sum)} (ставка 25%):\n\n• 30 дней: ${fmtByn(d30)} (получите ${fmtByn(sum-d30)})\n• 60 дней: ${fmtByn(d60)} (получите ${fmtByn(sum-d60)})\n• 90 дней: ${fmtByn(d90)} (получите ${fmtByn(sum-d90)})\n\nФормула: сумма × (ставка/365) × дни.`}
    if(q.includes("статус")||q.includes("уступк")||q.includes("сделк")){
      const ac=CR_DEALS.filter(d=>d.status==="active");const ov=CR_DEALS.filter(d=>d.status==="overdue");const pd=CR_DEALS.filter(d=>d.status==="paid");
      return `Ваши уступки:\n\n✅ Активные: ${ac.length} на ${fmtByn(ac.reduce((s,d)=>s+d.amount,0))}\n🔴 Просроченные: ${ov.length} на ${fmtByn(ov.reduce((s,d)=>s+d.amount,0))}\n✓ Оплаченные: ${pd.length}\n\nБлижайший срок: ${ac.sort((a,b)=>a.daysLeft-b.daysLeft)[0]?.id} — ${ac.sort((a,b)=>a.daysLeft-b.daysLeft)[0]?.daysLeft} дн.`}
    if(q.includes("платёж")||q.includes("платеж")||q.includes("оплат")||q.includes("когда")){
      return `Ближайшие платежи:\n\n${DB_PAYMENTS.map(p=>`• ${p.dealId}: ${fmtByn(p.amount)} до ${p.dueDate} (${p.daysLeft} дн.)`).join("\n")}\n\nРеквизиты: ЗАО «Нео Банк Азия»\nР/с: BY20 NEOB 3819 0000 0001 2345`}
    if(q.includes("документ")||q.includes("ттн")||q.includes("акт")||q.includes("эсчф")||q.includes("загруз")){
      return "Для уступки нужны:\n\n1. ТТН (товары) или Акт ВР (услуги)\n2. ЭСЧФ (электронный счёт-фактура)\n\nДопсоглашение формируется автоматически.\nФорматы: PDF, JPG, PNG до 10 МБ.\nФинансирование — 3 рабочих дня после ЭЦП."}
    if(q.includes("покупател")||q.includes("лимит")||q.includes("доступн")){
      const ap=BUYERS.filter(b=>b.status==="green");
      return `Одобренные покупатели:\n\n${ap.map(b=>`• ${b.name}: доступно ${fmtByn(b.available)} из ${fmtByn(b.limit)}`).join("\n")}\n\nОбщий доступный лимит: ${fmtByn(ap.reduce((s,b)=>s+b.available,0))}`}
    if(q.includes("просроч")||q.includes("риск")||q.includes("безрегресс")){
      return "У вас безрегрессный факторинг — риск неоплаты на банке.\n\nВам НЕ нужно возвращать финансирование.\nБанк сам работает с должником.\n\nПросрочено сейчас: "+CR_DEALS.filter(d=>d.status==="overdue").length+" уступок."}
    if(q.includes("эцп")||q.includes("подпис")){
      return "Все документы подписываются ЭЦП:\n\n• Генеральный договор — при онбординге\n• Допсоглашения — при каждой уступке\n• Согласия (БКИ, ОЭБ, ПД) — при онбординге\n• Уведомления — при уступке\n\nПроблемы? Создайте обращение."}
    if(q.includes("ставк")||q.includes("процент")||q.includes("стоимость")){
      return "Ставки факторинга (годовые):\n\n• 20.5% — лучшие покупатели\n• 25.0% — стандарт\n• 30.0% — повышенный риск\n\nЗа 60 дней: 3.37% / 4.11% / 4.93%\nСтавка индивидуальна по каждому покупателю."}
    if(q.includes("компани")||q.includes("данные")||q.includes("анкет")){
      return `${COMPANY.name}\nУНП: ${COMPANY.unp}\nДиректор: ${COMPANY.director}\n\nОбновить данные → «Анкета компании».`}
    return "Хороший вопрос! Я пока не могу точно ответить.\n\nПопробуйте спросить про: дисконт, уступки, документы, покупателей, ЭЦП, ставки.\n\nИли создайте обращение — менеджер ответит за 15 мин."
  };

  const sendAi=()=>{
    if(!aiInput.trim())return;
    const q=aiInput;
    setAiMessages(p=>[...p,{from:"user",text:q,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}]);
    setAiInput("");setAiTyping(true);
    setTimeout(()=>{
      setAiTyping(false);
      setAiMessages(p=>[...p,{from:"ai",text:generateAiResponse(q),time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}]);
    },800);
  };

  const sendMsg=()=>{
    if(!input.trim()||!activeTicket)return;
    const msg={from:"user",text:input,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})};
    setTickets(p=>p.map(t=>t.id===activeTicket?{...t,messages:[...t.messages,msg],status:"waiting",unread:false}:t));
    const q=input.toLowerCase();setInput("");
    setTimeout(()=>{
      let reply="Спасибо! Менеджер ответит в течение 15 минут.";
      if(q.includes("дисконт")||q.includes("ставк"))reply="Дисконт: сумма × (ставка/365) × дни. Ставки: 20.5%, 25%, 30% годовых.";
      else if(q.includes("документ")||q.includes("ттн"))reply="Форматы: PDF, JPG, PNG до 10 МБ. Для ЭЦП рекомендуем PDF.";
      else if(q.includes("просрочк"))reply="Безрегрессный факторинг — банк сам работает с должником.";
      const rmsg={from:"support",name:"Анна К.",text:reply,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})};
      setTickets(p=>p.map(t=>t.id===activeTicket?{...t,messages:[...t.messages,rmsg]}:t));
    },1500);
  };

  const createTicket=()=>{
    if(!newSubject.trim()||!newDesc.trim())return;
    const id=`SUP-${String(tickets.length+1).padStart(4,"0")}`;const now=new Date();
    const ticket={id,subject:newSubject,category:newCategory||"Другое",dealId:newDeal||null,buyer:null,status:"new",created:`${now.toLocaleDateString("ru")} ${now.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}`,unread:false,
      messages:[{from:"user",text:newDesc,time:now.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:now.toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})}]};
    setTickets(p=>[ticket,...p]);setActiveTicket(id);setShowNew(false);setNewSubject("");setNewCategory("");setNewDeal("");setNewDesc("");
    setToast({msg:`Обращение ${id} создано`,type:"success"});
    setTimeout(()=>{const rmsg={from:"support",name:"Анна К.",text:`Обращение ${id} принято. Ответим в ближайшее время.`,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"}),date:new Date().toLocaleDateString("ru",{day:"2-digit",month:"2-digit"})};setTickets(p=>p.map(t=>t.id===id?{...t,messages:[...t.messages,rmsg],status:"in_progress"}:t))},2000);
  };

  const quickQ=["Рассчитай дисконт для 80 000 BYN","Статус моих уступок","Когда ближайший платёж?","Какие документы нужны?","Ставки по покупателям","Что такое безрегрессный факторинг?"];

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Поддержка" subtitle="Обращения, AI-ассистент и помощь"/>

    {/* Mode switcher */}
    <div className="flex gap-1 p-1 rounded-xl bg-slate-100 mb-5 max-w-xs">
      <button onClick={()=>setMode("tickets")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${mode==="tickets"?"bg-white shadow-sm":"text-slate-500"}`} style={mode==="tickets"?{color:B.t1}:undefined}><MessageSquare size={13}/>Обращения</button>
      <button onClick={()=>setMode("ai")} className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${mode==="ai"?"bg-white shadow-sm":"text-slate-500"}`} style={mode==="ai"?{color:B.t1}:undefined}><Zap size={13}/>AI-ассистент</button>
    </div>

    {mode==="ai"?
    /* ═══ AI CHAT MODE ═══ */
    <Card className="flex flex-col" style={{minHeight:"70vh"}}>
      <div className="px-5 py-3 border-b border-slate-100 shrink-0 flex items-center gap-3" style={{background:"linear-gradient(135deg,#EFF6FF,#F5F3FF)"}}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{background:accent+"20"}}>🤖</div>
        <div><div className="text-sm font-bold" style={{color:B.t1}}>AI-ассистент Oborotka</div><div className="text-[10px]" style={{color:B.t3}}>Знаю всё о вашем факторинге, сделках и документах</div></div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {aiMessages.map((m,i)=><div key={i}>
          <div className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
            <div className={`max-w-[80%]`}>
              {m.from==="ai"&&<div className="flex items-center gap-1.5 mb-1 ml-1"><span className="text-sm">🤖</span><span className="text-[10px] font-medium" style={{color:B.t3}}>AI-ассистент</span></div>}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.from==="user"?"rounded-br-md text-white":"rounded-bl-md"}`} style={m.from==="user"?{background:accent}:{background:"linear-gradient(135deg,#F8FAFC,#F1F5F9)",color:B.t1}}>
                {m.text}
              </div>
              {m.from==="ai"&&i>0&&<button onClick={()=>{setNewDesc(aiMessages[i-1]?.text||"");setNewSubject("Вопрос из AI-чата");setShowNew(true);setMode("tickets")}} className="text-[10px] mt-1 ml-1 underline" style={{color:B.t3}}>Не помогло? Создать обращение</button>}
            </div>
          </div>
          {/* Quick questions after first AI message */}
          {m.from==="ai"&&i===0&&<div className="flex flex-wrap gap-1.5 mt-3 ml-1">{quickQ.map((qq,j)=><button key={j} onClick={()=>{setAiInput(qq);setTimeout(()=>{setAiMessages(p=>[...p,{from:"user",text:qq,time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}]);setAiTyping(true);setTimeout(()=>{setAiTyping(false);setAiMessages(p=>[...p,{from:"ai",text:generateAiResponse(qq),time:new Date().toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}])},800)},50)}} className="px-3 py-1.5 rounded-full text-[10px] font-medium border border-slate-200 hover:border-slate-400 transition-colors" style={{color:accent}}>{qq}</button>)}</div>}
        </div>)}
        {aiTyping&&<div className="flex justify-start"><div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{background:"#F1F5F9"}}><div className="flex gap-1">{[0,1,2].map(i=><div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:B.t3,animationDelay:`${i*0.2}s`}}/>)}</div></div></div>}
        <div ref={aiEndRef}/>
      </div>
      <div className="p-3 border-t border-slate-100 flex gap-2 shrink-0">
        <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAi()} placeholder="Спросите что угодно..." className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2" style={{"--tw-ring-color":accent+"40"}}/>
        <button onClick={sendAi} className="p-2.5 rounded-xl text-white" style={{background:accent}}><Send size={16}/></button>
      </div>
    </Card>

    :/* ═══ TICKETS MODE ═══ */
    <div className="flex gap-5" style={{minHeight:"70vh"}}>
      <div className="w-72 shrink-0 flex flex-col">
        <Btn className="w-full mb-3" icon={Plus} onClick={()=>{setShowNew(true);setActiveTicket(null)}}>Новое обращение</Btn>
        <div className="flex gap-1 mb-3">{[["open","Открытые"],["resolved","Решённые"],["all","Все"]].map(([v,l])=><button key={v} onClick={()=>setFilter(v)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:accent}:undefined}>{l}</button>)}</div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.length===0&&<div className="text-center py-8 text-xs" style={{color:B.t3}}>Нет обращений</div>}
          {filtered.map(t=>{const sc=statusCfg[t.status]||statusCfg.new;const isAct=activeTicket===t.id;return <div key={t.id} onClick={()=>{setActiveTicket(t.id);setShowNew(false);setTickets(p=>p.map(x=>x.id===t.id?{...x,unread:false}:x))}} className={`rounded-xl border p-3 cursor-pointer transition-all ${isAct?"shadow-md":"hover:shadow-sm"}`} style={{borderColor:isAct?accent:B.border,borderLeftWidth:3,borderLeftColor:sc.c,background:isAct?accent+"08":"white"}}>
            <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold" style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>#{t.id}</span>{t.unread&&<span className="w-2 h-2 rounded-full" style={{background:B.red}}/>}</div>
            <div className="text-xs font-semibold truncate mb-1" style={{color:B.t1}}>{t.subject}</div>
            <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{background:sc.bg,color:sc.c}}>{sc.l}</span><span className="text-[10px]" style={{color:B.t3}}>{t.created.split(" ")[0]}</span></div>
          </div>})}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {showNew?<Card className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 shrink-0" style={{background:"#FAFBFC"}}><h3 className="font-bold text-sm" style={{color:B.t1}}>Новое обращение</h3></div>
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Тема *</label><input value={newSubject} onChange={e=>setNewSubject(e.target.value)} placeholder="Кратко опишите вопрос" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Категория</label><select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"><option value="">Выберите...</option>{SUPPORT_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Привязка к уступке</label><select value={newDeal} onChange={e=>setNewDeal(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"><option value="">Не привязано</option>{CR_DEALS.map(d=><option key={d.id} value={d.id}>{d.id} · {BUYERS.find(b=>b.id===d.buyerId)?.name} · {fmtByn(d.amount)}</option>)}</select></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Описание *</label><textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} rows={4} placeholder="Опишите подробно..." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"/></div>
            <Btn icon={Send} onClick={createTicket} disabled={!newSubject.trim()||!newDesc.trim()} style={{background:accent}}>Отправить</Btn>
          </div>
        </Card>

        :active?<Card className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100 shrink-0 flex items-center justify-between" style={{background:"#FAFBFC"}}>
            <div><div className="flex items-center gap-2"><span className="text-xs font-bold" style={{color:accent,fontFamily:"'JetBrains Mono',monospace"}}>#{active.id}</span><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{background:(statusCfg[active.status]||statusCfg.new).bg,color:(statusCfg[active.status]||statusCfg.new).c}}>{(statusCfg[active.status]||statusCfg.new).l}</span></div><div className="text-sm font-semibold mt-0.5" style={{color:B.t1}}>{active.subject}</div></div>
            {active.status!=="resolved"&&<Btn size="sm" variant="secondary" icon={CheckCircle} onClick={()=>{setTickets(p=>p.map(t=>t.id===active.id?{...t,status:"resolved"}:t));setToast({msg:"Решено",type:"success"})}}>Решено</Btn>}
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {active.messages.map((m,i)=><div key={i} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}><div className="max-w-[75%]">
              {m.from==="support"&&<div className="text-[10px] font-medium mb-1 ml-1" style={{color:B.t3}}>{m.name||"Поддержка"}</div>}
              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from==="user"?"rounded-br-md text-white":"rounded-bl-md bg-slate-100"}`} style={m.from==="user"?{background:accent}:{color:B.t1}}>{m.text}</div>
              <div className={`text-[10px] mt-1 ${m.from==="user"?"text-right mr-1":"ml-1"}`} style={{color:B.t3}}>{m.date} {m.time}</div>
            </div></div>)}
            <div ref={msgEndRef}/>
          </div>
          {active.status!=="resolved"?<div className="p-3 border-t border-slate-100 flex gap-2 shrink-0">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Сообщение..." className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2" style={{"--tw-ring-color":accent+"40"}}/>
            <button onClick={sendMsg} className="p-2.5 rounded-xl text-white" style={{background:accent}}><Send size={16}/></button>
          </div>:<div className="p-3 border-t border-slate-100 text-center shrink-0"><span className="text-xs" style={{color:B.green}}>Решено ✓</span><button onClick={()=>setTickets(p=>p.map(t=>t.id===active.id?{...t,status:"waiting"}:t))} className="text-xs ml-3 underline" style={{color:accent}}>Открыть заново</button></div>}
        </Card>

        :<Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-8"><div className="text-center mb-6"><div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{background:accent+"15"}}><MessageSquare size={28} style={{color:accent}}/></div><h3 className="text-lg font-bold" style={{color:B.t1}}>Чем помочь?</h3><p className="text-xs mt-1" style={{color:B.t3}}>Выберите обращение или создайте новое</p></div>
            <div className="max-w-lg mx-auto"><h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{color:B.t3}}>Частые вопросы</h4>
              <div className="space-y-2">{[{q:"Как рассчитывается дисконт?",a:"Формула: сумма × (годовая ставка / 365) × количество дней. Например: 100 000 BYN × (25%/365) × 60 дней = 4 110 BYN. Ставка индивидуальна для каждого покупателя."},{q:"Сколько дней занимает финансирование?",a:"До 3 рабочих дней после подписания допсоглашения ЭЦП. Деньги поступают на ваш расчётный счёт за вычетом дисконта."},{q:"Что происходит при просрочке покупателя?",a:"У вас безрегрессный факторинг — риск неоплаты полностью на банке. Вам НЕ нужно возвращать полученное финансирование. Банк самостоятельно работает с должником."},{q:"Как добавить нового покупателя?",a:"Перейдите в Пре-скоринг → введите УНП покупателя → система автоматически проверит компанию. Если результат положительный — отправьте приглашение. Окончательное решение принимает банк."},{q:"Какие документы нужны для уступки?",a:"ТТН (для товаров) или Акт выполненных работ (для услуг) + ЭСЧФ (электронный счёт-фактура). Допсоглашение формируется автоматически платформой."}].map((f,i)=><div key={i} className="rounded-xl border border-slate-200 overflow-hidden transition-colors">
                <button className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50" onClick={()=>setExpandedFaq(expandedFaq===i?null:i)}><span className="text-xs font-semibold" style={{color:B.t1}}>{f.q}</span>{expandedFaq===i?<ChevronUp size={14} style={{color:B.t3}}/>:<ChevronDown size={14} style={{color:B.t3}}/>}</button>
                {expandedFaq===i&&<div className="px-3 pb-3 text-xs leading-relaxed" style={{color:B.t2}}>{f.a}</div>}
              </div>)}</div>
            </div>
          </div>
        </Card>}
      </div>
    </div>}
  </div>;
};

const GlobalSearch = ({open,onClose,setActive}) => {
  const [q,setQ]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>{if(open){setQ("");setTimeout(()=>inputRef.current?.focus(),100)}},[open]);
  const allItems=useMemo(()=>[
    ...BUYERS.map(b=>({label:b.name,sub:`УНП ${b.unp}`,page:"cr-buyers",icon:Users})),
    ...CR_DEALS.map(d=>({label:d.id,sub:`${fmtByn(d.amount)} — ${BUYERS.find(b=>b.id===d.buyerId)?.name||""}`,page:"cr-deals",icon:FileText})),
    ...DB_DEALS.map(d=>({label:d.id,sub:`${fmtByn(d.amount)} — ${SUPPLIERS.find(s=>s.id===d.supplierId)?.name||""}`,page:"db-supplies",icon:FileText})),
    ...CR_NAV.map(n=>({label:n.label,sub:"Кредитор",page:n.id,icon:n.icon})),
    ...DB_NAV.map(n=>({label:n.label,sub:"Должник",page:n.id,icon:n.icon})),
  ],[]);
  const results = q.length>0?allItems.filter(it=>it.label.toLowerCase().includes(q.toLowerCase())||it.sub.toLowerCase().includes(q.toLowerCase())).slice(0,8):[];
  if(!open) return null;
  return <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" style={{background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}} onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100"><Search size={18} className="text-slate-400 shrink-0"/><input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Поиск по уступкам, покупателям, страницам..." className="flex-1 text-sm outline-none placeholder:text-slate-400"/><kbd className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-400 font-mono">ESC</kbd></div>
      {results.length>0&&<div className="max-h-[320px] overflow-y-auto py-2">{results.map((r,i)=><button key={i} onClick={()=>{setActive(r.page);onClose()}} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors text-left"><r.icon size={16} className="text-slate-400 shrink-0"/><div className="min-w-0 flex-1"><div className="text-sm font-medium truncate" style={{color:B.t1}}>{r.label}</div><div className="text-xs truncate" style={{color:B.t3}}>{r.sub}</div></div><ChevronRight size={14} className="text-slate-300 shrink-0"/></button>)}</div>}
      {q.length>0&&results.length===0&&<div className="px-5 py-8 text-center text-sm" style={{color:B.t3}}>Ничего не найдено</div>}
      {q.length===0&&<div className="px-5 py-6 text-center text-xs" style={{color:B.t3}}>Поиск по покупателям, уступкам и страницам</div>}
    </div>
  </div>;
};

const NotificationCenter = ({open,onClose,ctx}) => {
  const [read,setRead]=useState([]);
  if(!open) return null;
  const filtered = NOTIFICATIONS.filter(n=>n.ctx===ctx||n.ctx==="both");
  return <div className="fixed inset-0 z-[55]" onClick={onClose}>
    <div className="absolute top-14 right-8 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100"><h3 className="font-semibold text-sm" style={{color:B.t1}}>Уведомления</h3><button onClick={()=>setRead(filtered.map(n=>n.id))} className="text-xs font-medium" style={{color:B.accent}}>Прочитать все</button></div>
      <div className="max-h-[400px] overflow-y-auto">{filtered.map(n=><div key={n.id} onClick={()=>setRead(p=>[...p,n.id])} className={`flex gap-3 px-5 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${read.includes(n.id)?"opacity-60":""}`}>
        <div className="mt-0.5 shrink-0">{n.type==="success"?<CheckCircle size={16} style={{color:B.green}}/>:n.type==="warning"?<AlertCircle size={16} style={{color:B.yellow}}/>:<Info size={16} style={{color:B.accent}}/>}</div>
        <div className="min-w-0 flex-1"><div className="text-xs leading-relaxed" style={{color:B.t1}}>{n.text}</div><div className="text-xs mt-0.5" style={{color:B.t3}}>{n.time}</div></div>
        {!read.includes(n.id)&&<div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{background:ctx==="creditor"?B.accent:B.purple}}/>}
      </div>)}</div>
    </div>
  </div>;
};

// ═══ CREDITOR: PRE-SCORING (full) ════════════════════════
const CrScoring = ({setActive}) => {
  const [unp,setUnp]=useState("");const [loading,setLoading]=useState(false);const [step,setStep]=useState(0);const [result,setResult]=useState(null);const [toast,setToast]=useState(null);const [inviteSent,setInviteSent]=useState(false);const [inviteEmail,setInviteEmail]=useState("");const [showEmailInput,setShowEmailInput]=useState(false);const inputRef=useRef(null);
  const steps=["Проверяем ЕГРЮЛ...","Запрос в БКИ...","Проверяем Картотеку...","Анализируем суды...","Формируем решение..."];
  const runScoring=()=>{if(!unp.trim()||unp.length<9)return;setLoading(true);setResult(null);setInviteSent(false);let s=0;const iv=setInterval(()=>{s++;setStep(s);if(s>=steps.length){clearInterval(iv);setTimeout(()=>{const existing=BUYERS.find(b=>b.unp===unp);if(existing){setResult({status:existing.status,company:existing.name,limit:existing.limit,used:existing.used,available:existing.available,maxTerm:existing.maxTerm,bankClient:existing.bankClient,time:"1.4",reasons:existing.status==="red"?["Компания моложе 1 года","Отрицательная кредитная история"]:[]});}else{const r=Math.random();const name=getCompanyName(unp);setResult(r>0.5?{status:"green",company:name,limit:120000,used:0,available:120000,maxTerm:60,bankClient:false,time:"1.6",reasons:[]}:r>0.2?{status:"yellow",company:name,limit:50000,used:0,available:50000,maxTerm:30,bankClient:false,time:"2.1",reasons:[]}:{status:"red",company:name,limit:0,used:0,available:0,maxTerm:0,bankClient:false,time:"0.9",reasons:["Нет данных в БКИ","Высокая долговая нагрузка"]});}setLoading(false);},400);}},350);};

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Пре-скоринг покупателя" subtitle="Мгновенная проверка кредитоспособности по УНП"/>
    <Card className="p-8 mb-6"><div className="max-w-xl mx-auto text-center"><Zap size={32} style={{color:B.accent}} className="mx-auto mb-3"/><h2 className="text-lg font-bold" style={{color:B.t1}}>Проверьте покупателя за секунды</h2><p className="text-sm mt-1" style={{color:B.t2}}>Введите УНП для автоматической проверки по 5 источникам данных</p>
      <div className="flex gap-3 mt-4 mb-2"><input ref={inputRef} value={unp} onChange={e=>setUnp(e.target.value.replace(/\D/g,"").slice(0,9))} placeholder="Введите 9-значный УНП" maxLength={9} className="flex-1 px-5 py-4 text-xl text-center rounded-2xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400" style={{fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.15em"}} onKeyDown={e=>e.key==="Enter"&&runScoring()}/><Btn size="lg" onClick={runScoring} disabled={loading||unp.length<9} icon={loading?Loader2:Zap}>Проверить</Btn></div>
      <div className="text-xs" style={{color:B.t3}}>Попробуйте: 190456789, 790123456 или любой 9-значный номер</div>
    </div></Card>

    {loading&&<Card className="p-6 mb-6"><div className="max-w-md mx-auto"><div className="flex items-center gap-3 mb-4"><Loader2 size={20} className="animate-spin" style={{color:B.accent}}/><span className="font-medium text-sm" style={{color:B.t1}}>Анализируем данные...</span></div>
      <div className="h-2 rounded-full bg-slate-100 mb-4 overflow-hidden"><div className="h-full rounded-full transition-all duration-300" style={{width:`${(step/steps.length)*100}%`,background:B.accent}}/></div>
      <div className="space-y-2">{steps.map((s,i)=><div key={i} className={`flex items-center gap-2 text-sm ${i<=step?"opacity-100":"opacity-30"}`}>{i<step?<CheckCircle size={14} style={{color:B.green}}/>:i===step?<Loader2 size={14} className="animate-spin" style={{color:B.accent}}/>:<div className="w-3.5 h-3.5 rounded-full border border-slate-200"/>}<span style={{color:i<=step?B.t1:B.t3}}>{s}</span></div>)}</div>
    </div></Card>}

    {result&&<Card className="mb-6 overflow-hidden"><div className="h-1.5" style={{background:result.status==="green"?B.green:result.status==="yellow"?B.yellow:B.red}}/><div className="p-6">
      <div className="flex items-start justify-between mb-4"><div><div className="flex items-center gap-3 mb-1"><h3 className="font-bold text-lg" style={{color:B.t1}}>{result.company}</h3><span className="inline-flex items-center gap-1 py-1 px-3 text-sm rounded-full font-medium" style={{background:result.status==="green"?B.greenL:result.status==="red"?B.redL:B.yellowL,color:result.status==="green"?B.green:result.status==="red"?B.red:B.yellow}}><span className="w-1.5 h-1.5 rounded-full" style={{background:result.status==="green"?B.green:result.status==="red"?B.red:B.yellow}}/>{result.status==="green"?"Предв. одобрен":result.status==="red"?"Отказ":"На проверке"}</span>{result.bankClient&&<span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{background:B.accentL,color:B.accent}}><Shield size={10} className="inline mr-1"/>Клиент банка</span>}</div><span className="text-xs" style={{color:B.t3,fontFamily:"'JetBrains Mono',monospace"}}>УНП {unp} · Скоринг за {result.time} сек</span></div></div>

      {result.status==="green"&&<><div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{background:B.accentL}}><Info size={14} style={{color:B.accent}} className="shrink-0 mt-0.5"/><div className="text-xs" style={{color:B.t2}}>Это <strong>предварительный</strong> результат автоматического скоринга. Окончательное решение о лимите и условиях принимается банком после полного анализа.</div></div><div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="rounded-xl p-4" style={{background:B.greenL}}><div className="text-xs mb-1" style={{color:B.green}}>Предварительный лимит</div><div className="text-2xl font-bold" style={{color:B.green}}>{fmtByn(result.limit)}</div></div>
        <div className="rounded-xl p-4 bg-slate-50"><div className="text-xs mb-1" style={{color:B.t3}}>Использовано</div><div className="text-2xl font-bold" style={{color:B.t1}}>{fmtByn(result.used)}</div></div>
        <div className="rounded-xl p-4 bg-slate-50"><div className="text-xs mb-1" style={{color:B.t3}}>Доступно</div><div className="text-2xl font-bold" style={{color:B.accent}}>{fmtByn(result.available)}</div></div>
        <div className="rounded-xl p-4 bg-slate-50"><div className="text-xs mb-1" style={{color:B.t3}}>Макс. срок</div><div className="text-2xl font-bold" style={{color:B.t1}}>{result.maxTerm} дн.</div></div>
      </div></>}
      {result.status==="yellow"&&<div className="grid grid-cols-2 gap-4 mb-5"><div className="rounded-xl p-4" style={{background:B.yellowL}}><div className="text-xs mb-1" style={{color:B.yellow}}>Предварительный лимит</div><div className="text-2xl font-bold" style={{color:B.yellow}}>{fmtByn(result.limit)}</div></div><div className="rounded-xl p-4 bg-slate-50"><div className="text-xs mb-1" style={{color:B.t3}}>Ссылка для регистрации</div><div className="text-sm font-mono mt-1 break-all" style={{color:B.accent}}>app.oborotka.by/register/{unp}</div></div></div>}
      {result.status==="red"&&<div className="rounded-xl p-4 mb-5" style={{background:B.redL}}><div className="text-sm font-medium mb-2" style={{color:B.red}}>Причины отказа:</div>{result.reasons.map((r,i)=><div key={i} className="flex items-center gap-2 text-sm" style={{color:B.red}}><XCircle size={14}/>{r}</div>)}<div className="mt-3 pt-3 border-t border-red-200 text-sm" style={{color:B.t2}}>Рекомендация: работа по предоплате</div></div>}

      <div className="flex flex-wrap gap-3">

        {(result.status==="green"||result.status==="yellow")&&!inviteSent&&!showEmailInput&&<Btn icon={Mail} onClick={()=>setShowEmailInput(true)}>Отправить приглашение на e-mail</Btn>}
        {showEmailInput&&!inviteSent&&<div className="flex items-center gap-2"><input value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} placeholder="email@company.by" type="email" className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-200"/><Btn icon={Send} disabled={!inviteEmail.includes("@")} onClick={()=>{setInviteSent(true);setShowEmailInput(false);setToast({msg:`Приглашение отправлено на ${inviteEmail}`,type:"success"})}}>Отправить</Btn><button onClick={()=>setShowEmailInput(false)} className="p-1.5 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>}
        {inviteSent&&<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium" style={{background:B.greenL,color:B.green}}><CheckCircle size={15}/>Отправлено на {inviteEmail}</span>}
        <Btn variant="secondary" icon={RefreshCw} onClick={()=>{setResult(null);setUnp("");setInviteSent(false);setInviteEmail("");setShowEmailInput(false);inputRef.current?.focus()}}>Новая проверка</Btn>
      </div>

      {/* Link + letter — always visible for green & yellow */}
      {(result.status==="green"||result.status==="yellow")&&<div className="mt-4 rounded-xl p-4 border border-slate-200 bg-slate-50">
        <div className="text-xs font-medium mb-2" style={{color:B.t3}}>Ссылка для регистрации контрагента</div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-mono truncate" style={{color:B.accent}}>https://app.oborotka.by/register/{unp}</div>
          <Btn size="sm" variant="secondary" icon={ExternalLink} onClick={()=>{copyText(`https://app.oborotka.by/register/${unp}`);setToast({msg:"Ссылка скопирована",type:"success"})}}>Скопировать ссылку</Btn>
        </div>
        <div className="text-xs font-medium mb-2" style={{color:B.t3}}>Готовый текст приглашения</div>
        <div className="rounded-xl p-4 mb-3 text-sm leading-relaxed whitespace-pre-line bg-white border border-slate-200" style={{color:B.t1}} id="invite-letter">{`Уважаемые коллеги!

Компания ${COMPANY.name} приглашает ${result.company} присоединиться к факторинговой платформе Oborotka.by.

Что это даёт вашей компании:
— Отсрочка платежа до ${result.maxTerm} дней без дополнительных расходов
— Ваш предварительный лимит: ${fmtByn(result.limit)}
— Все документы подписываются через ЭЦП — без бумаги и курьеров
— Банк-партнёр: ЗАО «Нео Банк Азия»

Для регистрации перейдите по ссылке:
https://app.oborotka.by/register/${unp}

С уважением,
${COMPANY.director}
${COMPANY.name}
${COMPANY.phone} · ${COMPANY.email}`}</div>
        <Btn size="sm" icon={Download} onClick={()=>{const text=document.getElementById("invite-letter")?.textContent||"";copyText(text);setToast({msg:"Текст письма скопирован — вставьте в мессенджер или email",type:"success"})}}>Скопировать текст письма</Btn>
      </div>}
    </div></Card>}

    <Card className="p-6"><h3 className="font-semibold text-sm mb-4" style={{color:B.t1}}><InfoTooltip text="Результаты предварительных автоматических проверок. Окончательное решение принимается банком">История проверок</InfoTooltip></h3><table className="w-full text-sm"><thead><tr className="text-xs text-left" style={{color:B.t3}}><th className="pb-3 font-medium">Дата</th><th className="pb-3 font-medium">УНП</th><th className="pb-3 font-medium">Компания</th><th className="pb-3 font-medium">Результат</th><th className="pb-3 font-medium text-right">Лимит</th></tr></thead><tbody>{SCORING_HISTORY.map((h,i)=><TableRow key={i}><td className="py-2.5" style={{color:B.t2}}>{h.date}</td><td className="py-2.5" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:B.t1}}>{h.unp}</td><td className="py-2.5 font-medium" style={{color:B.t1}}>{h.company}</td><td className="py-2.5"><StatusBadge status={h.result}/></td><td className="py-2.5 text-right" style={{color:B.t1}}>{h.limit>0?fmtByn(h.limit):"—"}</td></TableRow>)}</tbody></table></Card>
  </div>;
};

// ═══ CREDITOR: MASS SCORING (full) ═══════════════════════
const CrMassScoring = () => {
  const [unpRows,setUnpRows]=useState([""]);const [results,setResults]=useState([]);const [loading,setLoading]=useState(false);const [toast,setToast]=useState(null);const [expandedResult,setExpandedResult]=useState(null);const [invitedUnps,setInvitedUnps]=useState(new Set());const [massEmailInput,setMassEmailInput]=useState({});const [massEmails,setMassEmails]=useState({});const UNP_MAX=9;
  const lookupCompany=(u)=>u.length<UNP_MAX?null:getCompanyName(u);
  const handleRowChange=(i,val)=>{const clean=val.replace(/\D/g,"").slice(0,UNP_MAX);const next=[...unpRows];next[i]=clean;setUnpRows(next)};
  const addRow=()=>setUnpRows(p=>[...p,""]);
  const removeRow=i=>setUnpRows(p=>p.length>1?p.filter((_,idx)=>idx!==i):[""]);
  const handlePaste=e=>{e.preventDefault();const pasted=e.clipboardData.getData("text").split(/[\n,;\s]+/).map(s=>s.replace(/\D/g,"").slice(0,UNP_MAX)).filter(s=>s.length>0);if(pasted.length>0)setUnpRows(p=>{const existing=p.filter(r=>r.length>0);return[...existing,...pasted].slice(0,50)})};
  const validUnps=unpRows.filter(u=>u.length===UNP_MAX);
  const runMass=()=>{if(!validUnps.length)return;setLoading(true);setTimeout(()=>{const res=validUnps.map(u=>{const ex=BUYERS.find(b=>b.unp===u);if(ex)return{unp:u,company:ex.name,status:ex.status,limit:ex.limit};const r=Math.random();return{unp:u,company:getCompanyName(u),status:r>0.5?"green":r>0.2?"yellow":"red",limit:r>0.5?Math.floor(50+Math.random()*200)*1000:r>0.2?Math.floor(20+Math.random()*80)*1000:0}});setResults(res);setLoading(false)},2500)};
  const counts={green:results.filter(r=>r.status==="green").length,yellow:results.filter(r=>r.status==="yellow").length,red:results.filter(r=>r.status==="red").length};

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Массовый пре-скоринг" subtitle="Проверьте всю базу покупателей за один раз"/>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="p-5"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm" style={{color:B.t1}}>Список УНП</h3><span className="text-xs px-2 py-0.5 rounded-lg bg-slate-50" style={{color:B.t3}}>{validUnps.length} из {unpRows.filter(u=>u.length>0).length} готовы</span></div>
        <div className="rounded-xl border border-slate-200 overflow-hidden mb-3"><div className="flex items-center gap-3 px-3 py-2 text-xs font-medium border-b border-slate-100" style={{background:"#FAFBFC",color:B.t3}}><span className="w-5 text-center">#</span><span className="w-[110px]">УНП (9 цифр)</span><span className="flex-1">Организация</span><span className="w-6"/></div>
          <div className="max-h-[360px] overflow-y-auto">{unpRows.map((u,i)=>{const company=lookupCompany(u);const isValid=u.length===UNP_MAX;const isPartial=u.length>0&&u.length<UNP_MAX;return <div key={i} className="flex items-center gap-3 px-3 py-1.5 border-b border-slate-50 hover:bg-slate-50/50 group">
            <span className="w-5 text-center text-xs" style={{color:B.t3}}>{i+1}</span>
            <div className="w-[110px] relative"><input value={u} onChange={e=>handleRowChange(i,e.target.value)} onPaste={i===unpRows.length-1?handlePaste:undefined} onKeyDown={e=>{if(e.key==="Enter"&&u.length>0){addRow();setTimeout(()=>{const inputs=document.querySelectorAll('[data-unp-input]');inputs[inputs.length-1]?.focus()},50)}}} data-unp-input maxLength={UNP_MAX} placeholder="000000000" className={`w-full px-2 py-1.5 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 ${isValid?"border-green-300 bg-green-50/50":isPartial?"border-amber-300 bg-amber-50/30":"border-slate-200"}`} style={{fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.05em"}}/>{isValid&&<CheckCircle size={12} className="absolute right-2 top-1/2 -translate-y-1/2" style={{color:B.green}}/>}</div>
            <div className="flex-1 min-w-0 truncate text-xs" style={{color:company?B.t1:B.t3}}>{isValid&&company?<span className="font-medium">{company}</span>:isPartial?<span className="italic" style={{color:B.t3}}>Введите {UNP_MAX-u.length} цифр...</span>:<span style={{color:B.t3}}>—</span>}</div>
            <button onClick={()=>removeRow(i)} className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"><X size={13} className="text-slate-400 hover:text-red-500"/></button>
          </div>})}</div></div>
        <div className="flex items-center justify-between mb-4"><button onClick={addRow} className="flex items-center gap-1.5 text-xs font-medium hover:underline" style={{color:B.accent}}><Plus size={13}/>Добавить строку</button><span className="text-xs" style={{color:B.t3}}>макс. 9 цифр · Enter → след. строка</span></div>
        <div className="flex gap-3"><Btn onClick={runMass} disabled={loading||validUnps.length===0} icon={loading?Loader2:Zap}>{loading?"Скорим...":`Скорить ${validUnps.length>0?`(${validUnps.length})`:""}`}</Btn><Btn variant="secondary" icon={Upload} onClick={()=>setUnpRows(["190456789","191234567","100987654","192345678","790123456","193456789","194567890"])}>Загрузить CSV</Btn></div>
      </Card>
      <div>{results.length>0&&<><div className="grid grid-cols-3 gap-3 mb-4">{[["Предв. одобрены",counts.green,B.green,B.greenL],["Предварит.",counts.yellow,B.yellow,B.yellowL],["Отказ",counts.red,B.red,B.redL]].map(([l,v,c],i)=><Card key={i} className="p-4 text-center"><div className="text-2xl font-bold" style={{color:c}}>{v}</div><div className="text-xs" style={{color:B.t3}}>{l}</div></Card>)}</div>
        <Card className="p-4"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm" style={{color:B.t1}}>Результаты</h3><Btn variant="secondary" size="sm" icon={Download} onClick={()=>setToast({msg:"Экспорт в Excel (mock)",type:"info"})}>Экспорт</Btn></div><table className="w-full text-sm"><thead><tr className="text-xs" style={{color:B.t3}}><th className="pb-2 text-left font-medium">УНП</th><th className="pb-2 text-left font-medium">Компания</th><th className="pb-2 font-medium">Статус</th><th className="pb-2 text-right font-medium">Лимит</th><th className="pb-2 text-center font-medium">Действие</th></tr></thead><tbody>{results.map((r,i)=><Fragment key={i}><tr onClick={()=>setExpandedResult(expandedResult===i?null:i)} className="border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors"><td className="py-2" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12}}><div className="flex items-center gap-1">{expandedResult===i?<ChevronDown size={10}/>:<ChevronRight size={10}/>}{r.unp}</div></td><td className="py-2 font-medium" style={{color:B.t1}}>{r.company}</td><td className="py-2 text-center"><StatusBadge status={r.status}/></td><td className="py-2 text-right">{r.limit>0?fmtByn(r.limit):"—"}</td><td className="py-2 text-center">{r.status!=="red"?(invitedUnps.has(r.unp)?<span className="text-[10px]" style={{color:B.green}}>Отправлено ✓</span>:<span className="text-xs font-medium" style={{color:B.accent}}>Пригласить ↓</span>):<span className="text-xs" style={{color:B.t3}}>Отказ</span>}</td></tr>
          {expandedResult===i&&<tr><td colSpan={5} className="px-4 py-3 bg-slate-50/50 border-b border-slate-200">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="rounded-lg p-2.5 bg-white border border-slate-100"><div className="text-[10px]" style={{color:B.t3}}>Компания</div><div className="text-xs font-semibold" style={{color:B.t1}}>{r.company}</div></div>
              <div className="rounded-lg p-2.5 bg-white border border-slate-100"><div className="text-[10px]" style={{color:B.t3}}>{r.status==="green"?"Предварительный лимит":r.status==="yellow"?"Предварительный лимит":"Результат"}</div><div className="text-xs font-semibold" style={{color:r.status==="green"?B.green:r.status==="yellow"?B.yellow:B.red}}>{r.limit>0?fmtByn(r.limit):"Отклонён"}</div></div>
              <div className="rounded-lg p-2.5 bg-white border border-slate-100"><div className="text-[10px]" style={{color:B.t3}}>УНП</div><div className="text-xs font-medium" style={{fontFamily:"'JetBrains Mono',monospace",color:B.t1}}>{r.unp}</div></div>
            </div>
            {r.status!=="red"&&<div>
              <div className="rounded-lg border border-slate-200 p-3 mb-3 bg-white">
                <div className="flex items-center gap-2 mb-3">{!massEmails[r.unp]?<><input placeholder="email@company.by" className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-200" onChange={e=>setMassEmailInput(p=>({...p,[r.unp]:e.target.value}))} value={massEmailInput[r.unp]||""}/><Btn size="sm" icon={Mail} disabled={!(massEmailInput[r.unp]||"").includes("@")} onClick={e=>{e.stopPropagation();setMassEmails(p=>({...p,[r.unp]:massEmailInput[r.unp]}));setToast({msg:`Приглашение отправлено на ${massEmailInput[r.unp]}`,type:"success"})}}>Отправить на e-mail</Btn></>:<span className="text-xs" style={{color:B.green}}>✓ Отправлено на {massEmails[r.unp]}</span>}</div>
                <div className="text-[10px] font-medium mb-2" style={{color:B.t3}}>Ссылка для регистрации</div>
                <div className="flex items-center gap-2 mb-2"><div className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono truncate" style={{color:B.accent}}>https://app.oborotka.by/register/{r.unp}</div><Btn size="sm" variant="secondary" icon={ExternalLink} onClick={e=>{e.stopPropagation();copyText(`https://app.oborotka.by/register/${r.unp}`);setToast({msg:"Ссылка скопирована",type:"success"})}}>Скопировать</Btn></div>
                <div className="text-[10px] font-medium mb-1.5" style={{color:B.t3}}>Текст приглашения</div>
                <div className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-2 whitespace-pre-line" style={{color:B.t2}}>{`Добрый день!\n\nПриглашаем ${r.company} на факторинговую платформу Oborotka.by.\n${r.status==="green"?`Вашей компании предварительно одобрен лимит ${fmtByn(r.limit)}.`:`Предварительный лимит: ${fmtByn(r.limit)}. Будет уточнён после регистрации.`}\n\nРегистрация: https://app.oborotka.by/register/${r.unp}\n\nС уважением, ${COMPANY.name}`}</div>
                <Btn size="sm" variant="secondary" icon={ExternalLink} onClick={e=>{e.stopPropagation();const text=`Добрый день!\n\nПриглашаем ${r.company} на факторинговую платформу Oborotka.by.\n${r.status==="green"?`Вашей компании предварительно одобрен лимит ${fmtByn(r.limit)}.`:`Предварительный лимит: ${fmtByn(r.limit)}.`}\n\nРегистрация: https://app.oborotka.by/register/${r.unp}\n\nС уважением, ${COMPANY.name}`;copyText(text);setToast({msg:"Текст письма скопирован",type:"success"})}}>Скопировать текст письма</Btn>
              </div>
            </div>}
            {r.status==="red"&&<div className="rounded-lg p-3" style={{background:B.redL}}><div className="flex items-start gap-2"><AlertTriangle size={14} style={{color:B.red}} className="shrink-0 mt-0.5"/><div><div className="text-xs font-semibold" style={{color:B.red}}>Компания не прошла скоринг</div><div className="text-[10px] mt-0.5" style={{color:B.red}}>Рекомендация: работа по предоплате</div></div></div></div>}
          </td></tr>}
          </Fragment>)}</tbody></table></Card></>}
        {results.length===0&&!loading&&<Card className="p-12 text-center"><FileSpreadsheet size={40} className="mx-auto mb-3" style={{color:B.t3}}/><div className="text-sm" style={{color:B.t3}}>Введите УНП слева и нажмите «Скорить все»</div></Card>}
        {loading&&<Card className="p-12 text-center"><Loader2 size={40} className="mx-auto mb-3 animate-spin" style={{color:B.accent}}/><div className="text-sm" style={{color:B.t2}}>Массовый пре-скоринг в процессе...</div></Card>}
      </div>
    </div>
  </div>;
};

// ═══ CREDITOR: DOCUMENTS (full — 3 zones, enhanced UX) ═══
const CrDocuments = ({setActive,setInitialThread,initialViewDoc:initDoc,onClearViewDoc,returnTo,onReturn}) => {
  const [tab,setTab]=useState("all");const [toast,setToast]=useState(null);
  const [datePreset,setDatePreset]=useState("all");const [dateFrom,setDateFrom]=useState("");const [dateTo,setDateTo]=useState("");
  const [buyerFilter,setBuyerFilter]=useState("all");const [docSearch,setDocSearch]=useState("");
  const [viewDoc,setViewDoc]=useState(null);const [signingDoc,setSigningDoc]=useState(null);const [signedDocs,setSignedDocs]=useState(new Set());
  const [groupByDeal,setGroupByDeal]=useState(false);
  const [selectedDocs,setSelectedDocs]=useState(new Set());
  const [statusFilter,setStatusFilter]=useState("all");
  const [groupFilter,setGroupFilter]=useState("all");
  const [emailInput,setEmailInput]=useState("");const [showEmail,setShowEmail]=useState(false);
  useEffect(()=>{if(initDoc&&initDoc.length>0){const doc=allDocs.find(d=>d.name.includes(initDoc)||d.id===initDoc);if(doc)setViewDoc(doc);onClearViewDoc?.()}},[initDoc]);
  const [showUpload,setShowUpload]=useState(false);const [uploadType,setUploadType]=useState("");const [uploadDeal,setUploadDeal]=useState("");const [uploadFile,setUploadFile]=useState(null);const [uploadDesc,setUploadDesc]=useState("");

  const handleSign=(id)=>{setSigningDoc(id);setTimeout(()=>{setSignedDocs(prev=>{const n=new Set(prev);n.add(id);return n});setSigningDoc(null);setToast({msg:"Документ подписан ЭЦП",type:"success"})},1500)};
  const handleBulkSign=()=>{setSigningDoc("bulk");setTimeout(()=>{setSignedDocs(prev=>{const n=new Set(prev);selectedDocs.forEach(id=>n.add(id));return n});setSigningDoc(null);setSelectedDocs(new Set());setToast({msg:`${selectedDocs.size} документов подписано ЭЦП`,type:"success"})},1500)};

  // Build unified doc list: GDs + consents + deal docs
  const gdDocs=BUYERS.filter(b=>b.status==="green").map((b,i)=>
    ({id:`gd-${i+1}`,type:"contract",name:`Генеральный договор факторинга №${i+1}`,buyer:b.name,buyerId:b.id,dealId:`ГД-${i+1}`,date:"2026-01-15",amount:b.limit,ecpStatus:"signed"})
  );
  const consentDocs=[
    {id:"bki-company",type:"consentBki",name:"Согласие на проверку в БКИ",buyer:COMPANY.name,buyerId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed"},
    {id:"oeb-company",type:"consentOeb",name:"Согласие на проверку ОЭБ",buyer:COMPANY.name,buyerId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed"},
    {id:"pd-company",type:"consentPd",name:"Согласие на обработку ПД",buyer:COMPANY.name,buyerId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed"},
  ];
  const contracts=[...gdDocs,...consentDocs];

  const dealDocs=CR_DEALS.flatMap(d=>{const buyer=BUYERS.find(b=>b.id===d.buyerId);const num=d.id.split("-")[2];return[
    {id:`ds-${num}`,type:"supAg",name:d.supAg,buyer:buyer?.name||"",buyerId:d.buyerId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:d.ecpStatus==="pending"?"pending":"signed",term:d.term,discount:d.discount,toReceive:d.toReceive},
    {id:`ttn-${num}`,type:d.docType==="act"?"act":"ttn",name:`${d.docType==="act"?"Акт_ВР":"ТТН"}_${num}.pdf`,buyer:buyer?.name||"",buyerId:d.buyerId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:"signed"},
    {id:`esf-${num}`,type:"esf",name:`ЭСЧФ_${num}.pdf`,buyer:buyer?.name||"",buyerId:d.buyerId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:"signed"},
    {id:`ntf-${num}`,type:"notify",name:`Уведомление_${num}`,buyer:buyer?.name||"",buyerId:d.buyerId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:"signed"},
  ]});

  const reportDocs=[
    {id:"rep-bal-q4",type:"report",name:"Баланс Q4 2025",buyer:"—",buyerId:0,dealId:"Отчётность",date:"2025-12-20",amount:0,ecpStatus:"uploaded"},
    {id:"rep-pl-q4",type:"report",name:"Отчёт о прибылях и убытках Q4 2025",buyer:"—",buyerId:0,dealId:"Отчётность",date:"2025-12-20",amount:0,ecpStatus:"uploaded"},
    {id:"rep-bal-q1",type:"report",name:"Баланс Q1 2026",buyer:"—",buyerId:0,dealId:"Отчётность",date:"2026-03-22",amount:0,ecpStatus:"uploaded"},
    {id:"rep-pl-q1",type:"report",name:"Отчёт о прибылях и убытках Q1 2026",buyer:"—",buyerId:0,dealId:"Отчётность",date:"2026-03-22",amount:0,ecpStatus:"uploaded"},
  ];
  const profileDocs=[
    {id:"profile-v1",type:"profile",name:"Анкета компании (Приложение 12)",buyer:COMPANY.name,buyerId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed",version:1},
    {id:"profile-v2",type:"profile",name:"Анкета компании (актуализация Q1)",buyer:COMPANY.name,buyerId:0,dealId:"Актуализация",date:"2026-03-22",amount:0,ecpStatus:"signed",version:2},
  ];
  const allDocs=[...contracts,...dealDocs,...reportDocs,...profileDocs];
  const getStatus=(doc)=>signedDocs.has(doc.id)?"signed":doc.ecpStatus;

  const typeLabels={contract:"Ген. договор",consent:"Согласие",consentBki:"Согласие БКИ",consentOeb:"Согласие ОЭБ",consentPd:"Согласие ПД",supAg:"Допсоглашение",ttn:"ТТН",act:"Акт ВР",esf:"ЭСЧФ",notify:"Увед. об уступке",report:"Отчётность",profile:"Анкета"};
  const typeIcons={contract:Shield,consent:CheckCircle,consentBki:Search,consentOeb:Shield,consentPd:Users,supAg:Gavel,esf:Receipt,ttn:FileSpreadsheet,act:CheckCircle,notify:Send,report:BarChart,profile:CircleDot};
  const tabs=[{id:"all",label:"Все",count:allDocs.length},{id:"contract",label:"Ген. договоры"},{id:"supAg",label:"Допсоглашения"},{id:"ttn",label:"ТТН"},{id:"esf",label:"ЭСЧФ"},{id:"consentBki",label:"Согласия БКИ"},{id:"consentOeb",label:"Согласия ОЭБ"},{id:"consentPd",label:"Согласия ПД"},{id:"report",label:"Отчётность"},{id:"profile",label:"Анкета"}];
  const pendingCount=allDocs.filter(d=>getStatus(d)==="pending").length;

  const filtered=allDocs.filter(d=>{
    if(docSearch){const q=docSearch.toLowerCase();if(!d.name.toLowerCase().includes(q)&&!d.dealId.toLowerCase().includes(q)&&!d.buyer.toLowerCase().includes(q))return false}
    if(tab!=="all"&&d.type!==tab)return false;
    if(statusFilter==="pending"&&getStatus(d)!=="pending")return false;
    if(statusFilter==="signed"&&getStatus(d)!=="signed")return false;
    if(buyerFilter!=="all"&&d.buyerId!==Number(buyerFilter))return false;
    if(dateFrom&&d.date<dateFrom)return false;if(dateTo&&d.date>dateTo)return false;
    return true;
  });
  const uniqueBuyers=[...new Map(allDocs.map(d=>[d.buyerId,d.buyer])).entries()];
  const toggleDoc=(id)=>setSelectedDocs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
  const toggleAll=()=>{if(selectedDocs.size===filtered.length)setSelectedDocs(new Set());else setSelectedDocs(new Set(filtered.map(d=>d.id)))};

  // Doc card view
  if(viewDoc){const doc=viewDoc;const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <button onClick={()=>{if(returnTo){onReturn?.()}else{setViewDoc(null)}}} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:B.accent}}><ArrowLeft size={16}/>{returnTo?"Назад":"Назад к реестру"}</button>
    <Card className="p-6 mb-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:B.accentL}}><TIcon size={22} style={{color:B.accent}}/></div>
        <div><h1 className="text-xl font-bold" style={{color:B.t1}}>{doc.name}</h1><div className="text-sm mt-1" style={{color:B.t3}}>{typeLabels[doc.type]} · {doc.dealId} · {doc.buyer} · {doc.date}</div></div></div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium" style={{background:st==="signed"?B.greenL:B.yellowL,color:st==="signed"?B.green:B.yellow}}>{st==="signed"?<><Shield size={12}/>Подписан</>:<><Loader2 size={12}/>На подписании</>}</span>
      </div>
    </Card>
    <Card className="p-6 mb-5"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>Превью документа</div><div className="rounded-xl border-2 border-dashed border-slate-200 h-48 flex items-center justify-center" style={{background:"#FAFBFC"}}><div className="text-center"><FileText size={32} className="mx-auto mb-2 text-slate-300"/><div className="text-sm" style={{color:B.t3}}>Превью документа {doc.name}</div><div className="text-xs" style={{color:B.t3}}>PDF Viewer</div></div></div></Card>
    {doc.type==="contract"||doc.type==="supAg"?<Card className="p-5 mb-5"><h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>История подписания</h3><div className="space-y-2">{[{who:"Кредитор — "+COMPANY.director,date:doc.date,ip:"192.168.1.45"},{who:"Банк — ЗАО «Нео Банк Азия»",date:doc.date,ip:"10.0.0.1"},...(doc.type==="contract"?[{who:"Должник — "+doc.buyer,date:doc.date,ip:"172.16.0.12"}]:[])].map((s,i)=><div key={i} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-50"><CheckCircle size={13} style={{color:B.green}}/><span className="font-medium flex-1" style={{color:B.t1}}>{s.who}</span><span style={{color:B.t3}}>{s.date}</span><span style={{color:B.t3,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>IP: {s.ip}</span></div>)}</div></Card>:null}
    <div className="flex flex-wrap gap-2 mb-5">
      {st==="pending"&&<Btn icon={signingDoc===doc.id?Loader2:Pen} disabled={!!signingDoc} onClick={()=>handleSign(doc.id)} style={{background:B.accent}}>{signingDoc===doc.id?"Подписание...":"Подписать ЭЦП"}</Btn>}
      <Btn variant="secondary" icon={Download} onClick={()=>setToast({msg:`${doc.name} скачан`,type:"info"})}>Скачать PDF</Btn>
      <Btn variant="secondary" icon={Download} onClick={()=>setToast({msg:"Отправлено на печать",type:"info"})}>Печать</Btn>
      {!showEmail?<Btn variant="secondary" icon={Mail} onClick={()=>setShowEmail(true)}>Отправить на e-mail</Btn>:<div className="flex items-center gap-2"><input value={emailInput} onChange={e=>setEmailInput(e.target.value)} placeholder="email@company.by" className="px-3 py-2 rounded-xl border border-slate-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-200"/><Btn icon={Send} disabled={!emailInput.includes("@")} onClick={()=>{setShowEmail(false);setToast({msg:`Отправлено на ${emailInput}`,type:"success"});setEmailInput("")}}>Отправить</Btn><button onClick={()=>setShowEmail(false)} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>}
      <Btn variant="secondary" icon={MessageCircle} onClick={()=>{setInitialThread?.(doc.dealId);setActive("cr-messages")}}>Обсудить</Btn>
    </div>
    {(doc.type==="supAg"||doc.type==="ttn"||doc.type==="esf"||doc.type==="notify")&&<Card className="p-5"><h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>Связанные документы по {doc.dealId}</h3><div className="space-y-1.5">{allDocs.filter(rd=>rd.dealId===doc.dealId&&rd.id!==doc.id).map((rd,i)=>{const RI=typeIcons[rd.type]||FileText;return <div key={i} className="flex items-center gap-3 py-2 text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2" onClick={()=>setViewDoc(rd)}><RI size={13} style={{color:B.accent}}/><span className="font-medium flex-1" style={{color:B.t1}}>{rd.name}</span><span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]" style={{color:B.t3}}>{typeLabels[rd.type]}</span><span className="text-[10px]" style={{color:getStatus(rd)==="signed"?B.green:B.yellow}}>{getStatus(rd)==="signed"?"ЭЦП ✓":"На подписании"}</span></div>})}</div></Card>}
  </div>}

  // List view
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Документы" subtitle={`${allDocs.length} документов · Генеральные договоры, допсоглашения, ТТН, ЭСЧФ, согласия, отчётность`}/>

    {pendingCount>0&&<Card className="p-4 mb-5 flex items-center justify-between" style={{background:"#FFF7ED",borderColor:"#FED7AA"}}>
      <div className="flex items-center gap-2"><AlertCircle size={16} style={{color:B.orange}}/><span className="text-sm font-bold" style={{color:B.t1}}>{pendingCount} документ{pendingCount===1?"":"а"} на подписании</span></div>
      <Btn size="sm" icon={Pen} onClick={()=>{const pend=allDocs.filter(d=>getStatus(d)==="pending");setSelectedDocs(new Set(pend.map(d=>d.id)));handleBulkSign()}} style={{background:B.orange}}>Подписать все ({pendingCount})</Btn>
    </Card>}

    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex flex-wrap gap-1.5">{tabs.map(t=>{const cnt=allDocs.filter(d=>t.id==="all"?true:d.type===t.id).length;return <button key={t.id} onClick={()=>setTab(t.id)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${tab===t.id?"text-white":"text-slate-500 bg-slate-50"}`} style={tab===t.id?{background:B.accent}:undefined}>{t.label} ({cnt})</button>})}</div>
      <div className="flex items-center gap-3 ml-auto"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={docSearch} onChange={e=>setDocSearch(e.target.value)} placeholder="Поиск..." className="pl-9 pr-3 py-2 w-56 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"/></div><Btn icon={Upload} onClick={()=>{setShowUpload(true);setUploadType("");setUploadDeal("");setUploadFile(null);setUploadDesc("");window.scrollTo(0,0)}}><InfoTooltip text="Загрузите ТТН, Акт, ЭСЧФ, отчётность или иной документ">Загрузить документ</InfoTooltip></Btn></div>
    </div>
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex gap-1.5">{[["all","Все статусы"],["pending","На подписании"],["signed","Подписаны"]].map(([v,l])=><button key={v} onClick={()=>setStatusFilter(v)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusFilter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={statusFilter===v?{background:B.accent}:undefined}>{l}</button>)}</div>
      <select value={buyerFilter} onChange={e=>setBuyerFilter(e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"><option value="all">Все контрагенты</option>{uniqueBuyers.map(([id,name])=><option key={id} value={id}>{name}</option>)}</select>
      <div className="flex items-center gap-2 ml-auto"><span className="text-xs" style={{color:B.t3}}>Группировка:</span><button onClick={()=>setGroupByDeal(!groupByDeal)} className="relative w-9 h-5 rounded-full transition-colors" style={{background:groupByDeal?B.accent:"#CBD5E1"}}><span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{left:groupByDeal?18:2}}/></button></div>
    </div>

    {selectedDocs.size>0&&<div className="sticky top-0 z-30 bg-white py-3 px-5 mb-3 rounded-xl border shadow-md flex items-center justify-between" style={{borderColor:B.accent}}><span className="text-sm font-medium" style={{color:B.t1}}>Выбрано: {selectedDocs.size} документов</span><div className="flex gap-2"><Btn size="sm" icon={signingDoc==="bulk"?Loader2:Pen} disabled={!!signingDoc} onClick={handleBulkSign}>Подписать ЭЦП</Btn><Btn size="sm" variant="secondary" icon={Download} onClick={()=>setToast({msg:`${selectedDocs.size} документов скачано (ZIP)`,type:"info"})}>Скачать ZIP</Btn><button onClick={()=>setSelectedDocs(new Set())} className="p-1.5 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div></div>}

    {groupByDeal?<><div className="flex gap-2 mb-4">{[["all","Все группы"],["gd","Ген. договоры"],["onboarding","Онбординг"],["deals","Уступки"],["reports","Отчётность"]].map(([v,l])=><button key={v} onClick={()=>setGroupFilter(v)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${groupFilter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={groupFilter===v?{background:B.accent}:undefined}>{l}</button>)}</div>
    <Card className="overflow-hidden"><div className="divide-y divide-slate-100">{Object.entries(filtered.reduce((acc,doc)=>{const k=doc.dealId;(acc[k]=acc[k]||[]).push(doc);return acc},{}))
      .filter(([dealId])=>{if(groupFilter==="all")return true;if(groupFilter==="gd")return dealId.startsWith("ГД");if(groupFilter==="onboarding")return dealId==="Онбординг";if(groupFilter==="deals")return dealId.startsWith("УС-");if(groupFilter==="reports")return dealId==="Отчётность"||dealId==="Актуализация";return true}).map(([dealId,docs])=>{const isOpen=selectedDocs.has("group-"+dealId);return <div key={dealId}>
      <div className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors" onClick={()=>setSelectedDocs(p=>{const n=new Set(p);const k="group-"+dealId;n.has(k)?n.delete(k):n.add(k);return n})}>
        {isOpen?<ChevronDown size={14} style={{color:B.accent}}/>:<ChevronRight size={14} style={{color:B.t3}}/>}
        <span className="text-xs font-bold" style={{color:B.accent,fontFamily:"'JetBrains Mono',monospace"}}>{dealId}</span>
        <span className="text-xs" style={{color:B.t3}}>{docs[0]?.buyer||docs[0]?.supplier||"—"} · {docs.length} док.</span>
        {docs[0]?.amount>0&&<span className="text-xs font-medium" style={{color:B.t1}}>{fmtByn(docs[0].amount)}</span>}
        <div className="ml-auto flex gap-1"><button onClick={e=>{e.stopPropagation();setToast({msg:"Пакет скачан",type:"info"})}} className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100" style={{color:B.accent}}><Download size={11}/>Скачать все</button></div>
      </div>
      {isOpen&&<div className="px-5 pb-3"><div className="ml-5 space-y-1">{docs.map((doc,i)=>{const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);return <div key={i} className="flex items-center gap-3 py-1.5 text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2" onClick={()=>setViewDoc(doc)}>
        <TIcon size={13} style={{color:B.accent}}/><span className="font-medium flex-1" style={{color:B.accent}}>{doc.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]" style={{color:B.t2}}>{typeLabels[doc.type]}</span>
        {st==="signed"?<span className="inline-flex items-center gap-1 text-[10px]" style={{color:B.green}}><Shield size={8}/>ЭЦП</span>:st==="uploaded"?<span className="text-[10px]" style={{color:B.accent}}>Загружен</span>:<span className="text-[10px]" style={{color:B.yellow}}>Ожидает</span>}
        <button onClick={e=>{e.stopPropagation();setToast({msg:"Скачан",type:"info"})}} className="p-1 rounded hover:bg-slate-100"><Download size={11} className="text-slate-400"/></button>
      </div>})}</div></div>}
    </div>})}</div></Card></>

    :<Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-xs text-left border-b border-slate-100" style={{color:B.t3,background:"#FAFBFC"}}><th className="px-3 py-3 w-8"><input type="checkbox" checked={selectedDocs.size===filtered.length&&filtered.length>0} onChange={toggleAll} className="rounded"/></th><th className="px-3 py-3 font-medium">Документ</th><th className="px-3 py-3 font-medium">Тип</th><th className="px-3 py-3 font-medium">Привязка</th><th className="px-3 py-3 font-medium">Контрагент</th><th className="px-3 py-3 font-medium">Дата</th><th className="px-3 py-3 font-medium text-center">Статус</th><th className="px-3 py-3 font-medium text-center">Действия</th></tr></thead>
    <tbody>{filtered.map(doc=>{const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);return <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="px-3 py-2.5"><input type="checkbox" checked={selectedDocs.has(doc.id)} onChange={()=>toggleDoc(doc.id)} className="rounded"/></td>
      <td className="px-3 py-2.5 cursor-pointer" onClick={()=>setViewDoc(doc)}><div className="flex items-center gap-2"><TIcon size={13} style={{color:B.accent}}/><span className="font-medium text-xs hover:underline" style={{color:B.accent}}>{doc.name}</span></div></td>
      <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100" style={{color:B.t2}}>{typeLabels[doc.type]}</span></td>
      <td className="px-3 py-2.5 text-xs" style={{fontFamily:"'JetBrains Mono',monospace",color:B.t2}}>{doc.dealId}</td>
      <td className="px-3 py-2.5 text-xs" style={{color:B.t1}}>{doc.buyer}</td>
      <td className="px-3 py-2.5 text-xs" style={{color:B.t2}}>{doc.date}</td>
      <td className="px-3 py-2.5 text-center">{st==="signed"?<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:B.greenL,color:B.green}}><Shield size={9}/>ЭЦП</span>:st==="uploaded"?<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:B.accentL,color:B.accent}}><Upload size={9}/>Загружен</span>:<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:B.yellowL,color:B.yellow}}><Loader2 size={9}/>На подп.</span>}</td>
      <td className="px-3 py-2.5 text-center"><div className="flex items-center justify-center gap-1">{st==="pending"&&<button onClick={()=>handleSign(doc.id)} className="px-2 py-0.5 rounded-lg text-[10px] font-medium text-white" style={{background:B.accent}}>ЭЦП</button>}<button onClick={()=>setToast({msg:"Скачан",type:"info"})} className="p-1 rounded hover:bg-slate-100"><Download size={12} className="text-slate-400"/></button><button onClick={()=>{setInitialThread?.(doc.dealId);setActive("cr-messages")}} className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-medium hover:bg-blue-50" style={{color:B.accent}}><MessageCircle size={10}/>Обсудить</button></div></td>
    </tr>})}</tbody></table></div></Card>}

    <Modal open={showUpload} onClose={()=>setShowUpload(false)} title="Загрузить документ">
      <div className="space-y-4 mb-5">
        <div><label className="block text-xs font-medium mb-1.5" style={{color:B.t3}}>Тип документа</label>
          <select value={uploadType} onChange={e=>setUploadType(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">Выберите тип...</option>
            <option value="ttn">ТТН (товарно-транспортная накладная)</option>
            <option value="act">Акт выполненных работ</option>
            <option value="esf">ЭСЧФ (электронный счёт-фактура)</option>
            <option value="report">Квартальная отчётность (баланс / P&L)</option>
            <option value="consent">Согласие (БКИ / ОЭБ / ПД)</option>
            <option value="other">Иной документ</option>
          </select>
        </div>
        {(uploadType==="ttn"||uploadType==="act"||uploadType==="esf")&&<div><label className="block text-xs font-medium mb-1.5" style={{color:B.t3}}>Привязка к уступке</label>
          <select value={uploadDeal} onChange={e=>setUploadDeal(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="">Выберите уступку...</option>
            {CR_DEALS.map(d=><option key={d.id} value={d.id}>{d.id} · {BUYERS.find(b=>b.id===d.buyerId)?.name} · {fmtByn(d.amount)}</option>)}
          </select>
        </div>}
        {uploadType==="report"&&<div className="rounded-xl p-3" style={{background:B.accentL}}><div className="text-xs" style={{color:B.t2}}>Загрузите бухгалтерский баланс или P&L. Формат: PDF.</div></div>}
        {uploadType==="other"&&<><div><label className="block text-xs font-medium mb-1.5" style={{color:B.t3}}>Название документа</label><input value={uploadDesc} onChange={e=>setUploadDesc(e.target.value)} placeholder="Например: Справка из налоговой" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
        <div><label className="block text-xs font-medium mb-1.5" style={{color:B.t3}}>Привязка (необязательно)</label><select value={uploadDeal} onChange={e=>setUploadDeal(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"><option value="">Без привязки (общий документ)</option><option value="Онбординг">Онбординг</option><option value="Актуализация">Актуализация данных</option>{CR_DEALS.map(d=><option key={d.id} value={d.id}>{d.id} · {BUYERS.find(b=>b.id===d.buyerId)?.name}</option>)}</select></div></>}
        <div><label className="block text-xs font-medium mb-1.5" style={{color:B.t3}}>Файл (PDF)</label>
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center cursor-pointer hover:border-slate-300 transition-colors" onClick={()=>setUploadFile({name:'Документ.pdf',size:'245 KB'})}>
            {uploadFile?<div className="flex items-center justify-center gap-2"><CheckCircle size={16} style={{color:B.green}}/><span className="text-sm font-medium" style={{color:B.green}}>{uploadFile.name}</span><button onClick={e=>{e.stopPropagation();setUploadFile(null)}} className="p-0.5 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>
            :<div><Upload size={24} className="mx-auto mb-2 text-slate-300"/><div className="text-sm" style={{color:B.t3}}>Нажмите для выбора файла</div><div className="text-xs mt-1" style={{color:B.t3}}>PDF, до 10 МБ</div></div>}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Btn className="flex-1" icon={Upload} disabled={!uploadType||!uploadFile||((uploadType==="ttn"||uploadType==="act"||uploadType==="esf")&&!uploadDeal)||(uploadType==="other"&&!uploadDesc.trim())} onClick={()=>{setShowUpload(false);setToast({msg:'Документ загружен',type:'success'})}}>Загрузить</Btn>
        <Btn variant="secondary" onClick={()=>setShowUpload(false)}>Отмена</Btn>
      </div>
    </Modal>
  </div>;
};

// ═══ CREDITOR: FINANCE (full redesign) ═══════════════════
const CrFinance = ({setActive,setInitialExpandDeal,setReturnTo}) => {
  const [expandedMonth,setExpandedMonth]=useState(-1);const [toast,setToast]=useState(null);
  const [sectionSigning,setSectionSigning]=useState(null);
  const [signedFields,setSignedFields]=useState(new Set());
  const [addedEntries,setAddedEntries]=useState({});
  const totalUstupleno=FINANCE_MONTHS.reduce((s,m)=>s+m.total,0);
  const totalReceived=FINANCE_MONTHS.reduce((s,m)=>s+m.received,0);
  const totalDiscount=FINANCE_MONTHS.reduce((s,m)=>s+m.discount,0);
  const currentMonth=FINANCE_MONTHS[0];
  const currentDeals=CR_DEALS.filter(d=>d.status==="active").slice(0,3);
  const chartData=[...FINANCE_MONTHS].reverse().map(m=>({month:m.month.split(" ")[0].slice(0,3),discount:m.discount,received:m.received}));

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Финансы" subtitle="Дисконты, финансирование и история"/>

    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-sm" style={{color:B.t1}}>Объём уступок по месяцам</h3><span className="text-xs px-2 py-1 rounded-lg bg-slate-50" style={{color:B.t3}}>6 мес.</span></div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={gmvData}><defs><linearGradient id="gGrad2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={B.accent} stopOpacity={0.25}/><stop offset="100%" stopColor={B.accent} stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:B.t3,fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:B.t3,fontSize:12}} tickFormatter={v=>`${v/1000}k`}/>
        <Tooltip formatter={v=>[fmtByn(v),"Объём"]} contentStyle={{borderRadius:12,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}/><Area type="monotone" dataKey="v" stroke={B.accent} strokeWidth={2.5} fill="url(#gGrad2)"/></AreaChart>
      </ResponsiveContainer>
    </Card>

    <div className="grid grid-cols-3 gap-4 mb-6">{[
      {label:"Уступлено всего",value:fmtByn(totalUstupleno),icon:TrendingUp,color:B.accent,tip:"Сколько всего денежных требований вы передали банку"},
      {label:"Получено на р/с",value:fmtByn(totalReceived),icon:CheckCircle,color:B.green,tip:"Сколько денег банк перечислил вам на расчётный счёт (за вычетом дисконта)"},
      {label:"Удержано дисконтов",value:fmtByn(totalDiscount),icon:Banknote,color:B.yellow,tip:"Стоимость факторинга — разница между суммой уступки и тем, что вы получили"},
    ].map((kpi,i)=><Card key={i} className="p-4"><div className="flex items-start justify-between mb-2"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:kpi.color+"15"}}><kpi.icon size={18} style={{color:kpi.color}}/></div></div><div className="text-xl font-bold truncate" style={{color:B.t1}}>{kpi.value}</div><div className="text-xs mt-1" style={{color:B.t3}}><InfoTooltip text={kpi.tip}><span className="border-b border-dotted border-slate-300 cursor-help">{kpi.label}</span></InfoTooltip></div></Card>)}</div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
      {/* Current period */}
      <Card className="p-6"><div className="flex items-center justify-between mb-4"><div><h3 className="font-semibold" style={{color:B.t1}}>Текущий период</h3><p className="text-xs" style={{color:B.t2}}>{currentMonth.month}</p></div><StatusBadge status={currentMonth.status} size="md"/></div>
        <div className="text-center mb-4"><div className="text-3xl font-bold" style={{color:B.green}}>{fmtByn(currentMonth.received)}</div><div className="text-xs mt-1" style={{color:B.t3}}>получено · дисконт {fmtByn(currentMonth.discount)}</div></div>
        <div className="space-y-2 mb-4 text-sm"><div className="flex justify-between"><span style={{color:B.t3}}>Уступлено</span><span className="font-medium">{fmtByn(currentMonth.total)}</span></div><div className="flex justify-between"><span style={{color:B.t3}}>Дисконт</span><span className="font-semibold" style={{color:B.red}}>−{fmtByn(currentMonth.discount)}</span></div><div className="flex justify-between border-t pt-2 border-slate-100"><span className="font-bold" style={{color:B.green}}>На р/с</span><span className="font-bold" style={{color:B.green}}>{fmtByn(currentMonth.received)}</span></div></div>
        <div className="flex gap-2"><Btn variant="secondary" size="sm" icon={Download} className="flex-1" onClick={()=>setToast({msg:"Акт сверки скачан",type:"success"})}>Акт сверки</Btn><Btn variant="secondary" size="sm" icon={Receipt} className="flex-1" onClick={()=>setToast({msg:"Ведомость скачана",type:"success"})}>Ведомость</Btn></div>
      </Card>

      {/* Chart + detail */}
      <Card className="xl:col-span-2 p-6"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-sm" style={{color:B.t1}}>Финансирование по месяцам</h3></div>
        <ResponsiveContainer width="100%" height={180}><BarChart data={chartData} barCategoryGap="30%"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:B.t3,fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:B.t3,fontSize:12}} tickFormatter={v=>`${v/1000}k`}/><Tooltip formatter={(v,name)=>[fmtByn(v),name==="received"?"Получено":"Дисконт"]} contentStyle={{borderRadius:12,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}/><Bar dataKey="received" fill={B.green} radius={[6,6,0,0]} name="received"/><Bar dataKey="discount" fill={B.yellow} radius={[6,6,0,0]} name="discount"/></BarChart></ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-slate-100"><div className="text-xs font-medium mb-3" style={{color:B.t3}}>Уступки — {currentMonth.month}</div><table className="w-full text-sm"><thead><tr className="text-xs" style={{color:B.t3}}><th className="pb-2 text-left font-medium">№</th><th className="pb-2 text-left font-medium">Покупатель</th><th className="pb-2 text-right font-medium">Сумма</th><th className="pb-2 text-right font-medium">Дисконт</th><th className="pb-2 text-right font-medium">Получено</th></tr></thead><tbody>{currentDeals.map(d=>{const buyer=BUYERS.find(b=>b.id===d.buyerId);return <TableRow key={d.id} style={{cursor:"pointer"}} onClick={()=>{setInitialExpandDeal?.(d.id);setReturnTo?.("cr-finance");setActive("cr-deals")}}><td className="py-2 hover:underline" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:B.accent}}>{d.id}</td><td className="py-2" style={{color:B.t1}}>{buyer?.name}</td><td className="py-2 text-right">{fmtByn(d.amount)}</td><td className="py-2 text-right" style={{color:B.red}}>−{fmtByn(d.discount)}</td><td className="py-2 text-right font-bold" style={{color:B.green}}>{fmtByn(d.toReceive)}</td></TableRow>})}</tbody></table></div>
      </Card>
    </div>

    {/* History */}
    <Card className="overflow-hidden"><div className="px-6 py-4 border-b border-slate-100"><h3 className="font-semibold text-sm" style={{color:B.t1}}>История расчётов</h3></div>
      {FINANCE_MONTHS.map((m,i)=>{const isPending=m.status==="pending";return <div key={i} className="border-b border-slate-50 last:border-0">
        <button onClick={()=>setExpandedMonth(expandedMonth===i?-1:i)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors text-left">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{background:isPending?B.yellowL:B.greenL}}>{isPending?<Clock size={15} style={{color:B.yellow}}/>:<CheckCircle size={15} style={{color:B.green}}/>}</div>
          <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-medium text-sm" style={{color:B.t1}}>{m.month}</span><StatusBadge status={m.status}/></div><div className="text-xs mt-0.5" style={{color:B.t3}}>{m.deals} уступок · объём {fmtByn(m.total)}</div></div>
          <div className="text-right shrink-0"><div className="font-bold text-sm" style={{color:B.green}}>{fmtByn(m.received)}</div><div className="text-xs" style={{color:B.t3}}>дисконт {fmtByn(m.discount)}</div></div>
          {expandedMonth===i?<ChevronUp size={16} className="text-slate-400 shrink-0"/>:<ChevronDown size={16} className="text-slate-400 shrink-0"/>}
        </button>
        {expandedMonth===i&&<div className="px-6 pb-4 pl-[72px]"><div className="grid grid-cols-2 lg:grid-cols-4 gap-3"><div className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}>Уступлено</div><div className="font-bold text-sm">{fmtByn(m.total)}</div></div><div className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}><InfoTooltip text="Стоимость факторинга: сумма × (ставка/365) × дни. Удерживается банком при финансировании">Дисконт</InfoTooltip></div><div className="font-bold text-sm" style={{color:B.red}}>−{fmtByn(m.discount)}</div></div><div className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}>Получено</div><div className="font-bold text-sm" style={{color:B.green}}>{fmtByn(m.received)}</div></div><div className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}>Уступок</div><div className="font-bold text-sm">{m.deals}</div></div></div></div>}
      </div>})}
    </Card>
  </div>;
};

// ═══ DEBTOR: DOCUMENTS (full — 3 zones, enhanced UX) ═════
const DbDocuments = ({setActive,setInitialThread,initialViewDoc:initDoc,onClearViewDoc,returnTo,onReturn}) => {
  const [tab,setTab]=useState("all");const [typeTab,setTypeTab]=useState("all");
  const [toast,setToast]=useState(null);const [docSearch,setDocSearch]=useState("");
  const [viewDoc,setViewDoc]=useState(null);const [signingDoc,setSigningDoc]=useState(null);
  const [signedDocs,setSignedDocs]=useState(new Set());
  const [selectedDocs,setSelectedDocs]=useState(new Set());
  const [groupByDeal,setGroupByDeal]=useState(false);
  useEffect(()=>{if(initDoc&&initDoc.length>0){const doc=allDocs.find(d=>d.name.includes(initDoc)||d.id===initDoc);if(doc)setViewDoc(doc);onClearViewDoc?.()}},[initDoc]);
  const copyReqs=()=>{copyText("Получатель: ЗАО «Нео Банк Азия»\nР/с: BY20 NEOB 3819 0000 0001 2345\nБИК: NEOBBY2X");setToast({msg:"Реквизиты скопированы",type:"success"})};

  const handleSign=(id)=>{setSigningDoc(id);setTimeout(()=>{setSignedDocs(p=>{const n=new Set(p);n.add(id);return n});setSigningDoc(null);setToast({msg:"Документ подтверждён ЭЦП",type:"success"})},1500)};
  const handleBulkSign=()=>{const pend=allDocs.filter(d=>getStatus(d)==="pending");setSigningDoc("bulk");setTimeout(()=>{setSignedDocs(p=>{const n=new Set(p);pend.forEach(d=>n.add(d.id));return n});setSigningDoc(null);setSelectedDocs(new Set());setToast({msg:`${pend.length} документов подтверждено ЭЦП`,type:"success"})},1500)};

  // GDs + consents (debtor signs these at onboarding)
  const dbContracts=SUPPLIERS.map((s,i)=>({id:`db-gd-${i+1}`,type:"contract",name:`Генеральный договор факторинга №${i+1}`,supplier:s.name,supplierId:s.id,dealId:`ГД-${i+1}`,date:"2026-01-15",amount:s.limit,ecpStatus:"signed",action:"sign"})).concat([
    {id:"db-bki",type:"consentBki",name:"Согласие на проверку в БКИ",supplier:COMPANY.name,supplierId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed",action:"sign"},
    {id:"db-oeb",type:"consentOeb",name:"Согласие на проверку ОЭБ",supplier:COMPANY.name,supplierId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed",action:"sign"},
    {id:"db-pd",type:"consentPd",name:"Согласие на обработку ПД",supplier:COMPANY.name,supplierId:0,dealId:"Онбординг",date:"2026-01-15",amount:0,ecpStatus:"signed",action:"sign"},
  ]);

  // Deal docs
  const dbDealDocs=DB_DEALS.flatMap(d=>{const sup=SUPPLIERS.find(s=>s.id===d.supplierId);const num=d.id.split("-")[2];return[
    {id:`db-ds-${num}`,type:"supAg",name:`ДС №${num} к ГД№1`,supplier:sup?.name||"",supplierId:d.supplierId,dealId:d.id,date:d.notifyDate,amount:d.amount,ecpStatus:"view",action:"view"},
    {id:`db-ttn-${num}`,type:"ttn",name:`ТТН_${num}.pdf`,supplier:sup?.name||"",supplierId:d.supplierId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:"view",action:"view"},
    {id:`db-esf-${num}`,type:"esf",name:`ЭСЧФ_${num}.pdf`,supplier:sup?.name||"",supplierId:d.supplierId,dealId:d.id,date:d.shipDate,amount:d.amount,ecpStatus:"view",action:"view"},
    {id:`db-ntf-${num}`,type:"notify",name:`Уведомление_${num}`,supplier:sup?.name||"",supplierId:d.supplierId,dealId:d.id,date:d.notifyDate,amount:d.amount,ecpStatus:d.confirmed?"signed":"pending",action:"sign",dueDate:d.dueDate,daysLeft:d.daysLeft,product:d.product},
  ]});

  const allDocs=[...dbContracts,...dbDealDocs];
  const getStatus=(doc)=>signedDocs.has(doc.id)?"signed":doc.ecpStatus;
  const pendingCount=allDocs.filter(d=>getStatus(d)==="pending").length;

  const typeLabels={contract:"Ген. договор",consentBki:"Согласие БКИ",consentOeb:"Согласие ОЭБ",consentPd:"Согласие ПД",supAg:"Допсоглашение",ttn:"ТТН",esf:"ЭСЧФ",notify:"Увед. об уступке"};
  const typeIcons={contract:Shield,consentBki:Search,consentOeb:Shield,consentPd:Users,supAg:Gavel,esf:Receipt,ttn:FileSpreadsheet,notify:Send};

  const filtered=allDocs.filter(d=>{
    if(docSearch){const q=docSearch.toLowerCase();if(!d.name.toLowerCase().includes(q)&&!d.dealId.toLowerCase().includes(q)&&!(d.supplier||"").toLowerCase().includes(q))return false}
    const st=getStatus(d);
    if(tab==="pending"&&st!=="pending")return false;
    if(tab==="signed"&&st!=="signed")return false;
    if(tab==="view"&&st!=="view")return false;
    if(typeTab!=="all"&&d.type!==typeTab)return false;
    return true;
  });

  const toggleDoc=(id)=>{const doc=allDocs.find(d=>d.id===id);if(getStatus(doc)!=="pending")return;setSelectedDocs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n})};
  const selectAllPending=()=>{const pend=filtered.filter(d=>getStatus(d)==="pending");if(selectedDocs.size===pend.length)setSelectedDocs(new Set());else setSelectedDocs(new Set(pend.map(d=>d.id)))};

  const StatusCell=({st})=>st==="signed"?<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:B.greenL,color:B.green}}><Shield size={9}/>Подписан</span>:st==="pending"?<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:B.redL,color:B.red}}><Pen size={9}/>Подписать</span>:<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{background:"#f1f5f9",color:B.t3}}><Eye size={9}/>Просмотр</span>;

  // Card view
  if(viewDoc){const doc=viewDoc;const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);const isSignable=doc.action==="sign";
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <button onClick={()=>{if(returnTo){onReturn?.()}else{setViewDoc(null)}}} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:B.purple}}><ArrowLeft size={16}/>{returnTo?"Назад":"Назад к реестру"}</button>
    <Card className="p-6 mb-5"><div className="flex items-start justify-between">
      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{background:B.purpleL}}><TIcon size={22} style={{color:B.purple}}/></div>
      <div><h1 className="text-xl font-bold" style={{color:B.t1}}>{doc.name}</h1><div className="text-sm mt-1" style={{color:B.t3}}>{typeLabels[doc.type]} · {doc.dealId} · {doc.supplier} · {doc.date}</div></div></div>
      <StatusCell st={st}/>
    </div></Card>

    {doc.type==="notify"&&st==="pending"&&<Card className="p-5 mb-5" style={{background:"#F5F3FF"}}><div className="flex items-start gap-2"><Info size={16} style={{color:B.purple}} className="shrink-0 mt-0.5"/><div className="text-sm" style={{color:B.t1}}><strong>Что это значит?</strong> Ваш поставщик передал банку право получить оплату за эту поставку. Подтверждая, вы обязуетесь оплатить на счёт банка.</div></div></Card>}
    {!isSignable&&<Card className="p-4 mb-5" style={{background:"#f1f5f9"}}><div className="flex items-center gap-2 text-sm" style={{color:B.t3}}><Eye size={16}/>Этот документ подписан кредитором и банком. Вам подписание не требуется.</div></Card>}

    <Card className="p-6 mb-5"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>Превью документа</div><div className="rounded-xl border-2 border-dashed border-slate-200 h-48 flex items-center justify-center" style={{background:"#FAFBFC"}}><div className="text-center"><FileText size={32} className="mx-auto mb-2 text-slate-300"/><div className="text-sm" style={{color:B.t3}}>{doc.name}</div></div></div></Card>

    {doc.type==="notify"&&<Card className="p-5 mb-5" style={{borderColor:B.purple+"30"}}><div className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{color:B.purple}}>Реквизиты для оплаты</div><div className="space-y-1.5 text-sm">{[["Получатель","ЗАО «Нео Банк Азия»"],["Р/с","BY20 NEOB 3819 0000 0001 2345"],["БИК","NEOBBY2X"]].map(([l,v],i)=><div key={i} className="flex justify-between"><span style={{color:B.t3}}>{l}</span><span className="font-medium" style={{color:B.t1,fontFamily:i>0?"'JetBrains Mono',monospace":undefined}}>{v}</span></div>)}</div><Btn size="sm" variant="secondary" className="w-full mt-3" icon={ExternalLink} onClick={copyReqs}>Скопировать реквизиты</Btn></Card>}

    <Card className="p-5 mb-5"><h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>Подписанты</h3><div className="space-y-2">
      {isSignable?[{who:"Кредитор (поставщик)",done:true},{who:"Банк — ЗАО «Нео Банк Азия»",done:true},{who:"Должник — "+COMPANY.name,done:st==="signed"}].map((s,i)=><div key={i} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-50">{s.done?<CheckCircle size={13} style={{color:B.green}}/>:<Loader2 size={13} style={{color:B.yellow}}/>}<span className="font-medium flex-1" style={{color:B.t1}}>{s.who}</span><span style={{color:s.done?B.green:B.yellow}}>{s.done?"ЭЦП ✓":"Ожидает вашей подписи"}</span></div>)
      :[{who:"Кредитор (поставщик)",done:true},{who:"Банк — ЗАО «Нео Банк Азия»",done:true}].map((s,i)=><div key={i} className="flex items-center gap-3 text-xs p-2 rounded-lg bg-slate-50"><CheckCircle size={13} style={{color:B.green}}/><span className="font-medium flex-1" style={{color:B.t1}}>{s.who}</span><span style={{color:B.green}}>ЭЦП ✓</span></div>)}
    </div></Card>

    <div className="flex flex-wrap gap-2 mb-5">
      {st==="pending"&&<Btn icon={signingDoc===doc.id?Loader2:Pen} disabled={!!signingDoc} onClick={()=>handleSign(doc.id)} style={{background:B.purple}}>{signingDoc===doc.id?"Подписание...":"Подтвердить ЭЦП"}</Btn>}
      <Btn variant="secondary" icon={Download} onClick={()=>setToast({msg:`${doc.name} скачан`,type:"info"})}>Скачать PDF</Btn>
      {doc.dealId.startsWith("УС")&&<Btn variant="secondary" icon={MessageCircle} onClick={()=>{setInitialThread?.(doc.dealId);setActive("db-messages")}}>Обсудить</Btn>}
    </div>

    {(doc.dealId.startsWith("УС")||doc.dealId.startsWith("ГД"))&&<Card className="p-5"><h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>Связанные документы</h3><div className="space-y-1.5">{allDocs.filter(rd=>rd.dealId===doc.dealId&&rd.id!==doc.id).map((rd,i)=>{const RI=typeIcons[rd.type]||FileText;const rs=getStatus(rd);return <div key={i} className="flex items-center gap-3 py-2 text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2" onClick={()=>setViewDoc(rd)}><RI size={13} style={{color:B.purple}}/><span className="font-medium flex-1" style={{color:B.t1}}>{rd.name}</span><StatusCell st={rs}/></div>})}</div></Card>}
  </div>}

  // List view
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Документы" subtitle={`${allDocs.length} документов · ${pendingCount>0?pendingCount+" на подписании":"всё подписано"}`}/>

    {pendingCount>0&&<Card className="p-4 mb-5 flex items-center justify-between" style={{background:"#FEF2F2",borderColor:"#FECACA"}}>
      <div className="flex items-center gap-2"><AlertCircle size={18} style={{color:B.red}}/><div><span className="text-sm font-bold" style={{color:B.red}}>{pendingCount} документ{pendingCount===1?"":"а"} требу{pendingCount===1?"ет":"ют"} вашей подписи</span><div className="text-xs mt-0.5" style={{color:B.t2}}>Подпишите все документы, чтобы процесс не останавливался</div></div></div>
      <Btn icon={signingDoc==="bulk"?Loader2:Pen} disabled={!!signingDoc} onClick={handleBulkSign} style={{background:B.red}}>{signingDoc==="bulk"?"Подписание...":"Подписать все ("+pendingCount+")"}</Btn>
    </Card>}

    <div className="flex flex-wrap items-center gap-3 mb-3">
      <div className="flex gap-1.5">{[["all","Все ("+allDocs.length+")"],["pending","На подписании ("+pendingCount+")"],["signed","Подписаны"],["view","Только просмотр"]].map(([v,l])=><button key={v} onClick={()=>setTab(v)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${tab===v?"text-white":"text-slate-500 bg-slate-50"}`} style={tab===v?{background:v==="pending"?B.red:B.purple}:undefined}>{l}</button>)}</div>
      <div className="relative ml-auto"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={docSearch} onChange={e=>setDocSearch(e.target.value)} placeholder="Поиск..." className="pl-9 pr-3 py-2 w-56 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200"/></div>
    </div>
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex gap-1.5">{[["all","Все типы"],["contract","Ген. договоры"],["notify","Уведомления"],["supAg","Допсоглашения"],["ttn","ТТН"],["esf","ЭСЧФ"],["consentBki","БКИ"],["consentOeb","ОЭБ"],["consentPd","ПД"]].map(([v,l])=><button key={v} onClick={()=>setTypeTab(v)} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeTab===v?"text-white":"text-slate-500 bg-slate-50"}`} style={typeTab===v?{background:B.purple}:undefined}>{l}</button>)}</div>
      <div className="flex items-center gap-2 ml-auto"><span className="text-xs" style={{color:B.t3}}>Группировка:</span><button onClick={()=>setGroupByDeal(!groupByDeal)} className="relative w-9 h-5 rounded-full transition-colors" style={{background:groupByDeal?B.purple:"#CBD5E1"}}><span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all" style={{left:groupByDeal?18:2}}/></button></div>
    </div>

    {selectedDocs.size>0&&<div className="sticky top-0 z-30 bg-white py-3 px-5 mb-3 rounded-xl border shadow-md flex items-center justify-between" style={{borderColor:B.purple}}><span className="text-sm font-medium" style={{color:B.t1}}>Выбрано: {selectedDocs.size}</span><div className="flex gap-2"><Btn size="sm" icon={signingDoc==="bulk"?Loader2:Pen} disabled={!!signingDoc} onClick={()=>{setSigningDoc("sel");setTimeout(()=>{setSignedDocs(p=>{const n=new Set(p);selectedDocs.forEach(id=>n.add(id));return n});setSigningDoc(null);setSelectedDocs(new Set());setToast({msg:`${selectedDocs.size} документов подтверждено`,type:"success"})},1500)}} style={{background:B.purple}}>Подписать ЭЦП</Btn><Btn size="sm" variant="secondary" icon={Download} onClick={()=>setToast({msg:"Скачано (ZIP)",type:"info"})}>Скачать ZIP</Btn><button onClick={()=>setSelectedDocs(new Set())} className="p-1.5 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div></div>}

    {groupByDeal?<Card className="overflow-hidden"><div className="divide-y divide-slate-100">{Object.entries(filtered.reduce((acc,doc)=>{(acc[doc.dealId]=acc[doc.dealId]||[]).push(doc);return acc},{})).map(([dealId,docs])=>{const pendInGroup=docs.filter(d=>getStatus(d)==="pending").length;const isOpen=selectedDocs.has("g-"+dealId);return <div key={dealId}>
      <div className="px-5 py-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50" onClick={()=>setSelectedDocs(p=>{const n=new Set(p);const k="g-"+dealId;n.has(k)?n.delete(k):n.add(k);return n})}>
        {isOpen?<ChevronDown size={14} style={{color:B.purple}}/>:<ChevronRight size={14} style={{color:B.t3}}/>}
        <span className="text-xs font-bold" style={{color:B.purple,fontFamily:"'JetBrains Mono',monospace"}}>{dealId}</span>
        <span className="text-xs" style={{color:B.t3}}>{docs[0]?.supplier} · {docs.length} док.</span>
        {pendInGroup>0?<span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:B.redL,color:B.red}}>⚠ {pendInGroup} на подписании</span>:<span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{background:B.greenL,color:B.green}}>✅ Всё подписано</span>}
      </div>
      {isOpen&&<div className="px-5 pb-3 ml-5 space-y-1">{docs.map((doc,i)=>{const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);return <div key={i} className="flex items-center gap-3 py-1.5 text-xs cursor-pointer hover:bg-slate-50 rounded-lg px-2 -mx-2" onClick={()=>setViewDoc(doc)}>
        <TIcon size={13} style={{color:B.purple}}/><span className="font-medium flex-1" style={{color:B.t1}}>{doc.name}</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]" style={{color:B.t2}}>{typeLabels[doc.type]}</span>
        <StatusCell st={st}/>
        {st==="pending"&&<button onClick={e=>{e.stopPropagation();handleSign(doc.id)}} className="px-2 py-0.5 rounded-lg text-[10px] font-medium text-white" style={{background:B.purple}}>ЭЦП</button>}
        <button onClick={e=>{e.stopPropagation();setToast({msg:"Скачан",type:"info"})}} className="p-1 rounded hover:bg-slate-100"><Download size={11} className="text-slate-400"/></button>
      </div>})}</div>}
    </div>})}</div></Card>

    :<Card className="overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-xs text-left border-b border-slate-100" style={{color:B.t3,background:"#FAFBFC"}}><th className="px-3 py-3 w-8"><input type="checkbox" checked={selectedDocs.size>0&&selectedDocs.size===filtered.filter(d=>getStatus(d)==="pending").length} onChange={selectAllPending} className="rounded"/></th><th className="px-3 py-3 font-medium">Документ</th><th className="px-3 py-3 font-medium">Тип</th><th className="px-3 py-3 font-medium">Привязка</th><th className="px-3 py-3 font-medium">Поставщик</th><th className="px-3 py-3 font-medium">Дата</th><th className="px-3 py-3 font-medium text-center">Статус</th><th className="px-3 py-3 font-medium text-center">Действия</th></tr></thead>
    <tbody>{filtered.map(doc=>{const TIcon=typeIcons[doc.type]||FileText;const st=getStatus(doc);return <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="px-3 py-2.5">{st==="pending"?<input type="checkbox" checked={selectedDocs.has(doc.id)} onChange={()=>toggleDoc(doc.id)} className="rounded"/>:<span className="w-4"/>}</td>
      <td className="px-3 py-2.5 cursor-pointer" onClick={()=>setViewDoc(doc)}><div className="flex items-center gap-2"><TIcon size={13} style={{color:B.purple}}/><span className="font-medium text-xs hover:underline" style={{color:B.purple}}>{doc.name}</span></div></td>
      <td className="px-3 py-2.5"><span className="px-2 py-0.5 rounded-lg text-[10px] bg-slate-100" style={{color:B.t2}}>{typeLabels[doc.type]}</span></td>
      <td className="px-3 py-2.5 text-xs" style={{fontFamily:"'JetBrains Mono',monospace",color:B.t2}}>{doc.dealId}</td>
      <td className="px-3 py-2.5 text-xs" style={{color:B.t1}}>{doc.supplier}</td>
      <td className="px-3 py-2.5 text-xs" style={{color:B.t2}}>{doc.date}</td>
      <td className="px-3 py-2.5 text-center"><StatusCell st={st}/></td>
      <td className="px-3 py-2.5 text-center"><div className="flex items-center justify-center gap-1">{st==="pending"&&<button onClick={()=>handleSign(doc.id)} className="px-2 py-0.5 rounded-lg text-[10px] font-medium text-white" style={{background:B.purple}}>ЭЦП</button>}<button onClick={()=>setToast({msg:"Скачан",type:"info"})} className="p-1 rounded hover:bg-slate-100"><Download size={12} className="text-slate-400"/></button>{doc.dealId.startsWith("УС")&&<button onClick={()=>{setInitialThread?.(doc.dealId);setActive("db-messages")}} className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-medium hover:bg-purple-50" style={{color:B.purple}}><MessageCircle size={10}/>Обсудить</button>}</div></td>
    </tr>})}</tbody></table></div></Card>}
  </div>;
};


const CrBuyers = ({setActive,setInitialThread,setInitialExpandDeal,setInitialShowWizard,setReturnTo}) => {
  const [filter,setFilter]=useState("all");
  const [viewBuyer,setViewBuyer]=useState(null);
  const [toast,setToast]=useState(null);
  const [buySearch,setBuySearch]=useState("");
  const filtered = BUYERS.filter(b=>(filter==="all"||b.status===filter)&&(!buySearch||b.name.toLowerCase().includes(buySearch.toLowerCase())||b.unp.includes(buySearch)));

  // Buyer profile view
  if(viewBuyer){const b=viewBuyer;const buyerDeals=CR_DEALS.filter(d=>d.buyerId===b.id);const activeBD=buyerDeals.filter(d=>d.status==="active");const paidBD=buyerDeals.filter(d=>d.status==="paid");const overdueBD=buyerDeals.filter(d=>d.status==="overdue");const usePct=b.limit>0?Math.round(b.used/b.limit*100):0;
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <button onClick={()=>setViewBuyer(null)} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:B.accent}}><ArrowLeft size={16}/>Назад к покупателям</button>

    <Card className="p-6 mb-5">
      <div className="flex items-start gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0" style={{background:b.status==="green"?B.green:b.status==="red"?B.red:B.yellow}}>{b.name.replace(/[«»ООО ОАО ЧУП ИП ]/g,"").slice(0,2)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3"><h1 className="text-xl font-bold" style={{color:B.t1}}>{b.name}</h1><StatusBadge status={b.status} size="md"/></div>
          <div className="text-sm mt-1" style={{color:B.t3}}>УНП {b.unp} · На платформе с {b.regDate}</div>
          {b.status==="green"&&<div className="flex gap-2 mt-3">
            <Btn icon={Plus} onClick={()=>{setInitialShowWizard?.(true);setActive("cr-deals")}}>Создать уступку</Btn>
            <Btn variant="secondary" icon={MessageCircle} onClick={()=>{if(activeBD[0])setInitialThread?.(activeBD[0].id);setActive("cr-messages")}}>Написать</Btn>
          </div>}
        </div>
      </div>
    </Card>

    {b.status==="green"?<><div className="grid grid-cols-4 gap-4 mb-5">
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Максимальная сумма активных уступок по покупателю, установленная банком">Лимит</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.t1}}>{fmtByn(b.limit)}</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Использовано</div><div className="text-xl font-bold" style={{color:B.t1}}>{fmtByn(b.used)}</div><div className="h-1.5 rounded-full bg-slate-100 mt-2"><div className="h-full rounded-full" style={{width:`${usePct}%`,background:usePct>80?B.red:B.accent}}/></div><div className="text-[10px] mt-1" style={{color:B.t3}}>{usePct}%</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.green}}>Доступно</div><div className="text-xl font-bold" style={{color:B.green}}>{fmtByn(b.available)}</div></Card>
      <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Стоимость факторинга</div><div className="text-lg font-bold" style={{color:B.accent}}>{calcPeriodRate(b.rate,30)}%<span className="text-xs font-normal" style={{color:B.t3}}>/30д</span></div><div className="text-[10px]" style={{color:B.t3}}>{calcPeriodRate(b.rate,60)}%/60д · {calcPeriodRate(b.rate,90)}%/90д</div></Card>
    </div>

    {activeBD.length>0&&<Card className="p-5 mb-5">
      <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold" style={{color:B.t1}}>Активные уступки ({activeBD.length})</h3><span className="text-xs" style={{color:B.t3}}>Сумма: {fmtByn(activeBD.reduce((s,d)=>s+d.amount,0))}</span></div>
      <div className="space-y-2">{activeBD.map(d=><div key={d.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:shadow-sm hover:border-blue-200 cursor-pointer transition-all" onClick={()=>{setInitialExpandDeal?.(d.id);setReturnTo?.("cr-buyers");setActive("cr-deals")}}>
        <span className="text-xs font-bold" style={{color:B.accent,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span>
        <span className="flex-1 text-xs" style={{color:B.t1}}>{fmtByn(d.amount)}</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px]" style={{color:B.t3}}>{d.term} дн. · {calcPeriodRate(b.rate,d.term)}%</span>
        <StatusBadge status={d.status}/>
        <span className="text-xs" style={{color:d.daysLeft<14?B.yellow:B.green}}>{d.daysLeft} дн.</span>
        <button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-blue-50" style={{color:B.accent}}><MessageCircle size={10}/>Обсудить</button>
      </div>)}</div>
    </Card>}

    {overdueBD.length>0&&<Card className="p-5 mb-5" style={{borderColor:B.red+"40"}}>
      <h3 className="text-sm font-bold mb-3" style={{color:B.red}}>Просроченные ({overdueBD.length})</h3>
      <div className="space-y-2">{overdueBD.map(d=><div key={d.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:B.redL}}>
        <span className="text-xs font-bold" style={{color:B.red,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span>
        <span className="flex-1 text-xs" style={{color:B.t1}}>{fmtByn(d.amount)}</span>
        <span className="text-xs font-bold" style={{color:B.red}}>{Math.abs(d.daysLeft)} дн. просрочки</span>
      </div>)}</div>
    </Card>}

    {paidBD.length>0&&<Card className="p-5 mb-5">
      <h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>Оплаченные ({paidBD.length})</h3>
      <div className="space-y-1">{paidBD.map(d=><div key={d.id} className="flex items-center gap-3 py-2 text-xs border-b border-slate-50">
        <span style={{color:B.t3,fontFamily:"'JetBrains Mono',monospace"}}>{d.id}</span>
        <span className="flex-1" style={{color:B.t2}}>{fmtByn(d.amount)}</span>
        <span style={{color:B.green}}>Оплачена ✓</span>
      </div>)}</div>
    </Card>}
    </>

    :b.status==="red"?<Card className="p-5" style={{background:B.redL}}><div className="flex items-center gap-2 text-sm" style={{color:B.red}}><AlertTriangle size={16}/>Покупатель отклонён. Работа по предоплате.</div></Card>
    :<Card className="p-5" style={{background:B.yellowL}}><div className="flex items-center gap-2 text-sm" style={{color:B.yellow}}><Clock size={16}/>На предварительном одобрении. Лимит будет установлен после проверки банком.</div></Card>}
  </div>}

  // List view — table
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Покупатели (должники)" subtitle={`${BUYERS.length} покупателей в базе`}/>
    <div className="flex items-center gap-3 mb-5"><div className="flex gap-2">{[["all","Все",B.accent],["green","Одобрены",B.green],["yellow","Ожидает одобрение",B.yellow],["red","Отказ",B.red]].map(([v,l,c])=><button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:c}:undefined}>{l}</button>)}</div><div className="relative ml-auto"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={buySearch} onChange={e=>setBuySearch(e.target.value)} placeholder="Поиск по названию или УНП..." className="pl-9 pr-3 py-2 w-72 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"/></div></div>
    <Card className="overflow-hidden overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-xs text-left border-b border-slate-100" style={{color:B.t3,background:"#FAFBFC"}}><th className="px-5 py-3 font-medium">Компания</th><th className="px-3 py-3 font-medium">УНП</th><th className="px-3 py-3 font-medium">Статус</th><th className="px-3 py-3 font-medium text-right">Лимит</th><th className="px-3 py-3 font-medium text-right"><InfoTooltip text="Сколько ещё можно уступить по этому покупателю в рамках лимита">Доступно</InfoTooltip></th><th className="px-3 py-3 font-medium">Сделок</th></tr></thead>
    <tbody>{filtered.map(b=><tr key={b.id} onClick={()=>setViewBuyer(b)} className="border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50">
      <td className="px-5 py-3 font-medium" style={{color:B.t1}}>{b.name}</td>
      <td className="px-3 py-3" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:B.t2}}>{b.unp}</td>
      <td className="px-3 py-3"><StatusBadge status={b.status}/></td>
      <td className="px-3 py-3 text-right">{b.limit>0?fmtByn(b.limit):"—"}</td>
      <td className="px-3 py-3 text-right font-medium" style={{color:B.accent}}>{b.available>0?fmtByn(b.available):"—"}</td>
      <td className="px-3 py-3" style={{color:B.t2}}>{b.deals}</td>
    </tr>)}</tbody></table></Card>
  </div>;
};

const CrDeals = ({onSuccess,initialExpandDeal:initExp,onClearExpand,setActive,setInitialThread,setInitialViewDoc,setReturnTo,setReturnDealId,setInitialExpandDeal,initialShowWizard,onClearWizard,returnTo:dealsReturnTo,onReturnNav}) => {
  const [filter,setFilter]=useState("all");
  const [dealSearch,setDealSearch]=useState("");
  const [datePreset,setDatePreset]=useState("all");
  const [dateFrom,setDateFrom]=useState("");const [dateTo,setDateTo]=useState("");
  const [showNew,setShowNew]=useState(false);const [wizStep,setWizStep]=useState(0);
  const [newDeal,setNewDeal]=useState({buyerId:"",amount:"",term:30,docType:"ttn"});
  const [uploadedDocs,setUploadedDocs]=useState({esf:null,doc:null});
  const [toast,setToast]=useState(null);
  const [expandedDeal,setExpandedDeal]=useState(null);
  const [viewDeal,setViewDeal]=useState(null);
  useEffect(()=>{if(initExp){setViewDeal(initExp);onClearExpand?.()}},[initExp]);
  useEffect(()=>{if(initialShowWizard){setShowNew(true);setWizStep(0);onClearWizard?.()}},[initialShowWizard]);
  const [buyerSearch,setBuyerSearch]=useState("");const [dropOpen,setDropOpen]=useState(false);

  const applyPreset=(p)=>{setDatePreset(p);const today=new Date("2026-03-22");if(p==="all"){setDateFrom("");setDateTo("");return;}const to=today.toISOString().split("T")[0];setDateTo(to);if(p==="30d"){const d=new Date(today);d.setDate(d.getDate()-30);setDateFrom(d.toISOString().split("T")[0])}else if(p==="90d"){const d=new Date(today);d.setDate(d.getDate()-90);setDateFrom(d.toISOString().split("T")[0])}else if(p==="year"){setDateFrom(`${today.getFullYear()}-01-01`)}};

  const filtered = CR_DEALS.filter(d=>{if(dealSearch){const q=dealSearch.toLowerCase();const buyer=BUYERS.find(b=>b.id===d.buyerId);if(!d.id.toLowerCase().includes(q)&&!buyer?.name.toLowerCase().includes(q))return false}if(filter==="rejected")return d.rejected;if(filter!=="all"&&d.status!==filter)return false;if(dateFrom&&d.shipDate<dateFrom)return false;if(dateTo&&d.shipDate>dateTo)return false;return true});
  const approvedBuyers=BUYERS.filter(b=>b.status==="green");
  const selBuyer=approvedBuyers.find(b=>b.id===Number(newDeal.buyerId));
  const buyerRate=selBuyer?.rate||25;
  const discount=newDeal.amount?calcDiscount(Number(newDeal.amount),buyerRate,newDeal.term):0;
  const toReceive=newDeal.amount?Number(newDeal.amount)-discount:0;
  const periodRate=calcPeriodRate(buyerRate,newDeal.term);
  const docsReady=uploadedDocs.esf&&uploadedDocs.doc;
  const filteredBuyers=approvedBuyers.filter(b=>b.name.toLowerCase().includes(buyerSearch.toLowerCase())||b.unp.includes(buyerSearch));

  const simulateUpload=(key)=>{const names={esf:"ЭСЧФ",doc:newDeal.docType==="ttn"?"ТТН":"Акт_ВР"};setUploadedDocs(p=>({...p,[key]:{name:`${names[key]}_${Date.now()}.pdf`,size:`${(Math.random()*2+0.3).toFixed(1)} MB`}}))};

  return <div>
    {toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    {(()=>{if(!viewDeal)return null;const d=CR_DEALS.find(dd=>dd.id===viewDeal);if(!d)return null;const buyer=BUYERS.find(b=>b.id===d.buyerId);const tl=[{label:"Создание",date:d.shipDate,done:true,desc:"Документы загружены"},{label:"ДС подписано",date:d.shipDate,done:d.ecpStatus==="signed",desc:d.supAg},{label:"Финансирование",date:"3 раб. дня",done:d.status!=="pending",desc:fmtByn(d.toReceive)+" на р/с"},{label:d.status==="overdue"?"Просрочка":"Оплата",date:d.dueDate,done:d.status==="paid",desc:d.status==="overdue"?"Просрочена!":d.status==="paid"?"Оплачена":`${d.daysLeft} дн.`}];
    return <div>
      <button onClick={()=>{if(dealsReturnTo){onReturnNav?.()}else{setViewDeal(null)}}} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:B.accent}}><ArrowLeft size={16}/>{dealsReturnTo?"Назад":"Назад к реестру"}</button>

      <Card className="p-6 mb-5">
        <div className="flex items-start justify-between mb-4">
          <div><div className="flex items-center gap-3 mb-1"><h1 className="text-xl font-bold" style={{color:B.t1}}>{d.id}</h1><StatusBadge status={d.status} size="md"/>{d.rejected&&<span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{background:B.redL,color:B.red}}>Отклонена</span>}</div><div className="text-sm" style={{color:B.t3}}>{buyer?.name} · {fmtByn(d.amount)}</div></div>
          <div className="flex gap-2"><Btn icon={MessageCircle} variant="secondary" onClick={()=>{setInitialThread?.(d.id);setActive("cr-messages")}}>Обсудить</Btn><Btn icon={Download} variant="secondary" onClick={()=>setToast({msg:"Пакет документов скачан",type:"info"})}>Скачать пакет</Btn></div>
        </div>
        <div className="flex items-center gap-1 mb-4">{tl.map((s,i)=><Fragment key={i}><div className="flex flex-col items-center shrink-0" style={{minWidth:90}}><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${s.done?"text-white":"border-2"}`} style={s.done?{background:s.label.includes("Просрочка")?B.red:B.green}:i===tl.findIndex(x=>!x.done)?{borderColor:B.accent,color:B.accent}:{borderColor:B.border,color:B.t3}}>{s.done?<Check size={11}/>:i+1}</div><div className="text-[10px] font-semibold mt-1 text-center" style={{color:s.done?B.green:B.t3}}>{s.label}</div><div className="text-[9px] text-center" style={{color:B.t3}}>{s.desc}</div></div>{i<tl.length-1&&<div className="flex-1 h-px mx-1" style={{background:tl[i+1].done?B.green:B.border,minWidth:20}}/>}</Fragment>)}</div>
      </Card>

      <div className="grid grid-cols-4 gap-4 mb-5">
        <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Полная сумма денежного требования, уступленного банку">Сумма уступки</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.t1}}>{fmtByn(d.amount)}</div></Card>
        <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}><InfoTooltip text="Стоимость факторинга: сумма × (ставка/365) × дни. Удерживается банком при финансировании">Дисконт</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.red}}>{fmtByn(d.discount)}</div></Card>
        <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.green}}><InfoTooltip text="Сумма, которая зачисляется на ваш р/с. Равна: сумма уступки минус дисконт">К получению</InfoTooltip></div><div className="text-xl font-bold" style={{color:B.green}}>{fmtByn(d.toReceive)}</div></Card>
        <Card className="p-4"><div className="text-[10px] uppercase tracking-wide mb-1" style={{color:B.t3}}>Срок / Оплата</div><div className="text-xl font-bold" style={{color:d.daysLeft<14?B.yellow:B.t1}}>{d.term} дн.</div><div className="text-xs" style={{color:B.t3}}>до {d.dueDate} · {d.status==="paid"?"Оплачена":d.daysLeft+" дн."}</div></Card>
      </div>

      <Card className="p-5 mb-5">
        <h3 className="text-sm font-bold mb-3" style={{color:B.t1}}>Пакет документов</h3>
        <div className="space-y-2">{[{icon:Gavel,name:d.supAg,type:"ДС"},{icon:FileSpreadsheet,name:`${d.docType==="ttn"?"ТТН":"Акт"}_${d.id.split("-")[2]}.pdf`,type:d.docType==="ttn"?"ТТН":"Акт"},{icon:Receipt,name:`ЭСЧФ_${d.id.split("-")[2]}.pdf`,type:"ЭСЧФ"},{icon:Send,name:`Увед._${d.id.split("-")[2]}`,type:"Увед."}].map((doc,i)=><div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:shadow-sm hover:border-blue-200 cursor-pointer transition-all" onClick={()=>{setInitialViewDoc?.(doc.name);setReturnDealId?.(d.id);setReturnTo("cr-deals");setActive("cr-documents")}}>
          <doc.icon size={14} style={{color:B.accent}}/><span className="font-medium text-sm flex-1 hover:underline" style={{color:B.accent}}>{doc.name}</span><span className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs" style={{color:B.t3}}>{doc.type}</span><span className="text-xs" style={{color:B.green}}>ЭЦП ✓</span>
          <button onClick={e=>{e.stopPropagation();setToast({msg:`${doc.name} скачан`,type:"info"})}} className="p-1.5 rounded-lg hover:bg-slate-100"><Download size={14} className="text-slate-400"/></button>
          <ChevronRight size={14} className="text-slate-300"/>
        </div>)}</div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold" style={{color:B.t1}}>Обсуждение</h3><button onClick={()=>{setInitialThread?.(d.id);setActive("cr-messages")}} className="text-xs font-medium" style={{color:B.accent}}>Все сообщения →</button></div>
        {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).slice(-3).map((m,j)=><div key={j} className="flex items-start gap-2 py-1.5"><span className="text-xs font-bold shrink-0" style={{color:m.from==="creditor"?B.accent:B.purple}}>{m.company?.replace(/[«»ООО ОАО ЧУП ]/g,"").slice(0,12)}</span><span className="text-xs flex-1" style={{color:B.t2}}>{m.text}</span><span className="text-[9px] shrink-0" style={{color:B.t3}}>{m.time}</span></div>)}
        {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).length===0&&<button onClick={()=>{setInitialThread?.(d.id);setActive("cr-messages")}} className="text-xs font-medium flex items-center gap-1 py-2" style={{color:B.accent}}><MessageCircle size={11}/>Начать обсуждение</button>}
      </Card>
    </div>})()}

    {!viewDeal&&<><PageHeader title="Реестр уступок" subtitle={`${CR_DEALS.length} уступок в системе`}/>

    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex flex-wrap gap-2">{[["all","Все",B.accent],["active","Активные",B.yellow],["paid","Оплаченные",B.green],["overdue","Просроченные",B.red],["rejected","Отклонённые",B.orange]].map(([v,l,c])=><button key={v} onClick={()=>setFilter(v)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter===v?"text-white":"text-slate-500 bg-slate-50"}`} style={filter===v?{background:c}:undefined}>{l}</button>)}</div>
      <div className="flex items-center gap-3"><div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={dealSearch} onChange={e=>setDealSearch(e.target.value)} placeholder="Поиск по номеру или покупателю..." className="pl-9 pr-3 py-2 w-64 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"/></div><Btn icon={Plus} onClick={()=>{setShowNew(true);setWizStep(0);setNewDeal({buyerId:"",amount:"",term:30,docType:"ttn"});setUploadedDocs({esf:null,doc:null});setBuyerSearch("");setDropOpen(false)}}>Новая уступка</Btn></div>
    </div>

    {/* Date filter */}
    <Card className="p-4 mb-5"><div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-medium shrink-0" style={{color:B.t3}}>Период:</span>
      <div className="flex flex-wrap gap-1.5">{[["all","Все время"],["30d","30 дней"],["90d","90 дней"],["year","Текущий год"]].map(([v,l])=><button key={v} onClick={()=>applyPreset(v)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${datePreset===v?"text-white":"text-slate-500 bg-slate-50"}`} style={datePreset===v?{background:B.accent}:undefined}>{l}</button>)}</div>
      <div className="flex items-center gap-2 ml-auto"><span className="text-xs" style={{color:B.t3}}>с</span><input type="date" value={dateFrom} onChange={e=>{setDateFrom(e.target.value);setDatePreset("custom")}} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"/><span className="text-xs" style={{color:B.t3}}>по</span><input type="date" value={dateTo} onChange={e=>{setDateTo(e.target.value);setDatePreset("custom")}} className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
      {filtered.length!==CR_DEALS.length&&<span className="text-xs font-medium px-2 py-1 rounded-lg" style={{background:B.accentL,color:B.accent}}>Найдено: {filtered.length}</span>}
    </div></Card>

    <Card className="overflow-hidden overflow-x-auto"><table className="w-full text-sm "><thead><tr className="text-xs text-left border-b border-slate-100" style={{color:B.t3,background:"#FAFBFC"}}><th className="px-4 py-3 font-medium">№</th><th className="px-2 py-3 font-medium">Покупатель</th><th className="px-2 py-3 font-medium text-right">Сумма</th><th className="px-2 py-3 font-medium text-right">К получению</th><th className="px-2 py-3 font-medium">Срок</th><th className="px-2 py-3 font-medium text-center">Дней</th><th className="px-2 py-3 font-medium">Статус</th><th className="px-2 py-3 font-medium text-center"></th></tr></thead>
    <tbody>{filtered.map(d=>{const buyer=BUYERS.find(b=>b.id===d.buyerId);const isExp=expandedDeal===d.id;const tl=[{label:"Создание",date:d.shipDate,done:true,desc:"Документы загружены"},{label:"ДС подписано",date:d.shipDate,done:d.ecpStatus==="signed",desc:d.supAg},{label:"Финансирование",date:"3 раб. дня",done:d.status!=="pending",desc:fmtByn(d.toReceive)+" на р/с"},{label:d.status==="overdue"?"Просрочка":"Оплата",date:d.dueDate,done:d.status==="paid",desc:d.status==="overdue"?"Просрочена!":d.status==="paid"?"Оплачена":`${d.daysLeft} дн.`}];
    return <Fragment key={d.id}><tr onClick={()=>setViewDeal(d.id)} className="border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50" style={d.status==="overdue"?{background:"#FEF2F2"}:undefined}>
      <td className="px-4 py-2.5" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:B.accent}}>{d.id}</td>
      <td className="px-2 py-2.5 font-medium text-xs" style={{color:B.t1}}>{buyer?.name}</td>
      <td className="px-2 py-2.5 text-right text-xs">{fmtByn(d.amount)}</td>
      <td className="px-2 py-2.5 text-right text-xs font-bold" style={{color:B.green}}>{fmtByn(d.toReceive)}</td>
      <td className="px-2 py-2.5 text-xs" style={{color:B.t2}}>{d.dueDate}</td>
      <td className="px-2 py-2.5 text-center font-bold text-xs" style={{color:d.daysLeft<0?B.red:d.daysLeft<14?B.yellow:B.green}}>{d.status==="paid"?"—":d.daysLeft}</td>
      <td className="px-2 py-2.5">{d.rejected?<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{background:B.redL,color:B.red}}>Отклонена</span>:<StatusBadge status={d.status}/>}</td>
      <td className="px-2 py-2.5 text-center"><button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium hover:bg-blue-50 transition-colors" style={{color:B.accent}}><MessageCircle size={10}/>Обсудить</button></td>
    </tr>
    {false&&<tr><td colSpan={8} className="p-0 border-b border-slate-200"><div className="px-5 py-4 bg-slate-50/50" style={{minWidth:0}}>
      {/* Timeline */}
      <div className="flex items-center mb-4 overflow-x-auto">{tl.map((s,i)=><Fragment key={i}><div className="flex flex-col items-center shrink-0" style={{minWidth:80}}><div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${s.done?"text-white":"border-2"}`} style={s.done?{background:s.label.includes("Просрочка")?B.red:B.green}:i===tl.findIndex(x=>!x.done)?{borderColor:B.accent,color:B.accent}:{borderColor:B.border,color:B.t3}}>{s.done?<Check size={10}/>:i+1}</div><div className="text-[9px] font-semibold mt-1 text-center" style={{color:s.done?B.green:B.t3}}>{s.label}</div><div className="text-[8px] text-center" style={{color:B.t3}}>{s.desc}</div></div>{i<tl.length-1&&<div className="flex-1 h-px mx-1 shrink-0" style={{background:tl[i+1].done?B.green:B.border,minWidth:20}}/>}</Fragment>)}</div>
      {/* Doc pack */}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold" style={{color:B.t1}}>Пакет документов</span><button onClick={e=>{e.stopPropagation();setToast({msg:`Пакет ${d.id} скачан (ZIP)`,type:"info"})}} className="text-[10px] font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100" style={{color:B.accent}}><Download size={11}/>Скачать пакет</button></div>
        <div className="space-y-1">{[{icon:Gavel,name:d.supAg,type:"ДС"},{icon:FileSpreadsheet,name:`${d.docType==="ttn"?"ТТН":"Акт"}_${d.id.split("-")[2]}.pdf`,type:d.docType==="ttn"?"ТТН":"Акт"},{icon:Receipt,name:`ЭСЧФ_${d.id.split("-")[2]}.pdf`,type:"ЭСЧФ"},{icon:Send,name:`Увед._${d.id.split("-")[2]}`,type:"Увед."}].map((doc,i)=><div key={i} className="flex items-center gap-2 py-1 text-xs"><doc.icon size={12} style={{color:B.accent}}/><span className="font-medium flex-1 truncate" style={{color:B.t1}}>{doc.name}</span><span className="px-1 py-0.5 rounded bg-slate-100 text-[9px] shrink-0" style={{color:B.t3}}>{doc.type}</span><span className="text-[9px] shrink-0" style={{color:B.green}}>ЭЦП</span><button onClick={e=>{e.stopPropagation();setToast({msg:"Скачан",type:"info"})}} className="p-0.5 rounded hover:bg-slate-100 shrink-0"><Download size={10} className="text-slate-400"/></button><button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium hover:bg-blue-50 shrink-0" style={{color:B.accent}}><MessageCircle size={9}/>Обсудить</button></div>)}</div>
      </div>
      {/* Mini chat */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold flex items-center gap-1.5" style={{color:B.t1}}><MessageCircle size={12} style={{color:B.accent}}/>Обсуждение ({(DEAL_MESSAGES_INIT[d.id]?.messages||[]).length})</span><button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="text-[10px] font-medium" style={{color:B.accent}}>Все сообщения →</button></div>
        {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).slice(-2).map((m,j)=><div key={j} className="flex items-start gap-2 py-1"><span className="text-[10px] font-bold shrink-0" style={{color:m.from==="creditor"?B.accent:B.purple}}>{m.company.replace(/[«»ООО ОАО ЧУП ]/g,"").slice(0,10)}</span><span className="text-[10px] flex-1" style={{color:B.t2}}>{m.text}</span><span className="text-[9px] shrink-0" style={{color:B.t3}}>{m.time}</span></div>)}
        {(DEAL_MESSAGES_INIT[d.id]?.messages||[]).length===0&&<button onClick={e=>{e.stopPropagation();setInitialThread?.(d.id);setActive("cr-messages")}} className="text-[10px] font-medium flex items-center justify-center gap-1 py-2 w-full hover:bg-slate-50 rounded-lg" style={{color:B.accent}}><MessageCircle size={11}/>Начать обсуждение с контрагентом</button>}
      </div>
    </div></td></tr>}
    </Fragment>})}</tbody></table></Card>

    {/* === NEW DEAL WIZARD === */}
    <Modal open={showNew} onClose={()=>setShowNew(false)} title="Новая уступка" wide>
      <div className="mb-4">
        <div className="flex items-center gap-1 mb-6">{["Покупатель","Сумма и условия","Документы","Подтверждение ЭЦП"].map((s,i)=><div key={i} className="flex items-center gap-1.5 flex-1"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i<=wizStep?"text-white":"text-slate-400 bg-slate-100"}`} style={i<=wizStep?{background:B.accent}:undefined}>{i+1}</div><span className={`text-xs font-medium whitespace-nowrap ${i<=wizStep?"":"text-slate-400"}`}>{s}</span>{i<3&&<div className="flex-1 h-px bg-slate-200 mx-1"/>}</div>)}</div>

        {/* Step 0: Buyer */}
        {wizStep===0&&<div>
          <label className="block text-sm font-medium mb-2" style={{color:B.t1}}>Выберите покупателя (должника)</label>
          <div className="relative"><div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-400 cursor-text" onClick={()=>setDropOpen(true)}>
            <Search size={16} className="text-slate-400 shrink-0"/>
            <input value={selBuyer&&!dropOpen?"":buyerSearch} onChange={e=>{setBuyerSearch(e.target.value);setDropOpen(true);if(selBuyer)setNewDeal({...newDeal,buyerId:""})}} onFocus={()=>setDropOpen(true)} placeholder={selBuyer?selBuyer.name:"Название или УНП..."} className="flex-1 text-sm outline-none bg-transparent" />
            {selBuyer&&!dropOpen&&<button onClick={e=>{e.stopPropagation();setNewDeal({...newDeal,buyerId:""});setBuyerSearch("")}} className="p-0.5 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button>}
          </div>
          {dropOpen&&<div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-[220px] overflow-y-auto">{filteredBuyers.length>0?filteredBuyers.map(b=><button key={b.id} onClick={()=>{setNewDeal({...newDeal,buyerId:String(b.id)});setBuyerSearch("");setDropOpen(false)}} className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"><div className="min-w-0"><div className="text-sm font-medium" style={{color:B.t1}}>{b.name}</div><div className="text-xs" style={{color:B.t3,fontFamily:"'JetBrains Mono',monospace"}}>УНП {b.unp}</div></div><div className="text-right shrink-0 ml-3"><div className="text-xs" style={{color:B.green}}>Доступно: {fmtByn(b.available)}</div><div className="text-xs" style={{color:B.t3}}>Лимит: {fmtByn(b.limit)}</div></div></button>):<div className="px-4 py-6 text-center text-sm" style={{color:B.t3}}>Покупатель не найден</div>}</div>}
          {dropOpen&&<div className="fixed inset-0 z-10" onClick={()=>setDropOpen(false)}/>}
          </div>
          {selBuyer&&<div className="mt-3 rounded-xl p-3 flex items-center gap-3" style={{background:B.greenL}}><CheckCircle size={16} style={{color:B.green}}/><div className="flex-1"><div className="text-sm font-medium" style={{color:B.green}}>{selBuyer.name}</div><div className="text-xs" style={{color:B.t2}}>Лимит: {fmtByn(selBuyer.limit)} · Доступно: {fmtByn(selBuyer.available)}</div></div></div>}
          <div className="mt-4 flex justify-end"><Btn onClick={()=>setWizStep(1)} disabled={!newDeal.buyerId}>Далее</Btn></div>
        </div>}

        {/* Step 1: Amount + term + docType */}
        {wizStep===1&&<div>
          <label className="block text-sm font-medium mb-2">Тип документа</label>
          <div className="flex gap-3 mb-4">{[["ttn","ТТН (товары)"],["act","Акт выполн. работ (услуги)"]].map(([v,l])=><button key={v} onClick={()=>setNewDeal({...newDeal,docType:v})} className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${newDeal.docType===v?"text-white border-transparent":"border-slate-200 text-slate-600"}`} style={newDeal.docType===v?{background:B.accent}:undefined}>{l}</button>)}</div>
          <label className="block text-sm font-medium mb-2">Сумма уступки (BYN)</label>
          <input type="number" value={newDeal.amount} onChange={e=>{const v=e.target.value;if(v===""||(/^\d+$/.test(v)&&v.length<=12))setNewDeal({...newDeal,amount:v})}} placeholder="Введите сумму" className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 mb-1 ${newDeal.amount&&selBuyer&&Number(newDeal.amount)>selBuyer.available?"border-red-300 focus:ring-red-200":"border-slate-200 focus:ring-blue-200"}`}/>
          {selBuyer&&<div className="text-xs mb-3" style={{color:B.t3}}>Доступный лимит: <span className="font-bold" style={{color:Number(newDeal.amount||0)>selBuyer.available?B.red:B.green}}>{fmtByn(selBuyer.available)}</span></div>}
          {newDeal.amount&&selBuyer&&Number(newDeal.amount)>selBuyer.available&&<div className="rounded-xl p-3 mb-3 flex items-start gap-2" style={{background:B.redL}}><AlertTriangle size={16} style={{color:B.red}} className="shrink-0 mt-0.5"/><div className="text-xs" style={{color:B.red}}><strong>Сумма превышает доступный лимит</strong> покупателя {selBuyer.name} на {fmtByn(Number(newDeal.amount)-selBuyer.available)}. Максимум: {fmtByn(selBuyer.available)}</div></div>}
          <label className="block text-sm font-medium mb-2">Срок оплаты</label>
          <div className="flex gap-3 mb-4">{[30,60,90].map(t=><button key={t} onClick={()=>setNewDeal({...newDeal,term:t})} className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${newDeal.term===t?"text-white border-transparent":"border-slate-200 text-slate-600"}`} style={newDeal.term===t?{background:B.accent}:undefined}>{t} дней</button>)}</div>
          {newDeal.amount&&Number(newDeal.amount)>0&&<div className="rounded-xl p-4 space-y-2 text-sm" style={{background:B.accentL}}>
            <div className="flex justify-between"><span style={{color:B.t3}}>Сумма уступки</span><span className="font-bold">{fmtByn(Number(newDeal.amount))}</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Стоимость за {newDeal.term} дн.</span><span className="font-semibold" style={{color:B.accent}}>{periodRate}%</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Дисконт банка</span><span className="font-semibold" style={{color:B.red}}>− {fmtByn(discount)}</span></div>
            <div className="flex justify-between border-t pt-2" style={{borderColor:B.accent+"30"}}><span className="font-bold" style={{color:B.green}}>Вы получите на р/с</span><span className="font-bold text-lg" style={{color:B.green}}>{fmtByn(toReceive)}</span></div>
          </div>}
          <div className="mt-4 flex justify-between"><Btn variant="ghost" onClick={()=>setWizStep(0)} icon={ArrowLeft}>Назад</Btn><Btn onClick={()=>setWizStep(2)} disabled={!newDeal.amount||!selBuyer||(Number(newDeal.amount)>selBuyer.available)}>Далее</Btn></div>
        </div>}

        {/* Step 2: Documents */}
        {wizStep===2&&<div>
          <div className="rounded-xl p-4 mb-5" style={{background:"#F0F9FF",border:"1px solid #BAE6FD"}}><div className="flex items-start gap-3"><Info size={18} style={{color:B.accent}} className="mt-0.5 shrink-0"/><div className="text-sm" style={{color:B.t1}}><strong>Загрузите документы по отгрузке.</strong> Банк проверит и перечислит оплату на р/с в течение 3 рабочих дней. Допсоглашение сформируется автоматически.</div></div></div>
          <div className="space-y-3 mb-5">{[
            {key:"esf",label:"ЭСЧФ (электронный счёт-фактура)",required:true,desc:"Обязательный документ"},
            {key:"doc",label:newDeal.docType==="ttn"?"ТТН (товарно-транспортная накладная)":"Акт выполненных работ",required:true,desc:"Подтверждение отгрузки / оказания услуг"},
          ].map(doc=><div key={doc.key} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-0.5"><span className="text-sm font-medium" style={{color:B.t1}}>{doc.label}</span><span className="text-xs px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-medium">обязательно</span></div><div className="text-xs" style={{color:B.t3}}>{doc.desc}</div></div>
          <div className="ml-4 shrink-0">{uploadedDocs[doc.key]?<div className="flex items-center gap-2"><div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{background:B.greenL}}><CheckCircle size={14} style={{color:B.green}}/><span className="text-xs font-medium" style={{color:B.green}}>Загружен</span></div><button onClick={()=>setUploadedDocs(p=>({...p,[doc.key]:null}))} className="p-1 rounded hover:bg-slate-100"><X size={14} className="text-slate-400"/></button></div>:<Btn variant="secondary" size="sm" icon={Upload} onClick={()=>simulateUpload(doc.key)}>Загрузить</Btn>}</div></div>
          {uploadedDocs[doc.key]&&<div className="mt-2 flex items-center gap-3 text-xs pl-1" style={{color:B.t2}}><FileText size={12}/><span>{uploadedDocs[doc.key].name}</span><span>·</span><span>{uploadedDocs[doc.key].size}</span></div>}
          </div>)}</div>
          <div className="flex justify-between"><Btn variant="ghost" onClick={()=>setWizStep(1)} icon={ArrowLeft}>Назад</Btn><Btn onClick={()=>setWizStep(3)} disabled={!docsReady}>{docsReady?"Далее":"Загрузите документы"}</Btn></div>
        </div>}

        {/* Step 3: Confirm */}
        {wizStep===3&&<div>
          <div className="rounded-xl p-5 bg-slate-50 mb-4 space-y-2 text-sm">
            <div className="flex justify-between"><span style={{color:B.t3}}>Покупатель</span><span className="font-medium">{selBuyer?.name}</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Тип</span><span>{newDeal.docType==="ttn"?"ТТН":"Акт ВР"}</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Сумма уступки</span><span className="font-bold">{fmtByn(Number(newDeal.amount))}</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Срок</span><span>{newDeal.term} дней · ставка {periodRate}%</span></div>
            <div className="flex justify-between"><span style={{color:B.t3}}>Дисконт банка</span><span style={{color:B.red}}>− {fmtByn(discount)}</span></div>
            <div className="flex justify-between border-t pt-2 border-slate-200"><span className="font-bold" style={{color:B.green}}>К зачислению на р/с</span><span className="font-bold text-lg" style={{color:B.green}}>{fmtByn(toReceive)}</span></div>
          </div>
          <div className="rounded-xl p-3 mb-4" style={{background:B.greenL}}><div className="flex items-center gap-2 text-sm" style={{color:B.green}}><Shield size={16}/><span>Допсоглашение сформировано автоматически. После ЭЦП банк перечислит <strong>{fmtByn(toReceive)}</strong> в течение 3 рабочих дней.</span></div></div>
          <div className="flex justify-between"><Btn variant="ghost" onClick={()=>setWizStep(2)} icon={ArrowLeft}>Назад</Btn><Btn variant="success" icon={Pen} onClick={()=>{setShowNew(false);setToast({msg:"Уступка создана и подписана ЭЦП! Документы отправлены в банк.",type:"success"});onSuccess&&onSuccess()}}>Подписать ЭЦП и отправить</Btn></div>
        </div>}
      </div>
    </Modal>
  </>}
  </div>;
};

const CrSettings = ({dark,setDark}) => {
  const [toast,setToast]=useState(null);
  const [notifSettings,setNotifSettings]=useState({newDeal:{email:true,sms:true},buyerPaid:{email:true,sms:false},overdue:{email:true,sms:true},limitRestored:{email:true,sms:false},quarterly:{email:true,sms:true}});
  const [showAddUser,setShowAddUser]=useState(false);
  const [newUserName,setNewUserName]=useState("");
  const [newUserEmail,setNewUserEmail]=useState("");
  const [newUserRole,setNewUserRole]=useState("view");
  const [users,setUsers]=useState([{name:"Дерябина Ольга",email:"info@sitibeton.by",role:"Полный доступ"},{name:"Козлов Дмитрий",email:"sales@sitibeton.by",role:"Только скоринг"}]);

  const Toggle=({on,onChange})=><button onClick={onChange} className="relative w-10 h-6 rounded-full transition-colors" style={{background:on?B.accent:"#CBD5E1"}}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${on?"left-5":"left-1"}`}/></button>;

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Настройки" subtitle="Профиль, пользователи, уведомления, безопасность"/>
    <div className="space-y-5">
      <Card className="p-5"><div className="flex items-center justify-between"><div><h3 className="font-semibold" style={{color:B.t1}}>Тёмная тема</h3><p className="text-xs" style={{color:B.t3}}>Переключить оформление</p></div><Toggle on={dark} onChange={()=>setDark(!dark)}/></div></Card>

      <Card className="p-5"><h3 className="font-semibold mb-3" style={{color:B.t1}}>Данные компании</h3><div className="grid grid-cols-2 gap-3 text-sm">{Object.entries({Название:COMPANY.name,УНП:COMPANY.unp,Адрес:COMPANY.address,Директор:COMPANY.director,Телефон:COMPANY.phone,Email:COMPANY.email}).map(([k,v])=><div key={k} className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}>{k}</div><div className="font-medium mt-0.5 break-words" style={{color:B.t1}}>{v}</div></div>)}</div></Card>

      {/* Users */}
      <Card className="p-5"><div className="flex items-center justify-between mb-4"><InfoTooltip text="Сотрудники вашей компании с доступом к платформе"><h3 className="font-semibold border-b border-dotted border-slate-300 cursor-help" style={{color:B.t1}}>Пользователи ({users.length})</h3></InfoTooltip><Btn size="sm" icon={UserPlus} onClick={()=>setShowAddUser(true)}>Пригласить</Btn></div>
        <div className="space-y-2">{users.map((u,i)=><div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:`linear-gradient(135deg,${B.accent},${B.purple})`}}>{u.name.split(" ").map(w=>w[0]).join("")}</div>
          <div className="flex-1 min-w-0"><div className="text-sm font-medium" style={{color:B.t1}}>{u.name}</div><div className="text-xs" style={{color:B.t3}}>{u.email}</div></div>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100" style={{color:B.t2}}>{u.role}</span>
        </div>)}</div>
        <Modal open={showAddUser} onClose={()=>setShowAddUser(false)} title="Пригласить пользователя">
          <div className="space-y-4">
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>ФИО</label><input value={newUserName} onChange={e=>setNewUserName(e.target.value)} placeholder="Иванов Иван" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Email</label><input value={newUserEmail} onChange={e=>setNewUserEmail(e.target.value)} placeholder="ivanov@company.by" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/></div>
            <div><label className="block text-xs font-medium mb-1" style={{color:B.t3}}>Роль</label><select value={newUserRole} onChange={e=>setNewUserRole(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm"><option value="full">Полный доступ</option><option value="scoring">Только скоринг</option><option value="view">Только просмотр</option></select></div>
            <Btn className="w-full" icon={Send} onClick={()=>{if(newUserName&&newUserEmail){setUsers(p=>[...p,{name:newUserName,email:newUserEmail,role:newUserRole==="full"?"Полный доступ":newUserRole==="scoring"?"Только скоринг":"Только просмотр"}]);setShowAddUser(false);setNewUserName("");setNewUserEmail("");setToast({msg:`Приглашение отправлено на ${newUserEmail}`,type:"success"})}}}>Отправить приглашение</Btn>
          </div>
        </Modal>
      </Card>

      {/* Notifications */}
      <Card className="p-5"><h3 className="font-semibold mb-4" style={{color:B.t1}}>Уведомления</h3>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-xs border-b border-slate-100" style={{color:B.t3}}><th className="pb-2 text-left font-medium">Событие</th><th className="pb-2 text-center font-medium w-16">Email</th><th className="pb-2 text-center font-medium w-16">SMS</th></tr></thead>
        <tbody>{[{key:"newDeal",label:"Новая уступка создана"},{key:"buyerPaid",label:"Покупатель оплатил"},{key:"overdue",label:"Просрочка по уступке"},{key:"limitRestored",label:"Лимит восстановлен"},{key:"quarterly",label:"Квартальная отчётность"}].map(n=><tr key={n.key} className="border-b border-slate-50"><td className="py-3" style={{color:B.t1}}>{n.label}</td>
          <td className="py-3 text-center"><Toggle on={notifSettings[n.key].email} onChange={()=>setNotifSettings(p=>({...p,[n.key]:{...p[n.key],email:!p[n.key].email}}))}/></td>
          <td className="py-3 text-center"><Toggle on={notifSettings[n.key].sms} onChange={()=>setNotifSettings(p=>({...p,[n.key]:{...p[n.key],sms:!p[n.key].sms}}))}/></td>
        </tr>)}</tbody></table></div>
      </Card>

      {/* Security */}
      <Card className="p-5"><h3 className="font-semibold mb-3" style={{color:B.t1}}>Безопасность</h3>
        <div className="space-y-2 text-sm">{[["Последний вход","22 мар 2026, 14:30"],["IP-адрес","178.123.45.67"],["ЭЦП","Действительна до 15.01.2027"]].map(([l,v],i)=><div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50"><span style={{color:B.t3}}>{l}</span><span className="font-medium" style={{color:B.t1,fontFamily:i===1?"'JetBrains Mono',monospace":undefined}}>{v}</span></div>)}</div>
        <div className="flex gap-2 mt-3"><Btn size="sm" variant="secondary" onClick={()=>setToast({msg:"Функция в разработке",type:"info"})}>Сменить пароль</Btn><Btn size="sm" variant="secondary" onClick={()=>setToast({msg:"Функция в разработке",type:"info"})}>Обновить ЭЦП</Btn></div>
      </Card>

      {/* Tariffs */}
      <Card className="p-5"><h3 className="font-semibold mb-3" style={{color:B.t1}}>Стоимость факторинга по покупателям</h3><table className="w-full text-sm"><thead><tr className="text-xs border-b border-slate-100" style={{color:B.t3}}><th className="pb-2 text-left font-medium">Покупатель</th><th className="pb-2 text-center font-medium">30 дн</th><th className="pb-2 text-center font-medium">60 дн</th><th className="pb-2 text-center font-medium">90 дн</th></tr></thead><tbody>{BUYERS.filter(b=>b.status==="green"&&b.rate>0).map(b=><TableRow key={b.id}><td className="py-2"><div className="font-medium" style={{color:B.t1}}>{b.name}</div></td><td className="py-2 text-center font-bold" style={{color:B.accent}}>{calcPeriodRate(b.rate,30)}%</td><td className="py-2 text-center font-bold" style={{color:B.accent}}>{calcPeriodRate(b.rate,60)}%</td><td className="py-2 text-center font-bold" style={{color:B.accent}}>{calcPeriodRate(b.rate,90)}%</td></TableRow>)}</tbody></table></Card>
    </div>
  </div>;
};

const DbSettings = ({dark,setDark}) => <CrSettings dark={dark} setDark={setDark}/>;

// ═══ PARTNERS PAGE (shared for both contexts) ═══════════
const PartnersPage = ({ctx,setActive}) => {
  const [industry,setIndustry]=useState("Все отрасли");
  const [search,setSearch]=useState("");
  const [selectedPartner,setSelectedPartner]=useState(null);
  const [viewProfile,setViewProfile]=useState(null);
  const [toast,setToast]=useState(null);
  const accent=ctx==="creditor"?B.accent:B.purple;
  const filtered=PLATFORM_PARTNERS.filter(p=>{
    if(industry!=="Все отрасли"&&p.industry!==industry) return false;
    if(search&&!p.name.toLowerCase().includes(search.toLowerCase())&&!p.unp.includes(search)) return false;
    return true;
  });

  // Profile view
  if(viewProfile) {
    const p=viewProfile;const ic=INDUSTRY_COLORS[p.industry]||B.accent;
    const shareText=`Рекомендую компанию ${p.name} на платформе Oborotka.by.\nВерифицирована на платформе Oborotka.by.\nФакторинг — получите деньги за 3 дня.\nПрофиль: oborotka.by/partner/${p.unp}`;
    return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <button onClick={()=>setViewProfile(null)} className="flex items-center gap-1.5 text-sm font-medium mb-4 hover:underline" style={{color:accent}}><ArrowLeft size={16}/>Назад к маркетплейсу</button>

      <Card className="p-6 mb-5">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0" style={{background:ic}}>{p.name.replace(/[«»ООО ОАО ЧУП СООО КСУП ]/g,"").slice(0,2)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap"><h1 className="text-xl font-bold" style={{color:B.t1}}>{p.name}</h1><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{background:B.greenL,color:B.green}}><Shield size={10}/>Верифицирован</span></div>
            <div className="text-sm mt-1" style={{color:B.t3}}>УНП {p.unp} · {p.industry} · {p.category} · {p.city}</div>
            <div className="text-sm mt-1" style={{color:B.t2}}>На платформе с {p.since}</div>
            <div className="flex gap-2 mt-3">
              <Btn icon={Zap} onClick={()=>setToast({msg:`Запрос на сотрудничество с ${p.name} отправлен`,type:"success"})}>Запросить сотрудничество</Btn>
              <Btn variant="secondary" icon={ExternalLink} onClick={()=>{copyText(`oborotka.by/partner/${p.unp}`);setToast({msg:"Ссылка скопирована",type:"success"})}}>Скопировать ссылку</Btn>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-sm mb-3" style={{color:B.t1}}>О компании</h3>
          <p className="text-sm leading-relaxed" style={{color:B.t2}}>{p.description}</p>
          {p.products&&<div className="mt-4"><div className="text-xs font-medium mb-2" style={{color:B.t3}}>Продукция / услуги</div><div className="flex flex-wrap gap-1.5">{p.products.map((pr,i)=><span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-slate-50 border border-slate-100" style={{color:B.t1}}>{pr}</span>)}</div></div>}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-3" style={{color:B.t1}}>Условия факторинга</h3>
          <div className="space-y-3">
            <div><span className="text-xs" style={{color:B.t3}}>Доступные сроки отсрочки</span><div className="flex gap-1.5 mt-1">{p.terms.map(t=><span key={t} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{background:accent+"15",color:accent}}>{t} дн.</span>)}</div></div>
          </div>
          <div className="mt-4 rounded-xl p-3" style={{background:accent+"08"}}><div className="text-xs leading-relaxed" style={{color:accent}}>Работая через Oborotka.by, вы получаете финансирование за 3 рабочих дня. Риск неоплаты — на банке.</div></div>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        {[{v:p.deals,l:"Уступок",c:B.accent},{v:p.partners,l:"Партнёров",c:B.purple},{v:p.overdue,l:"Просрочек",c:p.overdue>0?B.red:B.green},{v:p.lastActive,l:"Последняя активность",c:B.t1}].map((s,i)=><Card key={i} className="p-4 text-center"><div className="text-lg font-bold" style={{color:s.c}}>{s.v}</div><div className="text-xs" style={{color:B.t3}}>{s.l}</div></Card>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-3" style={{color:B.t1}}>Контакты</h3>
          <div className="space-y-2">{[
            {icon:Building2,label:p.city},
            {icon:Phone,label:p.phone},
            {icon:ExternalLink,label:p.website},
            {icon:MessageSquare,label:p.email},
          ].map((c,i)=><div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"><c.icon size={14} style={{color:accent}}/><span className="text-sm" style={{color:B.t1}}>{c.label}</span></div>)}</div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-3" style={{color:B.t1}}>Поделиться профилем</h3>
          <div className="rounded-xl p-3 bg-slate-50 mb-3"><div className="text-xs font-mono break-all" style={{color:accent}}>oborotka.by/partner/{p.unp}</div></div>
          <div className="flex gap-2">
            <Btn size="sm" icon={ExternalLink} onClick={()=>{copyText(`oborotka.by/partner/${p.unp}`);setToast({msg:"Ссылка скопирована",type:"success"})}}>Скопировать ссылку</Btn>
            <Btn size="sm" variant="secondary" icon={Send} onClick={()=>{copyText(shareText);setToast({msg:"Текст для отправки скопирован — вставьте в мессенджер",type:"success"})}}>Отправить коллеге</Btn>
          </div>
          <div className="mt-3 rounded-xl p-3 border border-slate-200 text-xs whitespace-pre-line" style={{color:B.t2}}>{shareText}</div>
        </Card>
      </div>
    </div>;
  }

  // Marketplace view
  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title="Партнёры платформы" subtitle={`${PLATFORM_PARTNERS.length} верифицированных компаний на Oborotka.by`}/>
    <Card className="p-4 mb-5" style={{background:accent+"08",borderColor:accent+"30"}}><div className="flex items-start gap-3"><Info size={16} style={{color:accent}} className="shrink-0 mt-0.5"/><div className="text-xs" style={{color:B.t1}}><strong>Маркетплейс партнёров</strong> — верифицированные компании, уже работающие на платформе. {ctx==="creditor"?"Найдите нового покупателя или поставщика.":"Найдите поставщика с факторингом."}</div></div></Card>
    <div className="flex gap-3 mb-5"><div className="flex flex-wrap gap-1.5">{INDUSTRIES.map(ind=><button key={ind} onClick={()=>setIndustry(ind)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${industry===ind?"text-white":"text-slate-500 bg-slate-50 hover:bg-slate-100"}`} style={industry===ind?{background:accent}:undefined}>{ind}</button>)}</div><div className="relative ml-auto"><Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск..." className="pl-8 pr-3 py-1.5 w-48 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"/></div></div>
    {filtered.length===0?<Card className="p-12 text-center"><Search size={32} className="mx-auto mb-3 text-slate-300"/><div className="text-sm" style={{color:B.t3}}>Нет компаний по вашему запросу</div></Card>
    :<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">{filtered.map(p=>{const ic=INDUSTRY_COLORS[p.industry]||B.accent;return <Card key={p.id} className="p-4 cursor-pointer transition-all hover:shadow-md" hover onClick={()=>setViewProfile(p)}>
        <div className="flex items-start gap-3"><div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0" style={{background:ic}}>{p.name.replace(/[«»ООО ОАО ЧУП СООО КСУП ]/g,"").slice(0,2)}</div><div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate" style={{color:B.t1}}>{p.name}</div><div className="text-xs mt-0.5" style={{color:B.t3}}>УНП {p.unp} · {p.city}</div>
          <div className="flex items-center gap-2 mt-2"><span className="px-2 py-0.5 rounded-lg text-[10px] font-medium" style={{background:ic+"15",color:ic}}>{p.industry}</span></div></div></div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]"><span style={{color:B.t3}}>{p.deals} уступок · {p.overdue} просрочек</span><span style={{color:B.green}}>✓ Верифицирован</span></div>
      </Card>})}</div>}
  </div>;
};

const PROFILE_SECTIONS = [
  {id:"general",num:"1",title:"Общие сведения",fields:[
    {key:"fullName",label:"Полное наименование",value:COMPANY.name},
    {key:"shortName",label:"Сокращённое наименование",value:"СитиБетонСтрой"},
    {key:"nameEn",label:"Наименование на англ. языке",value:"SitiBetonStroy LLC"},
    {key:"regOrgan",label:"Регистрирующий орган",value:"Минский облисполком"},
    {key:"regNumber",label:"Регистрационный номер (УНП)",value:COMPANY.unp},
    {key:"regDate",label:"Дата регистрации",value:"12.05.2008"},
    {key:"okedMain",label:"Основной вид деятельности (ОКЭД)",value:"23610 — Производство бетонных изделий"},
    {key:"okedOther",label:"Другие виды деятельности",value:"46730 — Оптовая торговля стройматериалами"},
    {key:"legalCountry",label:"Страна",value:"Республика Беларусь"},
    {key:"legalRegion",label:"Регион",value:"Минская область, Минский район"},
    {key:"legalCity",label:"Населённый пункт",value:"аг. Ждановичи"},
    {key:"legalStreet",label:"Улица, дом, офис",value:"ул. Зелёная, 1В, пом. 30"},
    {key:"jurAddress",label:"Юридический адрес (если отличается)",value:"—"},
    {key:"employees",label:"Среднесписочная численность",value:"47 человек"},
    {key:"bankRelation",label:"Вид договорных отношений с Банком",value:"Факторинг"},
    {key:"capitalSize",label:"Размер уставного фонда",value:"15 000 BYN"},
    {key:"sanctions",label:"Включение в санкционные списки",value:"Нет"},
    {key:"sanctionContacts",label:"Контрагенты из санкц. списков",value:"Нет"},
    {key:"managementStructure",label:"Структура органов управления",value:"Единоличный исполнительный орган — директор"},
    {key:"email",label:"Email",value:COMPANY.email},
    {key:"website",label:"Сайт",value:"sitibeton.by"},
  ]},
  {id:"fatca",num:"2",title:"FATCA-идентификация",fields:[
    {key:"isUsTaxpayer",label:"Является налогоплательщиком США?",value:"Нет"},
    {key:"hasBeneficiaryUs",label:"Бенефициары — налогоплательщики США?",value:"Нет"},
    {key:"isFinInstitution",label:"Финансовое учреждение для целей FATCA?",value:"Нет"},
  ]},
  {id:"contacts",num:"3",title:"Контактные данные",subsections:[
    {title:"Контакт",addLabel:"Добавить контакт",templateFields:["ФИО","Должность","Телефон","Email"],entries:[
      {fields:[{key:"c1n",label:"ФИО",value:"Дерябина Ольга Николаевна"},{key:"c1p",label:"Должность",value:"Директор"},{key:"c1t",label:"Телефон",value:COMPANY.phone},{key:"c1e",label:"Email",value:COMPANY.email}]},
      {fields:[{key:"c2n",label:"ФИО",value:"Петрова Елена Сергеевна"},{key:"c2p",label:"Должность",value:"Главный бухгалтер"},{key:"c2t",label:"Телефон",value:"+375 (29) 123-45-67"},{key:"c2e",label:"Email",value:"petrova@sitibeton.by"}]},
    ]},
  ]},
  {id:"directors",num:"4",title:"Руководитель и главный бухгалтер",subsections:[
    {title:"Руководитель",addLabel:"Добавить руководителя",templateFields:["ФИО","Должность","Гражданство","Дата рождения","Место рождения","Место жительства","Паспорт (серия, номер)","Кем выдан","Когда выдан","Личный номер"],entries:[
      {fields:[{key:"d1n",label:"ФИО",value:COMPANY.director},{key:"d1pos",label:"Должность",value:"Директор"},{key:"d1cit",label:"Гражданство",value:"Республика Беларусь"},{key:"d1bd",label:"Дата рождения",value:"15.07.1978"},{key:"d1bp",label:"Место рождения",value:"г. Минск"},{key:"d1addr",label:"Место жительства",value:"г. Минск, ул. Притыцкого, 83-45"},{key:"d1pass",label:"Паспорт (серия, номер)",value:"BM 2345678"},{key:"d1passby",label:"Кем выдан",value:"Фрунзенским РУВД г. Минска"},{key:"d1passdt",label:"Когда выдан",value:"12.03.2020"},{key:"d1pnum",label:"Личный номер",value:"7150778A001PB5"}]}
    ]},
    {title:"Главный бухгалтер",addLabel:"Добавить бухгалтера",templateFields:["ФИО","Гражданство","Дата рождения","Паспорт (серия, номер)","Кем выдан","Личный номер"],entries:[
      {fields:[{key:"a1n",label:"ФИО",value:"Петрова Елена Сергеевна"},{key:"a1cit",label:"Гражданство",value:"Республика Беларусь"},{key:"a1bd",label:"Дата рождения",value:"03.11.1982"},{key:"a1pass",label:"Паспорт (серия, номер)",value:"BM 3456789"},{key:"a1passby",label:"Кем выдан",value:"Центральным РУВД г. Минска"},{key:"a1pnum",label:"Личный номер",value:"3031182A002PB7"}]}
    ]},
  ]},
  {id:"authorizedPersons",num:"5",title:"Иные уполномоченные лица",subsections:[
    {title:"Уполномоченное лицо",addLabel:"Добавить лицо",templateFields:["ФИО","Должность","Основание полномочий","Паспорт"],entries:[
      {fields:[{key:"ap1n",label:"ФИО",value:"Сидоров Пётр Иванович"},{key:"ap1pos",label:"Должность",value:"Заместитель директора"},{key:"ap1basis",label:"Основание полномочий",value:"Доверенность №12 от 01.02.2026"},{key:"ap1pass",label:"Паспорт",value:"BM 4567890"}]}
    ]},
  ]},
  {id:"representatives",num:"6",title:"Представители организации",subsections:[
    {title:"Представитель",addLabel:"Добавить представителя",templateFields:["ФИО","Основание полномочий","Реквизиты доверенности"],entries:[
      {fields:[{key:"rp1n",label:"ФИО",value:"Козлов Андрей Михайлович"},{key:"rp1basis",label:"Основание полномочий",value:"Доверенность"},{key:"rp1doc",label:"Реквизиты доверенности",value:"№15 от 10.01.2026, до 31.12.2026"}]}
    ]},
  ]},
  {id:"managementParticipation",num:"7",title:"Участие руководства в других организациях",fields:[
    {key:"dirOtherOrgs",label:"Руководитель — учредитель/руководитель других организаций (доля >25%)?",value:"Нет"},
  ]},
  {id:"beneficiaries",num:"8",title:"Бенефициарные владельцы",subsections:[
    {title:"Бенефициарный владелец",addLabel:"Добавить бенефициара",templateFields:["ФИО","Доля","Гражданство","Дата рождения","Паспорт"],entries:[
      {fields:[{key:"bn1n",label:"ФИО",value:COMPANY.director},{key:"bn1sh",label:"Доля",value:"100%"},{key:"bn1cit",label:"Гражданство",value:"Республика Беларусь"},{key:"bn1bd",label:"Дата рождения",value:"15.07.1978"},{key:"bn1pass",label:"Паспорт",value:"BM 2345678"}]}
    ]},
  ]},
  {id:"founders",num:"9",title:"Учредители (участники)",subsections:[
    {title:"Учредитель",addLabel:"Добавить учредителя",templateFields:["Тип (ЮЛ/ФЛ)","Наименование / ФИО","Доля в уставном фонде","УНП / паспорт","Гражданство / страна","Дата рождения"],entries:[
      {fields:[{key:"f1type",label:"Тип",value:"Юридическое лицо"},{key:"f1name",label:"Наименование",value:'ООО «ТехноИнвест»'},{key:"f1share",label:"Доля в уставном фонде",value:"60%"},{key:"f1unp",label:"УНП",value:"190456789"},{key:"f1country",label:"Страна регистрации",value:"Республика Беларусь"},{key:"f1bd",label:"Дата регистрации",value:"14.09.2005"}]},
      {fields:[{key:"f2type",label:"Тип",value:"Физическое лицо"},{key:"f2name",label:"ФИО",value:COMPANY.director},{key:"f2share",label:"Доля в уставном фонде",value:"40%"},{key:"f2unp",label:"Паспорт",value:"BM 2345678"},{key:"f2country",label:"Гражданство",value:"Республика Беларусь"},{key:"f2bd",label:"Дата рождения",value:"15.07.1978"}]}
    ]},
  ]},
  {id:"foundersOtherOrgs",num:"10",title:"Участие учредителей в других организациях",fields:[
    {key:"foundersInOther",label:"Учредители с долей >25% в других организациях?",value:"Нет"},
  ]},
  {id:"bankAccounts",num:"11",title:"Счета в других банках",subsections:[
    {title:"Счёт",addLabel:"Добавить счёт",templateFields:["Банк","БИК","Номер счёта","Валюта"],entries:[
      {fields:[{key:"ba1bank",label:"Банк",value:'ОАО «Беларусбанк»'},{key:"ba1bik",label:"БИК",value:"AKBBBY2X"},{key:"ba1acc",label:"Номер счёта",value:COMPANY.account},{key:"ba1cur",label:"Валюта",value:"BYN"}]}
    ]},
  ]},
  {id:"turnover",num:"12",title:"Обороты по счёту, годовая выручка",fields:[
    {key:"monthlyTurnover",label:"Среднемесячный оборот",value:"~850 000 BYN"},
    {key:"cashTurnover",label:"В т.ч. оборот наличных",value:"~15 000 BYN"},
    {key:"yearRevenue",label:"Объём годовой выручки",value:"~9 200 000 BYN"},
  ]},
  {id:"counterparties",num:"13",title:"Постоянные контрагенты",subsections:[
    {title:"Контрагент",addLabel:"Добавить контрагента",templateFields:["Наименование","Тип (покупатель/поставщик)","Валюта расчётов","Среднемесячный оборот"],entries:[
      {fields:[{key:"cp1n",label:"Наименование",value:'ООО «БелТехСнаб»'},{key:"cp1t",label:"Тип",value:"Покупатель"},{key:"cp1c",label:"Валюта",value:"BYN"},{key:"cp1v",label:"Среднемесячный оборот",value:"~180 000 BYN"}]},
      {fields:[{key:"cp2n",label:"Наименование",value:'ООО «ГрандЛогистик»'},{key:"cp2t",label:"Тип",value:"Покупатель"},{key:"cp2c",label:"Валюта",value:"BYN"},{key:"cp2v",label:"Среднемесячный оборот",value:"~250 000 BYN"}]},
      {fields:[{key:"cp3n",label:"Наименование",value:'ОАО «БЦК»'},{key:"cp3t",label:"Тип",value:"Поставщик"},{key:"cp3c",label:"Валюта",value:"BYN"},{key:"cp3v",label:"Среднемесячный оборот",value:"~300 000 BYN"}]},
    ]},
  ]},
  {id:"history",num:"14",title:"История деятельности",fields:[
    {key:"reorgs",label:"Реорганизации",value:"Не проводились"},
    {key:"activityChanges",label:"Изменения в характере деятельности",value:"Нет"},
  ]},
  {id:"branches",num:"15",title:"Филиалы, представительства, дочерние организации",subsections:[
    {title:"Филиал",addLabel:"Добавить филиал",templateFields:["Наименование","Адрес","Руководитель"],entries:[]},
  ]},
  {id:"parentOrg",num:"16",title:"Головная организация",fields:[
    {key:"parentOrg",label:"Головная организация",value:"Не применимо (самостоятельное ЮЛ)"},
  ]},
  {id:"controllingOrgs",num:"17",title:"Организации, определяющие решения",fields:[
    {key:"controllingOrgs",label:"Контролирующие организации",value:"Отсутствуют"},
  ]},
  {id:"influencedOrgs",num:"18",title:"Организации, на которые оказывается влияние",fields:[
    {key:"influencedOrgs",label:"Организации под влиянием",value:"Отсутствуют"},
  ]},
];

const CompanyProfile = ({ctx,isActualization,onComplete,onDirtyChange}) => {
  const accent = ctx==="creditor"?B.accent:B.purple;
  const [activeSection,setActiveSection]=useState("general");
  const [editValues,setEditValues]=useState({});
  const [toast,setToast]=useState(null);
  const [sectionSigning,setSectionSigning]=useState(null);
  const [signedFields,setSignedFields]=useState(new Set());
  const [addedEntries,setAddedEntries]=useState({});

  const handleFieldChange=(key,val)=>{
    const nv={...editValues,[key]:val};
    const field=PROFILE_SECTIONS.flatMap(s=>s.fields?s.fields:s.subsections?s.subsections.flatMap(sub=>sub.entries.flatMap(e=>e.fields)):[]).find(f=>f.key===key);
    if(field&&val===field.value){delete nv[key]}
    setEditValues(nv);
  };
  const getVal=(key,original)=>editValues[key]!==undefined?editValues[key]:original;
  const isFieldChanged=(key,original)=>editValues[key]!==undefined&&editValues[key]!==original;

  const sectionChanges = useMemo(()=>{
    const map={};
    PROFILE_SECTIONS.forEach(s=>{const allFields=s.fields?s.fields:s.subsections?s.subsections.flatMap(sub=>sub.entries.flatMap(e=>e.fields)):[];map[s.id]=allFields.filter(f=>isFieldChanged(f.key,f.value)).map(f=>f.key)});
    return map;
  },[editValues]);

  const sectionHasChanges=(sid)=>(sectionChanges[sid]||[]).length>0;
  const totalChangedFields=Object.values(sectionChanges).reduce((s,a)=>s+a.length,0);
  const sectionsWithChanges=PROFILE_SECTIONS.filter(s=>sectionHasChanges(s.id));
  const currentSectionChangedFields=sectionChanges[activeSection]||[];

  // Report dirty state to parent for exit guard
  const unsignedCount=Object.values(sectionChanges).flat().filter(k=>!signedFields.has(k)).length;
  useEffect(()=>{if(onDirtyChange) onDirtyChange(unsignedCount>0)},[unsignedCount]);

  const section=PROFILE_SECTIONS.find(s=>s.id===activeSection);

  return <div>{toast&&<Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    <PageHeader title={isActualization?"Актуализация данных компании":"Анкета компании"} subtitle="Приложение 12 — Вопросник для клиента-организации"/>

    {totalChangedFields>0&&<Card className="p-4 mb-5" style={{background:"#FFF7ED",borderColor:"#FED7AA"}}>
      <div className="flex items-center gap-3"><Pen size={16} style={{color:B.orange}}/><div className="flex-1">
        <div className="text-sm font-bold" style={{color:B.t1}}>Изменено: {totalChangedFields} пол{totalChangedFields===1?"е":totalChangedFields<5?"я":"ей"} в {sectionsWithChanges.length} раздел{sectionsWithChanges.length===1?"е":"ах"}</div>
        <div className="text-xs mt-0.5" style={{color:B.t2}}>{sectionsWithChanges.map(s=>s.title).join(" · ")}</div>
      </div></div>
    </Card>}

    <div className="flex gap-5">
      <div className="w-64 shrink-0"><Card className="overflow-hidden sticky top-24">
        <div className="px-4 py-3 border-b border-slate-100" style={{background:"#FAFBFC"}}><span className="text-xs font-bold" style={{color:B.t1}}>Разделы ({PROFILE_SECTIONS.length})</span></div>
        <div className="max-h-[60vh] overflow-y-auto py-1">
          {PROFILE_SECTIONS.map(s=>{const isAct=activeSection===s.id;const hasChg=sectionHasChanges(s.id);const allFieldsSigned=hasChg&&(sectionChanges[s.id]||[]).every(k=>signedFields.has(k));return <button key={s.id} onClick={()=>setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-4 py-2 text-left text-xs transition-colors ${isAct?"font-bold":"hover:bg-slate-50"}`} style={{color:isAct?accent:B.t1,background:isAct?accent+"10":"transparent"}}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={allFieldsSigned?{background:B.greenL,color:B.green}:hasChg?{background:B.yellowL,color:B.orange}:{background:"#f1f5f9",color:B.t3}}>{allFieldsSigned?<Check size={10}/>:hasChg?<Pen size={9}/>:s.num}</span>
            <span className="truncate flex-1">{s.title}</span>
            {hasChg&&!allFieldsSigned&&<span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:B.orange}}/>}
              {allFieldsSigned&&<span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:B.green}}/>}
          </button>})}
        </div>
        {totalChangedFields>0&&<div className="p-3 border-t border-slate-100"><div className="text-[10px]" style={{color:B.orange}}>Изменено полей: {totalChangedFields}</div></div>}
      </Card></div>

      <div className="flex-1 min-w-0">
        {section&&<Card className="mb-5 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between" style={{background:"#FAFBFC"}}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:accent}}>{section.num}</span>
              <h3 className="font-bold text-sm" style={{color:B.t1}}>{section.title}</h3>
              {currentSectionChangedFields.length>0&&(()=>{const allSgn=currentSectionChangedFields.every(k=>signedFields.has(k));return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{background:allSgn?B.greenL:B.yellowL,color:allSgn?B.green:B.orange}}>{allSgn?<Shield size={10}/>:<Pen size={10}/>}{currentSectionChangedFields.length} изм.{allSgn?" ЭЦП":""}</span>})()}
            </div>
          </div>
          <div className="p-6">
            {section.fields?<div className="space-y-3">
              {section.fields.map(f=>{const changed=isFieldChanged(f.key,f.value);return <div key={f.key} className={`flex items-start gap-4 rounded-xl px-3 py-2 -mx-3 transition-colors ${changed?"border-l-[3px]":""}`} style={changed?{background:"#FFF7ED",borderColor:B.orange}:undefined}>
                <div className="w-1/3 shrink-0 pt-2"><label className="text-xs font-medium" style={{color:changed?B.orange:B.t3}}>{f.label}{changed&&<span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-bold" style={{background:B.orange,color:"white"}}>изменено</span>}</label>{changed&&<div className="text-[10px] mt-0.5 line-through" style={{color:B.t3}}>{f.value}</div>}</div>
                <div className="flex-1"><input value={getVal(f.key,f.value)} onChange={e=>handleFieldChange(f.key,e.target.value)} className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 ${changed?"border-orange-300 bg-orange-50/50":"border-slate-200"}`} style={{"--tw-ring-color":accent+"40"}}/></div>
              </div>})}
            </div>

            :section.subsections?<div className="space-y-5">
              {section.subsections.map((sub,si)=><div key={si}>
                {[...sub.entries,...(addedEntries[`${section.id}:${sub.title}`]||[])].map((entry,ei)=><div key={ei} className="rounded-xl border border-slate-200 p-4 mb-3">
                  <div className="flex items-center justify-between mb-3"><span className="text-sm font-bold" style={{color:B.t1}}>{sub.title}{sub.entries.length+(addedEntries[`${section.id}:${sub.title}`]||[]).length>1?` ${ei+1}`:""}</span>{ei>=sub.entries.length&&<button onClick={()=>{const key=`${section.id}:${sub.title}`;setAddedEntries(p=>({...p,[key]:(p[key]||[]).filter((_,i)=>i!==(ei-sub.entries.length))}));setToast({msg:"Удалено",type:"info"})}} className="p-1 rounded hover:bg-red-50"><X size={14} className="text-slate-400 hover:text-red-500"/></button>}</div>
                  <div className="space-y-2">{entry.fields.map(f=>{const changed=isFieldChanged(f.key,f.value);return <div key={f.key} className={`flex items-start gap-4 rounded-lg px-2 py-1.5 -mx-2 ${changed?"border-l-[3px]":""}`} style={changed?{background:"#FFF7ED",borderColor:B.orange}:undefined}>
                    <div className="w-1/3 shrink-0 pt-1.5"><label className="text-xs font-medium" style={{color:changed?B.orange:B.t3}}>{f.label}</label></div>
                    <div className="flex-1"><input value={getVal(f.key,f.value)} onChange={e=>handleFieldChange(f.key,e.target.value)} className={`w-full px-3 py-1.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${changed?"border-orange-300 bg-orange-50/50":"border-slate-200"}`} style={{"--tw-ring-color":accent+"40"}}/></div>
                  </div>})}</div>
                </div>)}
                <button onClick={()=>{const key=`${section.id}:${sub.title}`;const newEntry={fields:(sub.templateFields||[]).map((l,i)=>({key:`${key}_new_${Date.now()}_${i}`,label:l,value:""}))};setAddedEntries(p=>({...p,[key]:[...(p[key]||[]),newEntry]}));setToast({msg:`${sub.title} добавлен`,type:"success"})}} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors" style={{color:accent}}><Plus size={13}/>{sub.addLabel}</button>
              </div>)}
            </div>:null}
            {currentSectionChangedFields.length>0&&!currentSectionChangedFields.every(k=>signedFields.has(k))&&<div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs" style={{color:B.orange}}>{currentSectionChangedFields.length} изменённ{currentSectionChangedFields.length===1?"ое поле":"ых полей"}</span>
              <Btn size="sm" icon={sectionSigning===section.id?Loader2:Pen} disabled={!!sectionSigning} onClick={()=>{setSectionSigning(section.id);setTimeout(()=>{setSectionSigning(null);setSignedFields(p=>{const n=new Set(p);currentSectionChangedFields.forEach(k=>n.add(k));return n});setToast({msg:"Изменения в разделе подписаны ЭЦП",type:"success"})},1500)}} style={{background:accent}}>{sectionSigning===section.id?"Подписание...":"Подписать раздел ЭЦП"}</Btn>
            </div>}
            {currentSectionChangedFields.length>0&&currentSectionChangedFields.every(k=>signedFields.has(k))&&<div className="mt-5 pt-4 border-t border-slate-100 flex justify-end"><span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{color:B.green}}><Shield size={14}/>Изменения подписаны ЭЦП</span></div>}
          </div>
        </Card>}

        <div className="flex justify-between mb-5">
          {PROFILE_SECTIONS.indexOf(section)>0?<Btn variant="ghost" icon={ArrowLeft} onClick={()=>{const i=PROFILE_SECTIONS.indexOf(section);setActiveSection(PROFILE_SECTIONS[i-1].id)}}>Предыдущий</Btn>:<div/>}
          {PROFILE_SECTIONS.indexOf(section)<PROFILE_SECTIONS.length-1?<Btn variant="ghost" icon={ArrowRight} onClick={()=>{const i=PROFILE_SECTIONS.indexOf(section);setActiveSection(PROFILE_SECTIONS[i+1].id)}}>Следующий</Btn>:<div/>}
        </div>

        <Card className="p-5">
          <h3 className="font-semibold text-sm mb-3" style={{color:B.t1}}>Согласия</h3>
          <div className="space-y-2 text-xs" style={{color:B.t2}}>
            <div className="flex items-center gap-2"><CheckCircle size={13} style={{color:B.green}}/>Согласие на проверку, обработку, передачу данных</div>
            <div className="flex items-center gap-2"><CheckCircle size={13} style={{color:B.green}}/>Согласие на передачу информации банкам-корреспондентам</div>
            <div className="flex items-center gap-2"><CheckCircle size={13} style={{color:B.green}}/>Обязательство уведомлять об изменениях за 3 рабочих дня</div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs" style={{color:B.t3}}>Заполнено: 15.01.2026 · ЭЦП: Дерябина О.Н.</div>
        </Card>
      </div>
    </div>
  </div>;
};

// ═══ CREDITOR: OVERDUE INFO ══════════════════════════════
const CrOverdue = ({setActive,setInitialExpandDeal,setReturnTo}) => {
  const overdue=CR_DEALS.filter(d=>d.status==="overdue");
  if(overdue.length===0) return <div><PageHeader title="Просрочки" subtitle="Мониторинг просроченных уступок"/>
    <Card className="p-16 text-center"><div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:B.greenL}}><CheckCircle size={32} style={{color:B.green}}/></div><h3 className="text-xl font-bold mb-2" style={{color:B.green}}>Все уступки в срок ✓</h3><p className="text-sm" style={{color:B.t2}}>У вас нет просроченных обязательств. Всё идёт отлично!</p></Card></div>;

  return <div><PageHeader title="Просрочки" subtitle={`${overdue.length} просроченных уступок`}/>
    <Card className="p-4 mb-5" style={{background:B.accentL,borderColor:"#93C5FD"}}>
      <div className="flex items-start gap-3"><Shield size={18} style={{color:B.accent}} className="shrink-0 mt-0.5"/><div className="text-sm" style={{color:B.t1}}><strong>Безрегрессный факторинг:</strong> банк ЗАО «Нео Банк Азия» несёт риск неоплаты. Вам не нужно возвращать полученное финансирование. Банк самостоятельно работает с должником по возврату.</div></div>
    </Card>

    {overdue.map(d=>{const buyer=BUYERS.find(b=>b.id===d.buyerId);const daysOv=Math.abs(d.daysLeft);return <Card key={d.id} className="mb-4 overflow-hidden"><div className="h-1.5" style={{background:B.red}}/>
      <div className="p-5 flex items-start justify-between">
        <div><div className="flex items-center gap-3 mb-1"><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:B.accent}}>{d.id}</span><StatusBadge status="overdue"/></div><h3 className="font-bold text-lg" style={{color:B.t1}}>{buyer?.name}</h3></div>
        <div className="text-right"><div className="text-2xl font-bold" style={{color:B.red}}>{fmtByn(d.amount)}</div><div className="text-sm font-medium" style={{color:B.red}}>{daysOv} дн. просрочки</div></div>
      </div>
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl p-3" style={{background:B.greenL}}><div className="text-xs" style={{color:B.green}}>Вы получили</div><div className="font-bold" style={{color:B.green}}>{fmtByn(d.toReceive)}</div></div>
        <div className="rounded-xl p-3 bg-slate-50"><div className="text-xs" style={{color:B.t3}}>Статус от банка</div><div className="text-sm font-medium" style={{color:B.accent}}>Банк ведёт работу с должником</div></div>
      </div>
    </Card>})}
  </div>;
};

// ═══════════════════════════════════════════════════════════

// MAIN APP
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [ctx,setCtx]=useState("creditor");
  const [active,setActive]=useState("cr-dashboard");
  const [searchOpen,setSearchOpen]=useState(false);
  const [initialExpandDeal,setInitialExpandDeal]=useState(null);
  const [initialShowWizard,setInitialShowWizard]=useState(false);
  const [returnDealId,setReturnDealId]=useState(null);
  const [returnSupplyId,setReturnSupplyId]=useState(null);
  const [initialViewSupply,setInitialViewSupply]=useState(null);
  const [initialViewDoc,setInitialViewDoc]=useState(null);
  const [navStack,setNavStack]=useState([]);
  const pushNav=(page)=>setNavStack(p=>[...p,page]);
  const popNav=()=>{const s=[...navStack];const last=s.pop();setNavStack(s);return last};
  const returnTo=navStack.length>0?navStack[navStack.length-1]:null;
  const setReturnTo=(page)=>pushNav(page);
  const [initialThread,setInitialThread]=useState(null);
  const [notifOpen,setNotifOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [dark,setDark]=useState(false);
  const [confetti,setConfetti]=useState(false);
  const [profileDirty,setProfileDirty]=useState(false);
  const [exitGuard,setExitGuard]=useState(null);
  const [exitSigning,setExitSigning]=useState(false);
  const [exitToast,setExitToast]=useState(null);

  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t)},[]);
  useEffect(()=>{
    const h=e=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.tagName==="SELECT") return;
      if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearchOpen(true)}
      if(e.key==="Escape"){setSearchOpen(false);setNotifOpen(false)}
      if(e.key==="1"&&!e.metaKey&&!e.ctrlKey){setCtx("creditor");setActive("cr-dashboard")}
      if(e.key==="2"&&!e.metaKey&&!e.ctrlKey){setCtx("debtor");setActive("db-dashboard")}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);

  const doGo = page => { setActive(page); setLoading(true); setTimeout(()=>setLoading(false),300); if(page.startsWith("cr-")) setCtx("creditor"); if(page.startsWith("db-")) setCtx("debtor"); setProfileDirty(false); };
  const go = page => { if(profileDirty&&(active==="cr-profile"||active==="db-profile")&&page!==active){setExitGuard(page)} else {doGo(page)} };
  const triggerConfetti = () => { setConfetti(true); setTimeout(()=>setConfetti(false),3000); };

  const unreadCount = NOTIFICATIONS.filter(n=>n.ctx===ctx).length;

  const pages = {
    "cr-tasks":<CrTasks setActive={go} setInitialThread={setInitialThread} setInitialViewDoc={setInitialViewDoc}/>,
    "cr-dashboard":<CrDashboard setActive={go} setInitialThread={setInitialThread} setInitialExpandDeal={setInitialExpandDeal} setReturnTo={setReturnTo}/>,
    "cr-scoring":<CrScoring setActive={go}/>,
    "cr-mass":<CrMassScoring/>,
    "cr-buyers":<CrBuyers setActive={setActive} setInitialThread={setInitialThread} setInitialExpandDeal={setInitialExpandDeal} setInitialShowWizard={setInitialShowWizard} setReturnTo={setReturnTo}/>,
    "cr-partners":<PartnersPage ctx="creditor" setActive={go}/>,
    "cr-deals":<CrDeals setInitialExpandDeal={setInitialExpandDeal} setReturnDealId={setReturnDealId} setInitialViewDoc={setInitialViewDoc} setReturnTo={setReturnTo} initialShowWizard={initialShowWizard} onClearWizard={()=>setInitialShowWizard(false)} initialExpandDeal={initialExpandDeal} returnTo={returnTo} onReturnNav={()=>{const target=popNav();if(target)setActive(target)}} onClearExpand={()=>setInitialExpandDeal(null)} onSuccess={triggerConfetti} setActive={setActive} setInitialThread={setInitialThread}/>,
    "cr-overdue":<CrOverdue setActive={setActive} setInitialExpandDeal={setInitialExpandDeal} setReturnTo={setReturnTo}/>,
    "cr-documents":<CrDocuments setActive={setActive} setInitialThread={setInitialThread} initialViewDoc={initialViewDoc} onClearViewDoc={()=>setInitialViewDoc(null)} returnTo={returnTo} onReturn={()=>{const target=popNav();if(target){if(returnDealId){setInitialExpandDeal(returnDealId);setReturnDealId(null)}setActive(target)}else setViewDoc(null)}}/>,
    "cr-finance":<CrFinance setActive={setActive} setInitialExpandDeal={setInitialExpandDeal} setReturnTo={setReturnTo}/>,
    "cr-profile":<CompanyProfile ctx="creditor" isActualization={false} onDirtyChange={setProfileDirty}/>,
    "cr-messages":<MessagesPage ctx="creditor" setActive={setActive} initialThread={initialThread} onNavigateDeal={id=>{setInitialExpandDeal(id)}}/>,
    "cr-support":<SupportPage ctx="creditor"/>,
    "cr-settings":<CrSettings dark={dark} setDark={setDark}/>,
    "db-tasks":<DbTasks setActive={go} setInitialThread={setInitialThread} setInitialViewDoc={setInitialViewDoc}/>,
    "db-dashboard":<DbDashboard setActive={go} setInitialThread={setInitialThread} setInitialViewSupply={setInitialViewSupply} setReturnTo={setReturnTo}/>,
    "db-supplies":<DbSupplies setActive={setActive} setInitialThread={setInitialThread} setInitialViewDoc={setInitialViewDoc} setReturnTo={setReturnTo} setReturnSupplyId={setReturnSupplyId} setInitialViewSupply={setInitialViewSupply} initialViewSupply={initialViewSupply} onClearViewSupply={()=>setInitialViewSupply(null)} returnTo={returnTo} onReturnNav={()=>{const target=popNav();if(target)setActive(target)}}/>,
    "db-payments":<DbPayments setActive={setActive} setInitialThread={setInitialThread} setInitialViewSupply={setInitialViewSupply} setReturnTo={setReturnTo}/>,
    "db-limit":<DbLimit/>,
    "db-partners":<PartnersPage ctx="debtor" setActive={go}/>,
    "db-documents":<DbDocuments setActive={setActive} setInitialThread={setInitialThread} initialViewDoc={initialViewDoc} onClearViewDoc={()=>setInitialViewDoc(null)} returnTo={returnTo} onReturn={()=>{const target=popNav();if(target){if(returnSupplyId){setInitialViewSupply(returnSupplyId);setReturnSupplyId(null)}setActive(target)}else setViewDoc(null)}}/>,
    "db-profile":<CompanyProfile ctx="debtor" isActualization={false} onDirtyChange={setProfileDirty}/>,
    "db-messages":<MessagesPage ctx="debtor" setActive={setActive} initialThread={initialThread} onNavigateDeal={id=>{setInitialExpandDeal(id)}}/>,
    "db-support":<SupportPage ctx="debtor"/>,
    "db-settings":<DbSettings dark={dark} setDark={setDark}/>,
  };

  return <div className="flex" style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:dark?"#0F172A":B.bg,minHeight:"100vh"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
      @keyframes slide-in{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fade-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      @keyframes confetti-fall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(100vh) rotate(720deg)}}
      .animate-slide-in{animation:slide-in .3s ease-out}
      .animate-fade-up{animation:fade-up .4s ease-out both}
      .stagger-1{animation-delay:.05s}.stagger-2{animation-delay:.1s}.stagger-3{animation-delay:.15s}.stagger-4{animation-delay:.2s}
      *{box-sizing:border-box}
      ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
      select{appearance:auto}
    `}</style>
    <Sidebar ctx={ctx} setCtx={setCtx} active={active} setActive={go}/>
    <main className="flex-1 min-w-0 p-5 lg:p-7">
      <TopHeader ctx={ctx} active={active} onSearchOpen={()=>setSearchOpen(true)} onNotifOpen={()=>setNotifOpen(!notifOpen)} unreadCount={unreadCount}/>
      <PageTransition pageKey={active}>{loading?<Skeleton/>:pages[active]}</PageTransition>
    </main>
    <GlobalSearch open={searchOpen} onClose={()=>setSearchOpen(false)} setActive={go}/>
    <NotificationCenter open={notifOpen} onClose={()=>setNotifOpen(false)} ctx={ctx}/>
    <Confetti active={confetti}/>
    
    {/* Profile exit guard */}
    {exitGuard&&<Modal open={!!exitGuard} onClose={()=>setExitGuard(null)} title="Неподписанные изменения в анкете">
      <div className="rounded-xl p-4 mb-4" style={{background:"#FFF7ED"}}>
        <div className="flex items-start gap-3"><AlertTriangle size={20} style={{color:B.orange}}/><div>
          <div className="text-sm font-bold" style={{color:B.t1}}>В анкете компании есть неподписанные изменения</div>
          <div className="text-xs mt-1" style={{color:B.t2}}>Подпишите изменения ЭЦП, отмените их или вернитесь к редактированию.</div>
        </div></div>
      </div>
      <div className="flex gap-3">
        <Btn className="flex-1" icon={exitSigning?Loader2:Pen} disabled={exitSigning} onClick={()=>{setExitSigning(true);setTimeout(()=>{setExitSigning(false);const p=exitGuard;setExitGuard(null);setProfileDirty(false);doGo(p);setExitToast("Изменения в анкете подписаны ЭЦП и отправлены в банк")},1500)}} style={{background:B.accent}}>{exitSigning?"Подписание ЭЦП...":"Подписать ЭЦП и уйти"}</Btn>
        <Btn className="flex-1" variant="danger" icon={X} onClick={()=>{const p=exitGuard;setExitGuard(null);setProfileDirty(false);doGo(p)}}>Отменить изменения</Btn>

      </div>
    </Modal>}
    {exitToast&&<Toast message={exitToast} type="success" onClose={()=>setExitToast(null)}/>}
  </div>;
}
