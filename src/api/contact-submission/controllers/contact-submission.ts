/** Contact submission controller. Public writes use the dedicated route below. */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::contact-submission.contact-submission' as any, ({ strapi }) => ({
  async create(ctx) {
    const payload = ctx.request.body?.data ?? ctx.request.body ?? {};
    const { name, email, company, phone, message, sourcePage } = payload;

    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim() || typeof message !== 'string' || !message.trim() || typeof sourcePage !== 'string' || !sourcePage.trim()) {
      return ctx.badRequest('name, email, message, and sourcePage are required');
    }

    const entity = await strapi.service('api::contact-submission.contact-submission').create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: typeof company === 'string' ? company.trim() : undefined,
        phone: typeof phone === 'string' ? phone.trim() : undefined,
        message: message.trim(),
        sourcePage: sourcePage.trim(),
        status: 'pending'
      }
    });

    const sanitized = await this.sanitizeOutput!(entity, ctx);
    return this.transformResponse!(sanitized);
  }
}));
