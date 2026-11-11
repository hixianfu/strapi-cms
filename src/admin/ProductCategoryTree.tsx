import React, { useEffect, useMemo, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';

type Category = {
  id?: number | string;
  documentId?: string;
  name: string;
  slug?: string;
  contentLocale?: string;
  sortOrder?: number;
  parent?: Category | null;
  children?: Category[];
  products?: Category[];
};

type TreeNode = Category & { children: TreeNode[] };

const contentType = 'api::product-category.product-category';

function createSlug(name: string) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return slug || `category-${Date.now()}`;
}

function getErrorMessage(error: unknown) {
  const response = (error as {
    response?: {
      data?: {
        error?: { message?: string };
        message?: string;
      };
    };
  })?.response;
  return response?.data?.error?.message ?? response?.data?.message ?? (error instanceof Error ? error.message : '未知错误');
}

function unwrap(value: Category & { attributes?: Category }): Category {
  return value.attributes ? { ...value.attributes, id: value.id } : value;
}

function relationKey(value?: Category | { data?: Category | null } | null) {
  if (!value) return null;
  const relation = 'data' in value ? value.data : value;
  if (!relation) return null;
  const normalized = unwrap(relation as Category & { attributes?: Category });
  return normalized.documentId ?? normalized.id ?? null;
}

function buildTree(items: Category[]) {
  const nodes = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  items.forEach((item) => {
    const normalized = unwrap(item);
    const key = String(relationKey(normalized));
    nodes.set(key, { ...normalized, children: [] });
  });

  nodes.forEach((node) => {
    const parentKey = relationKey(node.parent);
    const parentNode = parentKey ? nodes.get(parentKey) : undefined;
    if (parentNode) parentNode.children.push(node);
    else roots.push(node);
  });

  const sortNodes = (list: TreeNode[]) => {
    list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name, 'zh-CN'));
    list.forEach((node) => sortNodes(node.children));
  };
  sortNodes(roots);
  return roots;
}

function flattenNested(items: Category[], parent?: Category | null): Category[] {
  return items.flatMap((item) => {
    const current = { ...unwrap(item), parent: parent ?? item.parent ?? null };
    return [current, ...(item.children?.length ? flattenNested(item.children, current) : [])];
  });
}

function TreeRow({ node, depth, expanded, onToggle, onAddChild, onDelete }: { node: TreeNode; depth: number; expanded: Set<string>; onToggle: (id: string) => void; onAddChild: (node: TreeNode) => void; onDelete: (node: TreeNode) => void }) {
  const key = String(node.documentId ?? node.id);
  const hasChildren = node.children.length > 0;
  const editId = node.documentId ?? node.id;

  return (
    <>
      <div style={{ alignItems: 'center', borderBottom: '1px solid #eaeaef', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 8rem 7rem 10rem', gap: 16, minHeight: 56, padding: '8px 20px' }}>
        <div style={{ alignItems: 'center', display: 'flex', gap: 8, paddingLeft: depth * 28 }}>
          {hasChildren ? (
            <button type="button" aria-label={expanded.has(key) ? `收起${node.name}` : `展开${node.name}`} onClick={() => onToggle(key)} style={{ background: 'transparent', border: 0, color: '#4945ff', cursor: 'pointer', fontSize: 18, height: 28, width: 28 }}>
              {expanded.has(key) ? '⌄' : '›'}
            </button>
          ) : <span style={{ display: 'inline-block', width: 28 }} />}
          <a href={`/admin/content-manager/collection-types/${contentType}/${editId}`} style={{ color: '#32324d', fontWeight: depth === 0 ? 600 : 400, textDecoration: 'none' }}>{node.name}</a>
        </div>
        <span style={{ color: '#666687', fontSize: 13 }}>{node.contentLocale === 'en' ? 'English' : '中文'}</span>
        <span style={{ color: '#666687', fontSize: 13 }}>{node.children.length} 个子分类</span>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => onAddChild(node)} style={{ background: '#fff', border: '1px solid #dcdce4', borderRadius: 4, color: '#4945ff', cursor: 'pointer', fontSize: 12, padding: '6px 9px' }}>添加子分类</button>
          <button type="button" onClick={() => onDelete(node)} style={{ background: '#fff', border: '1px solid #f0c4c1', borderRadius: 4, color: '#d02b20', cursor: 'pointer', fontSize: 12, padding: '6px 9px' }}>删除</button>
        </div>
      </div>
      {expanded.has(key) ? node.children.map((child) => <TreeRow key={String(child.documentId ?? child.id)} node={child} depth={depth + 1} expanded={expanded} onToggle={onToggle} onAddChild={onAddChild} onDelete={onDelete} />) : null}
    </>
  );
}

export default function ProductCategoryTree() {
  const { get, post, del } = useFetchClient();
  const [categories, setCategories] = useState<TreeNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogNode, setDialogNode] = useState<TreeNode | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', contentLocale: 'zh', sortOrder: '0' });
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    const response = await get(`/content-manager/collection-types/${contentType}`, {
      params: { pageSize: 500, sort: 'sortOrder:asc,name:asc', populate: 'parent,children,products' },
    });
    const payload = response.data?.results ?? response.data?.data ?? response.data ?? [];
    setCategories(buildTree(flattenNested(payload)));
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (!cancelled) await loadCategories();
      } catch {
        if (!cancelled) setError('产品分类加载失败，请刷新后重试。');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [get]);

  const openAddDialog = (node: TreeNode) => {
    setDialogNode(node);
    setForm({ name: '', slug: '', contentLocale: node.contentLocale ?? 'zh', sortOrder: '0' });
  };

  const createChild = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!dialogNode || !form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const parentId = dialogNode.documentId ?? dialogNode.id;
      if (!parentId) throw new Error('父分类缺少 documentId。');
      const name = form.name.trim();
      const slug = form.slug.trim() || createSlug(name);
      const response = await post(`/content-manager/collection-types/${contentType}`, {
        name,
        slug,
        contentLocale: form.contentLocale,
        sortOrder: Number(form.sortOrder) || 0,
        parent: { connect: [parentId] },
      });
      const created = response.data?.data ?? response.data?.result ?? response.data;
      const createdId = created?.documentId ?? created?.id;
      const createdAttributes = created?.attributes ?? created;
      if (!createdId || createdAttributes?.name !== name || !createdAttributes?.slug) {
        throw new Error('The category was not created with the submitted values.');
      }
      try {
        await post(`/content-manager/collection-types/${contentType}/${createdId}/actions/publish`);
      } catch {
        // Publishing can be disabled by project permissions; the created values remain valid.
      }
      setExpanded((current) => new Set(current).add(String(parentId)));
      setDialogNode(null);
      try {
        await loadCategories();
      } catch (reloadError) {
        setError(`子分类已创建，但列表刷新失败：${getErrorMessage(reloadError)}`);
      }
    } catch (createError) {
      setError(`子分类创建失败：${getErrorMessage(createError)}`);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (node: TreeNode) => {
    if (node.children.length) {
      setError('该分类仍有子分类，请先删除或移动子分类。');
      return;
    }
    if (node.products?.length) {
      setError('该分类仍关联产品，请先移除产品关联。');
      return;
    }
    if (!window.confirm(`确定删除分类“${node.name}”吗？此操作无法撤销。`)) return;
    try {
      await del(`/content-manager/collection-types/${contentType}/${node.documentId ?? node.id}`);
      await loadCategories();
    } catch {
      setError('分类删除失败，请确认该分类没有关联内容。');
    }
  };

  const allKeys = useMemo(() => {
    const keys: string[] = [];
    const visit = (items: TreeNode[]) => items.forEach((item) => { if (item.children.length) keys.push(String(item.documentId ?? item.id)); visit(item.children); });
    visit(categories);
    return keys;
  }, [categories]);

  const toggle = (key: string) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  return (
    <main style={{ background: '#f6f6f9', minHeight: '100vh', padding: 32 }}>
      <div style={{ margin: '0 auto', maxWidth: 1100 }}>
        <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ color: '#32324d', fontSize: 24, margin: 0 }}>产品分类树</h1>
            <p style={{ color: '#666687', margin: '8px 0 0' }}>按父子层级查看和管理产品分类。</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => setExpanded(new Set(allKeys))} style={{ background: '#fff', border: '1px solid #dcdce4', borderRadius: 4, color: '#4945ff', cursor: 'pointer', padding: '9px 14px' }}>全部展开</button>
            <button type="button" onClick={() => setExpanded(new Set())} style={{ background: '#fff', border: '1px solid #dcdce4', borderRadius: 4, color: '#4945ff', cursor: 'pointer', padding: '9px 14px' }}>全部收起</button>
          </div>
        </div>
        <section style={{ background: '#fff', border: '1px solid #eaeaef', borderRadius: 4, boxShadow: '0 2px 8px rgba(10,10,40,.04)', overflow: 'hidden' }}>
          <div style={{ background: '#fafafa', borderBottom: '1px solid #eaeaef', color: '#666687', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 8rem 7rem 10rem', gap: 16, padding: '13px 20px', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}><span>分类名称</span><span>内容语言</span><span>子分类</span><span style={{ textAlign: 'right' }}>操作</span></div>
          {loading ? <p style={{ color: '#666687', padding: 32 }}>正在加载产品分类...</p> : error ? <p style={{ color: '#d02b20', padding: 32 }}>{error}</p> : categories.length ? categories.map((node) => <TreeRow key={String(node.documentId ?? node.id)} node={node} depth={0} expanded={expanded} onToggle={toggle} onAddChild={openAddDialog} onDelete={deleteCategory} />) : <p style={{ color: '#666687', padding: 32 }}>暂无产品分类。</p>}
        </section>
        {dialogNode ? <div role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setDialogNode(null); }} style={{ alignItems: 'center', background: 'rgba(24,24,36,.45)', display: 'flex', inset: 0, justifyContent: 'center', position: 'fixed', zIndex: 10 }}>
          <form onSubmit={createChild} style={{ background: '#fff', borderRadius: 6, boxShadow: '0 12px 40px rgba(10,10,40,.2)', maxWidth: 460, padding: 24, width: 'calc(100% - 32px)' }}>
            <h2 style={{ color: '#32324d', fontSize: 18, margin: 0 }}>添加“{dialogNode.name}”的子分类</h2>
            <p style={{ color: '#666687', fontSize: 13, margin: '8px 0 20px' }}>新分类会自动归入当前父分类。</p>
            <label style={{ color: '#32324d', display: 'block', fontSize: 13, fontWeight: 600 }}>分类名称<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} style={{ border: '1px solid #dcdce4', borderRadius: 4, display: 'block', marginTop: 6, padding: '9px 10px', width: '100%' }} /></label>
            <label style={{ color: '#32324d', display: 'block', fontSize: 13, fontWeight: 600, marginTop: 14 }}>Slug（可选）<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} style={{ border: '1px solid #dcdce4', borderRadius: 4, display: 'block', marginTop: 6, padding: '9px 10px', width: '100%' }} /></label>
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', marginTop: 14 }}>
              <label style={{ color: '#32324d', fontSize: 13, fontWeight: 600 }}>内容语言<select value={form.contentLocale} onChange={(event) => setForm({ ...form, contentLocale: event.target.value })} style={{ border: '1px solid #dcdce4', borderRadius: 4, display: 'block', marginTop: 6, padding: '9px 10px', width: '100%' }}><option value="zh">中文</option><option value="en">English</option></select></label>
              <label style={{ color: '#32324d', fontSize: 13, fontWeight: 600 }}>排序值<input type="number" min="0" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} style={{ border: '1px solid #dcdce4', borderRadius: 4, display: 'block', marginTop: 6, padding: '9px 10px', width: '100%' }} /></label>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}><button type="button" onClick={() => setDialogNode(null)} style={{ background: '#fff', border: '1px solid #dcdce4', borderRadius: 4, color: '#32324d', cursor: 'pointer', padding: '9px 14px' }}>取消</button><button type="submit" disabled={saving} style={{ background: '#4945ff', border: 0, borderRadius: 4, color: '#fff', cursor: saving ? 'wait' : 'pointer', opacity: saving ? .7 : 1, padding: '9px 14px' }}>{saving ? '保存中...' : '创建分类'}</button></div>
          </form>
        </div> : null}
      </div>
    </main>
  );
}
