/** Restrict public API to contact creation; updates/deletes remain admin-only. */
export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact-submission.create',
      config: { auth: false }
    }
  ]
};
