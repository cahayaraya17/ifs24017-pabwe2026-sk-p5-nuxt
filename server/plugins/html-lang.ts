export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (htmlContext) => {
    htmlContext.htmlAttrs.push('lang="id"')
  })
  nitroApp.hooks.hook('render:response', (response) => {
    if (typeof response.body === 'string' && response.body.includes('<html')) {
      response.body = response.body.replace(/<html(?![^>]*\blang=)[^>]*>/i, '<html lang="id">')
    }
  })
})