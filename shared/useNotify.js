import { LocalStorage, Notify } from 'quasar'

export default function () {
  function displayNotify(message, timeout, handler, localStorageItem) {
    LocalStorage.getItem(localStorageItem) === null &&
      Notify.create({
        message,
        icon: 'announcement',
        position: 'bottom-right',
        timeout: timeout || 0,
        actions: [
          {
            label: 'OK',
            color: 'white',
            handler: () => handler && LocalStorage.set(localStorageItem, true),
          },
        ],
      })
  }

  return {
    displayNotify,
  }
}
