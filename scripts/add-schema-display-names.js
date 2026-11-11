const fs = require('node:fs');
const path = require('node:path');

const labels = {
  contentLocale: '内容语言', title: '标题', name: '名称', slug: '网址别名',
  summary: '摘要', details: '详细介绍', description: '描述', blocks: '内容区块',
  cover: '封面图片', coverAlt: '封面图片替代文本', author: '作者', category: '分类',
  products: '关联产品', solutions: '关联解决方案', scenarios: '关联应用场景',
  cases: '关联客户案例', videos: '相关视频', faqs: '相关常见问题', avatar: '头像',
  email: '电子邮箱', articles: '相关文章', sortOrder: '排序', industry: '所属行业',
  customerProblem: '客户问题', originalPackaging: '原有包装', solution: '解决方案',
  results: '实施效果', gallery: '图片集', featured: '设为推荐', introTitle: '介绍标题',
  intro: '介绍内容', address: '地址', phone: '联系电话', officeHours: '办公时间',
  mapEmbedUrl: '地图嵌入地址', formTitle: '表单标题', formIntro: '表单介绍',
  company: '公司名称', message: '留言内容', sourcePage: '来源页面', status: '状态',
  question: '问题', answer: '回答', siteName: '网站名称', favicon: '网站图标',
  logo: '网站标志', logoAlt: '网站标志替代文本', siteDescription: '网站描述',
  defaultSeo: '默认搜索引擎优化', navigation: '导航菜单', footerText: '页脚文字',
  footerBusinessPhone: '商务电话', footerProductPhone: '产品咨询电话',
  footerAfterSalesPhone: '售后服务电话', footerWechat: '微信号', footerEmail: '联系邮箱',
  footerQrCode: '页脚二维码', footerQrCodeAlt: '二维码替代文本',
  footerQrCodeLabel: '二维码说明', footerLinks: '页脚链接', socialLinks: '社交媒体链接',
  sections: '页面区块', cta: '行动引导', content: '正文内容', customerPain: '客户痛点',
  packagingNeeds: '包装需求', file: '文件', externalUrl: '外部链接', label: '标签',
  icon: '图标', items: '项目', eyebrow: '眉题', image: '图片', video: '视频',
  imageAlt: '图片替代文本', iconAlt: '图标替代文本', linkLabel: '链接文字', linkUrl: '链接地址', groups: '分类组',
  highlights: '亮点', subtitle: '副标题', buttonLabel: '按钮文字',
  backgroundImage: '背景图片', article: '文章', cards: '卡片', slides: '幻灯片',
  partners: '合作伙伴', href: '链接地址', openInNewTab: '在新窗口打开', text: '文字',
  entries: '条目', advantages: '优势项', altText: '替代文本', files: '媒体文件',
  kind: '类型', body: '正文', metaTitle: 'SEO标题', metaDescription: 'SEO描述',
  shareImage: '分享图片', shareImageAlt: '分享图片替代文本', canonicalUrl: '规范链接',
  platform: '平台', value: '数值', date: '日期', targetType: '目标类型', product: '产品',
  scenario: '应用场景', case: '客户案例', seo: '搜索引擎优化', parent: '上级分类',
  children: '子分类', images: '图片', url: '网址', categories: '分类列表',
  defaultSeo: '默认搜索引擎优化', footerQrCodeLabel: '二维码说明',
};

function collectJsonFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectJsonFiles(file, predicate);
    return predicate(file) ? [file] : [];
  });
}

const files = [
  ...collectJsonFiles('src/api', (file) => path.basename(file) === 'schema.json'),
  ...collectJsonFiles('src/components', (file) => file.endsWith('.json')),
];
let added = 0;

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const schema = JSON.parse(source);
  if (!schema.attributes) continue;
  const missing = Object.keys(schema.attributes).filter((key) => !schema.attributes[key].displayName);
  const unknown = missing.filter((key) => !labels[key]);
  if (unknown.length) throw new Error(`${file}: missing Chinese labels for ${unknown.join(', ')}`);
  if (!missing.length) continue;

  const attributeStart = source.indexOf('{', source.indexOf('"attributes"'));
  let depth = 0;
  let quoted = false;
  let escaped = false;
  let attributeEnd = -1;
  for (let i = attributeStart; i < source.length; i += 1) {
    const char = source[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth += 1;
    else if (char === '}' && --depth === 0) {
      attributeEnd = i;
      break;
    }
  }
  if (attributeEnd < 0) throw new Error(`Could not locate attributes in ${file}`);

  const attributesText = source.slice(attributeStart, attributeEnd + 1);
  const edits = missing.map((key) => {
    const keyPattern = new RegExp(`^( {4})"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*\\{`, 'm');
    const match = keyPattern.exec(attributesText);
    if (!match) throw new Error(`Could not locate ${key} in ${file}`);
    const openBrace = attributeStart + match.index + match[0].lastIndexOf('{');
    const newline = source.includes('\r\n') ? '\r\n' : '\n';
    return {
      offset: openBrace + 1,
      text: `${newline}${match[1]}  "displayName": ${JSON.stringify(`${labels[key]}（${key}）`)},`,
    };
  }).sort((a, b) => b.offset - a.offset);

  let updated = source;
  for (const edit of edits) updated = updated.slice(0, edit.offset) + edit.text + updated.slice(edit.offset);
  JSON.parse(updated);
  fs.writeFileSync(file, updated);
  added += missing.length;
  console.log(`${file}: added ${missing.length}`);
}

console.log(`Added ${added} field labels across ${files.length} schemas.`);
