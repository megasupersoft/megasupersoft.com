const PRODUCT_REPOS = [
  { name: 'FFFFinance', repo: 'DangerDrome/FFFFinance_app', website: 'https://ffffinance.org' },
  { name: 'OpenComp', repo: 'megasupersoft/OpenComp' },
  { name: 'NodeUI', repo: 'megasupersoft/NodeUI' },
  { name: 'FileUI', repo: 'megasupersoft/FileUI' },
  { name: 'Vampire Runners', repo: 'megasupersoft/VampireRunners' },
  { name: 'Renegade Cop', repo: 'megasupersoft/RenegadeCop' },
  { name: 'NeverEverland', repo: 'megasupersoft/NeverEverland' },
]

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'megasupersoft-dashboard',
  }
  if (config.githubToken) {
    headers['Authorization'] = `Bearer ${config.githubToken}`
  }

  const releases = await Promise.all(
    PRODUCT_REPOS.map(async (product) => {
      try {
        const release = await $fetch<{
          tag_name: string
          name: string
          published_at: string
          html_url: string
          body: string
          assets: Array<{ name: string; download_count: number; browser_download_url: string; size: number }>
        }>(`https://api.github.com/repos/${product.repo}/releases/latest`, { headers })

        return {
          product: product.name,
          repo: product.repo,
          website: product.website,
          tag: release.tag_name,
          name: release.name,
          published: release.published_at,
          url: release.html_url,
          body: release.body?.slice(0, 500) || '',
          downloads: release.assets.reduce((sum, a) => sum + a.download_count, 0),
          assets: release.assets.map((a) => ({
            name: a.name,
            downloads: a.download_count,
            url: a.browser_download_url,
            size: a.size,
          })),
        }
      } catch {
        return { product: product.name, repo: product.repo, website: product.website, tag: null }
      }
    }),
  )

  return releases
})
