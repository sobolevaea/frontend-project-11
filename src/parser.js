const parse = (content) => {
  const parser = new DOMParser()
  const xmlString = content.data.contents
  const dom = parser.parseFromString(xmlString, 'application/xhtml+xml')
  const errorNode = dom.querySelector('parsererror')
  if (errorNode) {
    throw new Error(`notRss`)
  }

  const channelPosts = Array.from(dom.querySelectorAll('item')).map(post => ({
    title: post.querySelector('title').textContent,
    description: post.querySelector('description').textContent,
    url: post.querySelector('link').textContent,
  }))

  return {
    feed: {
      title: dom.querySelector('channel > title').textContent,
      description: dom.querySelector('channel > description').textContent,
    },
    posts: channelPosts,
  }
}

export default parse
