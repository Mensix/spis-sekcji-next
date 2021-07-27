export default function () {
  function setGroupLink(link) {
    return link
      .substring(link.indexOf('/groups/') + '/groups/'.length)
      .replace(/[^a-zA-Z0-9].*/gu, '')
  }

  return {
    setGroupLink,
  }
}
