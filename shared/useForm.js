export default function () {
  function pasteGroupLink(e) {
    const clipboardContent = e.clipboardData.getData('text')

    if (clipboardContent.includes('facebook.com/groups')) {
      return clipboardContent
        .substring(clipboardContent.indexOf('/groups/') + '/groups/'.length)
        .replace(/[^a-zA-Z0-9].*/gu, '')
    }
  }

  return {
    pasteGroupLink,
  }
}
