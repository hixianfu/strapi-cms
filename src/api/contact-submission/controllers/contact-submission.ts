/** Contact submission controller. Public writes use the dedicated route below. */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-submission.contact-submission' as any, ({ strapi }) => ({
  async create(ctx) {
    const payload = ctx.request.body?.data ?? ctx.request.body ?? {};
    const { name, email, company, phone, message, sourcePage } = payload;

    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const normalizedMessage = typeof message === 'string' ? message.trim() : '';
    const normalizedSourcePage = typeof sourcePage === 'string' ? sourcePage.trim() : '';

    if (!normalizedName || !normalizedEmail || !normalizedMessage || !normalizedSourcePage) {
      return ctx.badRequest('name, email, message, and sourcePage are required');
    }
    if (normalizedName.length > 120 || normalizedEmail.length > 160 || normalizedMessage.length > 5000 || normalizedSourcePage.length > 500) {
      return ctx.badRequest('One or more fields exceed the allowed length');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return ctx.badRequest('A valid email address is required');
    }

    const entity = await strapi.service('api::contact-submission.contact-submission').create({
      data: {
        name: normalizedName,
        email: normalizedEmail,
        company: typeof company === 'string' ? company.trim().slice(0, 160) : undefined,
        phone: typeof phone === 'string' ? phone.trim().slice(0, 80) : undefined,
        message: normalizedMessage,
        sourcePage: normalizedSourcePage,
        status: 'pending'
      }
    });

    const sanitized = await this.sanitizeOutput!(entity, ctx);
    return this.transformResponse!(sanitized);
  }
}));
