import { LocalStorage, Notify } from 'quasar'

export default function () {
  function displayNotify(message, localStorageItem) {
    if (localStorageItem) {
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
    } else {
      Notify.create({
        message,
        icon: 'announcement',
        position: 'bottom-right',
        timeout: 5000,
        actions: [
          {
            label: 'OK',
            color: 'white',
          },
        ],
      })
    }
  }

  return {
    displayNotify,
  }
}
