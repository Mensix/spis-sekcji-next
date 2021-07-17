import { ref } from '@nuxtjs/composition-api'

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

    if (isNumberInRange(members, 0, 100) || members == null) return '0+'
    else if (isNumberInRange(members, 101, 500)) return '100+'
    else if (isNumberInRange(members, 501, 1000)) return '500+'
    else if (isNumberInRange(members, 1001, 2500)) return '1K+'
    else if (isNumberInRange(members, 2501, 5000)) return '2.5K+'
    else if (isNumberInRange(members, 5001, 10000)) return '5K+'
    else if (isNumberInRange(members, 10001, 25000)) return '10K+'
    else if (isNumberInRange(members, 25001, 50000)) return '25K+'
    else if (isNumberInRange(members, 50001, 100000)) return '50K+'
    else return '100K+'
  }

  return {
    memberRanges,
    getApproximateMembersCount,
  }
}
