import { ref } from '@nuxtjs/composition-api'
import firebase from 'firebase/app'
import 'firebase/database'
import { format } from 'date-fns'
import { Notify } from 'quasar'

export default function () {
  const memberRanges = ref([
    '0+',
    '100+',
    '500+',
    '1K+',
    '2.5K+',
    '5K+',
    '10K+',
    '25K+',
    '50K+',
    '100K+',
  ])

  function getApproximateMembersCount(members) {
    const isNumberInRange = (number, min, max) => number >= min && number <= max

    if (members === 0) return null
    if (isNumberInRange(members, 0, 100)) return '0+'
    else if (isNumberInRange(members, 101, 500)) return '100+'
    else if (isNumberInRange(members, 501, 1000)) return '500+'
    else if (isNumberInRange(members, 1001, 2500)) return '1K+'
    else if (isNumberInRange(members, 2501, 5000)) return '2.5K+'
    else if (isNumberInRange(members, 5001, 10000)) return '5K+'
    else if (isNumberInRange(members, 10001, 25000)) return '10K+'
    else if (isNumberInRange(members, 25001, 50000)) return '25K+'
    else if (isNumberInRange(members, 50001, 75000)) return '50K+'
    else if (isNumberInRange(members, 75001, 100000)) return '75K+'
    else if (isNumberInRange(members, 100001, 150000)) return '100K+'
    else if (isNumberInRange(members, 150001, 200000)) return '150K+'
    else if (isNumberInRange(members, 2000001, 250000)) return '200K+'
    else return '250K+'
  }

  function deleteGroup(dataset, index) {
    // https://stackoverflow.com/questions/54138520/firebase-returning-null-references-when-get-after-delete
    const todayDate = format(new Date(), 'dd/MM/R')
    const groups = {
      lastUpdateDate: todayDate,
      groups: dataset.groups
        .filter((x) => x.index !== index)
        .map(({ index, isFavourite, ...x }) => x)
        .sort((e, a) => a.members - e.members),
      name: dataset.name,
    }

    const dismiss = Notify.create({
      message: 'Czy chcesz usunąć tą grupę?',
      icon: 'delete',
      position: 'bottom-right',
      timeout: 0,
      actions: [
        {
          label: 'Tak',
          color: 'white',
          handler: () => firebase.database().ref(dataset.name).set(groups),
        },
        {
          label: 'Nie',
          color: 'white',
          handler: () => dismiss(),
        },
      ],
    })
  }

  return {
    memberRanges,
    getApproximateMembersCount,
    deleteGroup,
  }
}
