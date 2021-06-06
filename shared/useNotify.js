import { LocalStorage, Notify } from 'quasar'

export default function () {
  function displayNotify(localStorageItem, message) {
    LocalStorage.getItem(localStorageItem) === null &&
      Notify.create({
        message,
        icon: 'announcement',
        position: 'bottom-right',
        timeout: 0,
        actions: [
          {
            label: 'OK',
            color: 'white',
            handler: () => LocalStorage.set(localStorageItem, true),
          },
        ],
      })
  }

  return {
    displayNotify,
  }
}
